import fs from 'fs'
import Path from 'path'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
import session from 'koa-session-minimal'
import logger from 'koa-logger'
import cors from 'kcors'
import request from 'request'
import aks from 'aotoo-koa-server'

function getMapJson(){
  const mapFilePath = Configs.runtime.mode ? Configs.mapDevJson : Configs.mapJson
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
  mapperJson.public = Configs.runtime.public
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
      maxAge: 24*3600*1000
    }
  }))

  app.views(Configs.runtime.statics.html)

  app.statics(Configs.static.uploads, {
    dynamic: true,
    prefix: '/uploader'
  })

  app.statics(Path.join(Configs.plugins.markdownDocsRoot, '../'), {
    dynamic: true,
    prefix: '/myimgs'
  })

  app.statics(Configs.static.doc, {
    dynamic: true,
    prefix: '/docs'
  })

  // app.statics(Configs.static.img, {
  app.statics(Configs.runtime.statics.img, {
    dynamic: true,
    prefix: '/images'
  })

  // /js
  const pblc = Configs.runtime.public
  if (pblc.js) {
    const _js = pblc.js
    if (_js.indexOf('http') == -1) {
      app.statics(Configs.runtime.statics.js, {
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
      app.statics(Configs.runtime.statics.css, {
        prefix: pblc.css,
        dynamic: true,
        buffer: false,
        gzip: true
      })
    }
  }

  app.statics(Configs.runtime.statics.html, {
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
    server.listen((Configs.runtime.port), function(){
      if (Configs.runtime.mode) {
        request(Configs.runtime.refreshUrl, function (error, response, body) {
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