import path from 'path'
import request from 'request'
import {stringify} from 'querystring'
import { inherits, objtypeof } from 'libs'
let debug = Debug('modules:fetch:pulldata')

module.exports = function(){
  return {
    _parseClientForm: function(api, param={}, method='get'){
      let url = undefined
      this.fetchRemote = false
      // if(objtypeof(param)!=='object') return [null, { message: 'pullApiData === 请指定正确的参数'}]
      if(!api) return [null, { message: 'pullApiData === 请指定正确的参数'}]
      if(objtypeof(param)!=='object') param = {}

      /**
       前端通过api.requ('http://www.xxx.com/api')获取外部远程数据
       http://www.xxx.com/api部分会被存在parma._redirect的key值中
       api会自动转成 'redirect'
       ajax的方法(post/get)，通过param参数传入，key值名为ajaxtype，这个等同于jq的名字
      */
      if (api.indexOf('redirect')===0){
        url = param._redirect;
        delete param._redirect
        if (param.ajaxtype){
          method = param.ajaxtype
          delete param.ajaxtype
        }
        if (param && param.method) {
          method = param.method
          delete param.method
        }
        let len = Object.keys(param)
        if (len.length===0) param = {}
      }

      /*** db api *****
      /****************
      else if (api.indexOf('$')===0){
        // method = 'post'
        // url = 'http://localhost:8070/'+api;
        var _param = {
          fromnode: true
        }
        if (api.indexOf('/')>-1) {
          var tmp = api.split('/')
          if (tmp.length===1){
            _param.cat = api;
          }
          else
          if (tmp.length===2){
            _param.cat = tmp[0]
            _param.title = tmp[1]
          }
          else
          if (tmp.length===3){
            _param.cat = tmp[0]
            _param.title = tmp[1]
            _param.id = tmp[2]
          }
        }
        else {
          _param.cat = api;
        }
        _param.body = param
        let db = require('server/db/mongo/index')
        let tmp_method = this.method
        this.omethod = this.method
        this.method = 'NODE'

        let ctrl = control(this, _param)
        let tmp_data = yield db.init.call(this, _param, ctrl)

        this.method = tmp_method;
        this.omethod = false;
        return tmp_data;
      }
      */

      else if (api.indexOf('http')===0) {
        this.fetchRemote = true
        method = 'get'
        url = api
        // if (param && param.method) {
        //   method = param.method
        //   delete param.method
        // }
      }

      else {
        url = this.apilist.list[api]
        if( !url ) return [null, null]
        // if (param && param.method){
        //   method = param.method
        //   delete param.method
        // }
      }

      let query=undefined
      method = method.toLowerCase();
      if (method==='get')  query = {json: param}
      if (method==='post') query = {json: param}
      return [url, query]
    },

    get: async function(api, param){
      debug('get:'+ api)
      let [_api, _param] = this._parseClientForm(api, param, 'get')
      if (!_api) return Errors['60001']
      if (_param && _param.json && _param.json.test && _param.json.test == '123') delete _param.json.test
      if (_param && _param.json && _param.json._stat_ ) delete _param.json._stat_
      if (CONFIG.apis.mock) {
        return await this.mock(api, _param)
      } else {
        let _data = await this._get(_api, _param)
        return {data: _data}
      }
    },

    post: async function(api, param){
      debug('post:'+ api);
      let [_api, _param] = this._parseClientForm(api, param, 'post')
      if (!_api) return Errors['60001']
      if (_param && _param.form && _param.form.test && _param.form.test == '123') delete _param.form.test
      if (CONFIG.apis.mock) {
        return await this.mock(api, _param)
      } else {
        let _data = await this._post(_api, _param)
        return {data: _data}
      }
    }
  }
}
