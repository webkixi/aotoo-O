var uuid = 1
function uniqueId(prefix) {
  if (!prefix) prefix = 'random_'
  uuid++
  return prefix + uuid
}

function dealParam(url, param, cb) {
  param = param || {}
  var paramType = typeof param
  if (url.indexOf('http') == 0) {
    switch (paramType) {
      case 'object':
        param._redirect = url
        break;
      case 'function':
        cb = param
        param = { _redirect: url }
        break;
      default:
        param = { _redirect: url }
        break;
    }
    url = '/redirect'
  }
  else {
    switch (paramType) {
      case 'function':
        cb = param
        param = {}
        break;
      case 'object':
        break;
      default:
        param = {}
        break;
    }
  }

  return {
    url: url,
    param: param,
    cb: cb
  }
}

function ajaxMethod(url, param, cb, method, sync) {
  var dtd = $.Deferred();
  function ccb(data, status, xhr) {
    if (status === 'success') {
      if (data && typeof data === 'string') {
        data = JSON.parse(data)
      }
      if (cb && typeof cb === 'function') {
        cb(data, status, xhr)
      }
      else {
        dtd.resolve(data, status, xhr)
        return dtd.promise()
      }
    }
  }
  if (method === 'GET') {
    param._stat_ = 'AJAXDATA'
  }

  return $.ajax({
    url: url,
    async: sync,
    type: method,
    data: param,
    timeout: 0,
    // dataType: "json",
  })
  .done(ccb)
  .fail(function (xhr, status, statusText) {
    console.log('网络不给力')
    console.log('错误状态码：' + xhr.status + "<br>时间：" + xhr.getResponseHeader('Date'))
    dtd.reject()
  })
}

function req( api, param, cb, method, sync ){
  // var url = api;
  // if (!method) method = 'POST'
  // if (url.indexOf('http://')===0){
  //   if (typeof param === 'object') {
  //     param._redirect = url
  //   }
  //   else if (typeof param === 'function'){
  //     cb = param; 
  //     param = {_redirect: url} 
  //   }
  //   else {
  //     param = {_redirect: url}
  //   }
  //   url = '/redirect'
  // }

  // if( typeof param ==='function' ) {
  //   cb = param
  //   param = undefined
  // }
  // else
  // if( typeof param !=='object' || !Object.keys(param).length ) {
  //   param = {} 
  // }

  if (!method) method = 'POST'
  var result = dealParam(api, param, cb)
  return ajaxMethod(result.url, result.param, result.cb, method, sync)
}

function get( api, param, cb ){
  return req( api, param, cb, 'GET', false)
}
function post( api, param, cb ){
  return req( api, param, cb, 'POST', false)
}

function syncGet(api, param, cb){
  return req( api, param, cb, 'GET', true)
}

function syncPost(api, param, cb){
  return req( api, param, cb, 'POST', true)
}

function __ajax(params) {
  var hook = SAX(uniqueId('__AJAX_'))
  this.on = hook.on
  this.one = hook.one
  this.hasOn = hook.hasOn
  this.off = hook.off
  this.emit = hook.emit
}

__ajax.prototype = {
  get: function(api, param, cb) {
    var result = dealParam(api, param, cb)
    var _param = this.emit('preget', result.param) || param
    return ajaxMethod(result.url, _param, result.cb, 'GET', false)
  },
  post: function(api, param, cb) {
    var result = dealParam(api, param, cb)
    var _param = this.emit('prepost', result.param) || param
    return ajaxMethod(result.url, _param, result.cb, 'POST', false)
  },
  sync: {
    get: function(api, param, cb) {
      var result = dealParam(api, param, cb)
      var _param = this.emit('sycnpreget', result.param) || param
      return ajaxMethod(result.url, _param, result.cb, 'GET', true)
    },
    post: function(api, param, cb) {
      var result = dealParam(api, param, cb)
      var _param = this.emit('syncprepost', result.param) || param
      return ajaxMethod(result.url, _param, result.cb, 'POST', true)
    }
  }
}

function $ajax(params) {
  return new __ajax(params)
}

$ajax.get = get
$ajax.post = post
$ajax.sync = {
  get: syncGet,
  post: syncPost
}

module.exports = $ajax
