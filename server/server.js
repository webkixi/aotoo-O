import fs from 'fs'
import Path from 'path'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
import session from 'koa-session-minimal'
// import redisStore from 'koa-redis'
import logger from 'koa-logger'
import cors from 'kcors'
import request from 'request'
import aks from 'aotoo-koa-server'

// node index.js --port 8080 --config xxx
// pm2 start index.js -- --port 8080 --config xxx
var argv = process.argv.slice(2)
var margv = require('minimist')(argv);

const refreshUrl = 'http://localhost:3000/__browser_sync__?method=reload'
const envConfig = ( ()=>margv.config ? margv.config : undefined )()
const configs = require('../configs')(envConfig);
global.Configs = configs

const NODEDEV = process.env.NODE_ENV == 'development'
// const _VERSIONPATH = Path.join(configs.static.out, margv.version||configs.version)
const _VERSIONPATH = configs.static.dft
const _STATICSROOT = NODEDEV ? Path.join(_VERSIONPATH, 'dev') : _VERSIONPATH
const _STATICLINKROOT = Path.join(configs.static.out, 'target')

const STATICSROOT = fs.existsSync(_STATICLINKROOT) 
? margv.version 
  ? _STATICSROOT : ( ()=>{
    const rootStat = fs.statSync(_STATICLINKROOT)
    return rootStat.isDirectory() ? _STATICLINKROOT : _STATICSROOT
  })() 
: _STATICSROOT

const HTMLDIST = Path.join(STATICSROOT, 'html')
const PUBLICPATH = configs.public
Configs.runtime = {
  statics: {
    root: STATICSROOT,
    js: Path.join(STATICSROOT, '/js'),
    css: Path.join(STATICSROOT, '/css'),
    html: Path.join(STATICSROOT, '/html'),
    img: Path.join(__dirname, '../public/images')
  }
}


function getMapJson(){
  const mapFilePath = NODEDEV ? configs.mapDevJson : configs.mapJson
  if (fs.existsSync(mapFilePath)) return require(mapFilePath)
  else {
    // static js files mapper
    return {
      js: {
        /**
         * common: '/js/common.js',
         * abc: '/js/abc.js
         */
      },
         
      // static css files mapper
      css: {
        /**
         * common: '/css/common.css',
         * abc: '/css/abc.css
         */
      }
    }
  }
}

async function startServer(){
  let mapperJson = getMapJson()
  mapperJson.public = PUBLICPATH
  const app = aks({
  // const app = require('./koaserver')({
    keys: ['agzgz gogogo'],
    apis: { list: {} },
    index: CONFIG.root,
    pages: Path.join(__dirname, './pages'),
    mapper: mapperJson,
    pluginsFolder: Path.resolve(__dirname, './plugins')
  })

  app.use(session({
    key: 'agzgz-',
    cookie: {
      maxage: 24*3600*1000
    }
  }))

  app.views(HTMLDIST)

  app.statics(configs.static.uploads, {
    dynamic: true,
    prefix: '/uploader'
  })

  app.statics(Path.join(Configs.plugins.markdownDocsRoot, '../'), {
    dynamic: true,
    prefix: '/myimgs'
  })

  app.statics(configs.static.doc, {
    dynamic: true,
    prefix: '/docs'
  })

  // app.statics(configs.static.img, {
  app.statics(Path.join(__dirname, '../public/images'), {
    dynamic: true,
    prefix: '/images'
  })

  // /js
  const pblc = PUBLICPATH
  if (pblc.js) {
    const _js = pblc.js
    if (_js.indexOf('http') == -1) {
      app.statics(STATICSROOT + '/js', {
        prefix: pblc.js,
        dynamic: true,
        buffer: false,
        gzip: true
      })
    }
  }

  // /css
  if (pblc.css) {
    const _css = pblc.css
    if (_css.indexOf('http') == -1) {
      app.statics(STATICSROOT + '/css', {
        prefix: pblc.css,
        dynamic: true,
        buffer: false,
        gzip: true
      })
    }
  }

  app.statics(STATICSROOT+'/html', {
    prefix: pblc.root ? pblc.root : '/',
    buffer: false,
    gzip: true,
    filter: function(file) {
      const obj = Path.parse(file)
      if (obj.ext == '.js' || obj.ext == '.css') {
        return file
      }
    }
  })

  //get
  app.use(conditional())
  app.use(etag())
  app.use(logger())  
  app.use(cors()) // 设置跨域

  try {
    const server = await app.init()
    server.listen((margv.port||configs.port), function(){
      if (NODEDEV) {
        request(refreshUrl, function (error, response, body) {
          if (error) console.log('server will be start');
          console.log('server restart');
        })
      }
    })
  } catch (e) {
    console.error(e.stack)
  }
}

startServer()