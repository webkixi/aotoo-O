isClient = ( function(){ return typeof window !== 'undefined' })()
function noop(){}
var React    = require('react')
var ReactDom = require('react-dom')
var SAX      = require('fkp-sax')
var _        = require('lodash')

var aotoo = {
  react: React,
  reactDom: ReactDom,
  sax: SAX,
  _: _
}

// fed 凹凸
function fAotoo(){
  React.render = ReactDom.render;
  React.unmountComponentAtNode = ReactDom.unmountComponentAtNode;
  React.findDOMNode = ReactDom.findDOMNode;
  aotoo.$ = require('jquery')
  aotoo.render = function(element, id){
    React.render(element, document.getElementById(id))
  }
  return aotoo
}

// node 凹凸
function nAotoo(){
  aotoo.$ = require('cheerio')
  return aotoo
}

const that = (()=>isClient ? window: global)() || {}
let $aotoo = that.$aotoo
if (!$aotoo) {
  $aotoo = that.$aotoo = ( () => isClient ? fAotoo() : nAotoo() )()
  that.React = $aotoo.react
  that.ReactDom = $aotoo.reactDom
}

module.exports = $aotoo
