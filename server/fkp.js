import Koa from 'koa'
import aotoo from 'aotoo-common'   // global.Aotoo
import views from 'koa-views'
import statics from 'koa-static-cache'
import convert from 'koa-convert'
import fkp from './fkpcore'

const app = new Koa()

class aotooServer {
  constructor(){
    this.middlewares = []
    this.keys = ['agzgz gogogo']
    this._apis = {list: {}}
  }

  async use(midw){
    app.use(midw)
  }

  async statics(dist, opts, files){
    let dft = {
      dynamic: false,
      buffer: false,
      gzip: false
    }
    if (opts) {
      dft = _.merge(dft, opts)
    }

    app.use( convert(statics(dist, dft, files) ) )
  }

  async apis(obj){
    if (typeof obj == 'object') {
      this._apis = obj
    }
  }

  async views(dist, opts){
    let dft = {
      map: {
        html: (opts&&opts.html||'ejs')
      }
    }
    if (opts&&opts.extension) {
      dft.extension = opts.extension
    }
    if (opts&&opts.options) {
      dft.options = opts.options
    }
    app.use( views(dist, dft) )
  }

  async init(){
    return await _init.call(this)
  }
}


async function _init() {
  app.keys = this.keys
  const options = {
    apis: this._apis
  }
  const server = await fkp(app, options)
	app.on('error', async (err, ctx) => {
		logger.error('server error', err, ctx)
	})

  return server
}

module.exports = aotooServer
