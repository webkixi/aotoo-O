function req( api, param, cb, method, sync ){
  var url = api;
  if (!method) method = 'POST'
  if (url.indexOf('http://')===0){
    if (typeof param === 'object') {
      param._redirect = url
    }
    else if (typeof param === 'function'){
      cb = param; 
      param = {_redirect: url} 
    }
    else {
      param = {_redirect: url}
    }
    url = '/redirect'
  }

  if( typeof param ==='function' ) {
    cb = param
    param = undefined
  }
  else
  if( typeof param !=='object' || !Object.keys(param).length ) {
    param = {} 
  }

  var dtd = $.Deferred();

  function ccb(data, status, xhr){
    if( status === 'success' ) {
      if (data && typeof data === 'string') {
        data = JSON.parse(data)
      }
      if( cb && typeof cb==='function' ) {
        cb( data, status, xhr )
      }
      else{
        dtd.resolve(data, status, xhr)
        return dtd.promise()
      }
    }
  }
  if (method==='GET') {
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
  .fail(function(xhr,status,statusText){
    console.log('网络不给力')
    console.log('错误状态码：'+xhr.status+"<br>时间："+xhr.getResponseHeader('Date'))
    dtd.reject()
  })
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

module.exports = {
  get: get,
  post: post,
  sync: {
    get: get,
    post: post
  }
}
