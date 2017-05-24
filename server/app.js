import Koa from 'koa'
import mount from 'koa-mount'
import convert from 'koa-convert'
import Bodyparser from 'koa-bodyparser'
import session from 'koa-session-minimal'
import logger from 'koa-logger'
import cors from 'kcors'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'

import aotoo from 'aotoo';            global.Aotoo = aotoo   // global.{React|ReactDom|$|_}
import cache from './common/cache';   global.Cache = cache
import localDB from './db/diskdb';    global.LocalStore = localDB

import fkp from './fkp'
import socketio from './common/wsocket';   global.Sio = socketio.sio
import statics from './common/static';
import render from './common/render'


const app = new Koa()

export default async function init() {
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
    debug(err.stack)
	})

  return server
}
