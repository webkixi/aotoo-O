isClient = ( function(){ return typeof window !== 'undefined' })()
function noop(){}

const React    = require('react')
const ReactDom = require('react-dom')
const SAX      = require('fkp-sax')
const _        = require('lodash')

const aotujs = {
  react: React,
  reactDom: ReactDom,
  sax: SAX,
  _: _,
}

// fed 凹凸
function fAotu(){
  console.log(ReactDom)
  React.render = ReactDom.render;
  React.unmountComponentAtNode = ReactDom.unmountComponentAtNode;
  React.findDOMNode = ReactDom.findDOMNode;
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

const contex = ( ()=> isClient ? window : global )()
let $aot = contex.$aot
if (!$aot) {
  $aot = isClient ? fAotu() : nAotu()
}

module.exports = $aot
