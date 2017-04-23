isClient = ( function(){ return typeof window !== 'undefined' })()
function noop(){}
var React    = require('react')
var ReactDom = require('react-dom')
var SAX      = require('fkp-sax')
var _        = require('lodash')

var aotujs = {
  react: React,
  reactDom: ReactDom,
  sax: SAX,
  _: _,
}

// fed 凹凸
function fAotu(){
  React.render = ReactDOM.render;
  React.unmountComponentAtNode = ReactDOM.unmountComponentAtNode;
  React.findDOMNode = ReactDOM.findDOMNode;
  aotujs.$ = require('jquery')
  window.$aot = aotujs
  return aotujs
}

// node 凹凸
function nAotu(){
  aotujs.$ = require('cheerio')
  global.$aot = aotujs
  return aotujs
}


module.exports = function(){
  if (typeof $aot !== 'undefined') return
  return isClient ? fAotu() : nAotu()
}
