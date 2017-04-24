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
  React.render = ReactDom.render;
  React.unmountComponentAtNode = ReactDom.unmountComponentAtNode;
  React.findDOMNode = ReactDom.findDOMNode;
  aotujs.$ = require('jquery')
  return aotujs
}

// node 凹凸
function nAotu(){
  aotujs.$ = require('cheerio')
  return aotujs
}

const that = (()=>isClient ? window: global)() || {}
let $aot = that.$aot
if (!$aot) {
  $aot = that.$aot = ( () => isClient ? fAotu() : nAotu() )()
}

module.exports = $aot
