import Koa from 'koa'
import Bodyparser from 'koa-bodyparser'
import session from 'koa-session-minimal'
import logger from 'koa-logger'
import cors from 'kcors'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'

// import aotoo from 'common/js/index.js'   // global.Aotoo
import aotoo from 'aotoo-common'   // global.Aotoo
import cache from './common/cache';   global.Cache = cache
// import localDB from './common/diskdb';    global.LocalStore = localDB

import fkp from './fkpcore'
import socketio from './common/wsocket';   global.Sio = socketio.sio
import statics from './common/static';
import render from './common/render'

let extend = []
const app = new Koa()

function use(fun){
  extend.push(fun)
  return use
}

export default class aotooServer {
  constructor(){
    this.middlewares = []
  }

  async use(midw){
    this.middlewares.push(midw)
  }

  async init(){
    if (this.middlewares.length) {
      this.middlewares.forEach( item => {
        if (item) app.use(item())
      })
    }
    return await init()
  }
}

async function _init() {
  app.keys = ['agzgz gogogo']

  //get
  app.use(conditional())

  // add etags
  app.use(etag())

  //静态资源目录
	statics(app)

	// 渲染
	app.use(render())

	app.use(session({
		key: 'agzgz-',
    cookie: {
      maxage: 24*3600*1000
    }
	}))

  // body解析
  app.use(Bodyparser())

  // 记录所用方式与时间
  app.use(logger())

  // 设置跨域
  app.use(cors())

  // fkp/router模块
  let server = socketio.init(app)  //global SIO = {on, emit, use}
  await fkp(app)
  socketio.run()

	app.on('error', async (err, ctx) => {
		logger.error('server error', err, ctx)
	})

  return server
}
