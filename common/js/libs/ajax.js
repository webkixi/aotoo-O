var src = "/";

function req( api, param, cb, method ){
  var url = api;
  if (!method) method = 'POST'
  if (url.indexOf('http://')===0){
    if (typeof param === 'object') param._redirect = url
    else if (typeof param === 'function'){ cb = param; param = {_redirect: url} }
    else param = {_redirect: url}
    url = '/redirect'
  }

  if( typeof param ==='function' ) cb = param
  if( typeof param !=='object' ) param = {}
  if( !Object.keys(param).length ) param = {}

  let dtd = $.Deferred();

  function ccb(data, status, xhr){
    if( status === 'success' ) {
      if (data && typeof data === 'string') data = JSON.parse(data)
      if( cb && typeof cb==='function' ) cb( data, status, xhr )
      else{
        dtd.resolve(data, status, xhr)
        return dtd.promise()
      }
    }
  }
  if (method==='GET') param._stat_ = 'AJAXDATA'
  return $.ajax({
    url: url,
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
  return req( api, param, cb, 'GET')
}
function post( api, param, cb ){
  return req( api, param, cb, 'POST')
}

module.exports = {
  get: get,
  post: post
}
