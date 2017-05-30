import path from 'path'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
import session from 'koa-session-minimal'
import bodyparser from 'koa-bodyparser'
import logger from 'koa-logger'
import cors from 'kcors'
import request from 'request'

const refreshUrl = 'http://localhost:3000/__browser_sync__?method=reload'
const configs = require('../configs')(/*配置名字符串*/);

const NODEENV = process.env.NODE_ENV == 'development'
const HTMLDIST = NODEENV ? configs.static.dev.html : configs.static.html;
const STATICSROOT = NODEENV ? configs.static.dev.dft : configs.static.dft;

const fkp = require('./fkp')
const app = new fkp()

app.use(session({
  key: 'agzgz-',
  cookie: {
    maxage: 24*3600*1000
  }
}))
app.views(HTMLDIST)
app.statics(configs.upload.root, {
  dynamic: true,
  prefix: '/uploader'
})
app.statics(configs.upload.doc, {
  dynamic: true,
  prefix: '/docs'
})
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
app.use(bodyparser())

async function startServer(){
  try {
    const server = await app.init()
    server.listen(configs.port, function(){
      if (NODEENV) {
        request(refreshUrl, function (error, response, body) {
          if (error) console.log('server will be start');
        })
      }
    })
  } catch (e) {
    console.error(e.stack)
  }
}

startServer()
