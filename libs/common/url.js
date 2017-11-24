
/**
/* 2015-1-13 yc
/* url解析
/* @url   http://abc.com:8080/dir/index.html?id=255&m=hello#top
//SAMPLE
// var myURL = parseURL('http://abc.com:8080/dir/index.html?id=255&m=hello#top');
// alert(myURL.file); // = 'index.html'
// myURL.hash; // = 'top'
// myURL.host; // = 'abc.com'
// myURL.query; // = '?id=255&m=hello'
// myURL.params; // = Object = { id: 255, m: hello }
// myURL.path; // = '/dir/index.html'
// myURL.segments; // = Array = ['dir', 'index.html']
// myURL.port; // = '8080'
// myURL.protocol; // = 'http'
// myURL.source; // = 'http://abc.com:8080/dir/index.html?id=255&m=hello#top'
*/
var isClient = typeof window != 'undefined'

var urlParse = function (url) {
  if(!url){
    console.log('非法参数，请重新检查！');
    return;
  }
  var anchor = document.createElement('a');
  anchor.href = url;
  return {
    source: url,
    protocol: anchor.protocol.replace(':',''),
    host: anchor.hostname,
    port: anchor.port,
    query: anchor.search,
    params: (function(){
      var ret = {},
      seg = anchor.search.replace(/^\?/,'').split('&'),
      len = seg.length, i = 0, str;
      for (; i < len; i++) {
        if (!seg[i])  continue;
        str = seg[i].split('=');
        ret[str[0]] = str[1];
      }
      return ret;
    })(),
    file: (anchor.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
    hash: anchor.hash.replace('#',''),
    path: anchor.pathname.replace(/^([^\/])/,'/$1'),
    relative: (anchor.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
    segments: anchor.pathname.replace(/^\//,'').split('/')
  }
}

//json数据转换成query查询
//如 {x:1,y:2}    转化后 ?x=1&y=2
var json2url = function(obj){
  var url = '',
      keys = Object.keys(obj);

  if (!obj || typeof obj !== 'object') {
    return false;
  }

  keys.map (function(item,i){
    if(i===(keys.length-1)){
      url += item + '=' + obj[item];
    }
    else {
      url += item + '=' + obj[item] + '&';
    }
  })
  return url;
}

// 更换location.href，仅仅只是更换
function replaceState(tag){
  var url = urlParse(location.href);
  var params = url.params;
  if (params[tag]){
    var _src = url.relative.replace(tag+'='+url.params[tag], '').replace('?&', '?').replace('?#','#').replace('&&', '&').replace('&#', '#')
    history.replaceState(null,null, _src)
    setTimeout(function(){ history.replaceState(null,null, _src) }, 0)
  }
}

//url处理,将URL参数转换为json对象
//?code=1&title='aaa'  =>   {'code':1,'title':aa}
function queryString(url){
  var _search = '';
  if (url){
    _search = urlParse(url).query;
  } else _search = location.search
  var arr = _search.substring(1).split('&');
  var query = {};
  for(var i=0;i<arr.length;i++){
    var inner = arr[i].split('=');
    query[inner[0]] = inner[1];
  }
  return query;
}


/*
 * resful url 的params参数，与node端路由匹配相同
 * prefix: [String]  路由前缀
*/
function queryParams(prefix){
  if (prefix) {
    let pathname = location.pathname.replace(prefix, '')
    if (pathname) {
      let [cat, title, id, ...other] = pathname.indexOf('/')==0 ? pathname.substring(1).split('/') : pathname.split('/')
      return {cat, title, id, other}
    }
  } else {
    let [cat, title, id, ...other] = location.pathname.substring(1).split('/')
    return {cat, title, id, other}
  }
}

module.exports = {
  json2url,
  replaceState,
  queryString,
  queryParams,
  urlParse
}
