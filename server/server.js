import fs from 'fs'
import Path from 'path'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
import session from 'koa-session-minimal'
import logger from 'koa-logger'
import cors from 'kcors'
import request from 'request'

var argv = process.argv.slice(2)
var margv = require('minimist')(argv);

const refreshUrl = 'http://localhost:3000/__browser_sync__?method=reload'
const configs = require('../configs')(/*配置名字符串, 全局变量 CONFIG*/);

const NODEDEV = process.env.NODE_ENV == 'development'
const HTMLDIST = NODEDEV ? configs.static.dev.html : configs.static.html;
const STATICSROOT = NODEDEV ? configs.static.dev.dft : configs.static.dft;

function getMapJson(){
  const mapFilePath = NODEDEV ? CONFIG.mapDevJson : CONFIG.mapJson
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
  const mapperJson = getMapJson()
  const app = require('aotoo-koa-server')({
    keys: ['agzgz gogogo'],
    apis: { list: {} },
    index: CONFIG.root,
    pages: Path.join(__dirname, './pages'),
    mapper: mapperJson,
    pluginsFolder: Path.resolve(__dirname, './plugins')
  })

  Aotoo.inject.mapper = mapperJson

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

  app.statics(configs.static.doc, {
    dynamic: true,
    prefix: '/docs'
  })

  app.statics(configs.static.img, {
    dynamic: true,
    prefix: '/images'
  })

  // /css /js
  app.statics(STATICSROOT, {
    dynamic: true,
    buffer: false,
    gzip: true
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