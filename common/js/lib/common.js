const isClient = ( function(){ return typeof window !== 'undefined' })()
const context = (()=>isClient ? window : global)() || {}
function noop(){}

let aotoo = {
  react    : require('react'),
  reactDom : (isClient ? require('react-dom') : require('react-dom/server')),
  sax      : require('fkp-sax'),
  _        : require('lodash')
}

// 全局
context.React    = aotoo.react
context.ReactDom = aotoo.reactDom
context.SAX      = aotoo.sax
context._        = aotoo._

// fed 凹凸
function fAotoo(){
  aotoo.react.render = aotoo.reactDom.render;
  aotoo.react.unmountComponentAtNode = aotoo.reactDom.unmountComponentAtNode;
  aotoo.react.findDOMNode = aotoo.reactDom.findDOMNode;
  aotoo.$ = require('jquery')
  aotoo.render = function(element, id){
    if (typeof id == 'object') {
      if (id.nodeName) aotoo.reactDom.render(element, id)
    }
    if (typeof id == 'string') {
      return aotoo.reactDom.render(element, document.getElementById(id))
    }
    return element
  }

  // 全局$
  context.$ = aotoo.$
  return aotoo
}

// node 凹凸
function nAotoo(){
  aotoo.$ = require('cheerio')
  aotoo.render = function(element){
    const reactDomServer = aotoo.reactDom
    return reactDomServer.renderToString(reactElement)
  }

  // 全局$
  context.$ = aotoo.$
  return aotoo
}

module.exports = {
  fed: fAotoo,
  backed: nAotoo
}
