import path from 'path'
import request from 'request'
import {stringify} from 'querystring'

function inherits( Super, protos, staticProtos ) {
  var child;
  if ( typeof protos === 'function' ) {
    child = protos;
    protos = null;
  } else if ( protos && protos.hasOwnProperty('constructor') ) {
    child = protos.constructor;
  } else {
    child = function() {
      return Super.apply( this, arguments );
    }
  }
  _.merge( child, Super, staticProtos || {} )
  child.__super__ = Super.prototype
  child.prototype = Super.prototype
  protos && _.merge( child.prototype, protos )
  return child;
}

let _request = function(opts){
  this.opts = opts
  this.apilist = this.opts.apis
  this.fetchRemote = false
}
_request.prototype = {
  init: function(ctx){
    this.ctx = ctx || {}
  }
}

let __request = inherits(_request, {

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
let requ = inherits(pullapi, {})
// let pullapi = inherits(__request, require('./pullapi')())
// let mocks = inherits(pullapi, require('./mockapi')())
// let requ = inherits(mocks, {})

module.exports = function(opts){
  return new requ(opts)
}
