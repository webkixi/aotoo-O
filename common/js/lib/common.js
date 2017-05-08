const isClient = ( function(){ return typeof window !== 'undefined' })()
function noop(){}
let aotoo = {
  react    : require('react'),
  reactDom : (isClient ? require('react-dom') : require('react-dom/server')),
  sax      : require('fkp-sax'),
  _        : require('lodash')
}

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
  return aotoo
}

// node 凹凸
function nAotoo(){
  aotoo.$ = require('cheerio')
  aotoo.render = function(element){
    const reactDomServer = aotoo.reactDom
    return reactDomServer.renderToString(reactElement)
  }
  return aotoo
}

module.exports = {
  fAotoo: fAotoo,
  nAotoo: nAotoo
}
