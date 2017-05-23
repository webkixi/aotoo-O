import path from 'path'
import request from 'request'
import {stringify} from 'querystring'
import {inherits} from 'util'
import getapis from 'apis/apilist'

let _request = function(){}
_request.prototype = {
  init: function(ctx){
    this.ctx = ctx || {}
    this.getApiList(ctx)
  }
}

let __request = inherits(_request, {
  getApiList: function(){
    this.apilist = getapis()
    this.fetchRemote = false
  },

  setOpts: function(api, options, method){
    let opts = {
      headers: {},
      json: {},
      timeout: 10000
    }
    if (options && _.isPlainObject(options)) opts = _.merge(opts, options)
    if (opts.json && opts.json.headers) {
      const _headers = _.extend({}, opts.json.headers)
      delete opts.json.headers
      opts.headers = _headers
    }
    if (opts.fttype){
      delete opts.fttype;
    }
    this.api = api
    this.opts = opts
  },

  _get: function(api, options, cb){
    this.setOpts(api, options, 'get')
    let _opts = this.opts
    let _api = this.api
    debug('post')
    debug('api--'+api)
    debug('- options: ');
    debug(_opts)
    if (_opts && _opts.json){
      let _q = stringify(_opts.json)
      api = api + '?' + _q;
      delete _opts.json
    }
    return new Promise( (res, rej) => {
      request.get(api, _opts, (err, rep, body)=>{
        if(err) { return rej("async search: no respons data")}
        if (rep.statusCode == 200){
          debug(body)
          return res(body)
        }
      })
    })
  },

  _post: function(api, options, cb){
    this.setOpts(api, options, 'post')
    let _opts = this.opts
    let _api = this.api
    _opts.headers['Content-type'] = 'application/json; charset=utf-8'
    debug('post')
    debug('api--'+_api)
    debug('- options: ');
    debug(_opts)
    return new Promise( (res, rej) => {
      request.post(_api, _opts, (err, rep, body)=>{
        if(err) {return rej("async search: no respons data")}
        if (rep.statusCode == 200){
          debug(body)
          return res(body)
        }
      })
    })
  }
})

let pullapi = inherits(__request, require('./pullapi')())
let mocks = inherits(pullapi, require('./mockapi')())
let requ = inherits(mocks, {})

module.exports = new requ()
