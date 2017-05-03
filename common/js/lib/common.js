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
    if (typeof id == 'object') {
      if (id.nodeName) React.render(element, id)
    }
    if (typeof id == 'string') {
      return React.render(element, document.getElementById(id))
    }
    return element
  }
  return aotoo
}

// node 凹凸
function nAotoo(){
  aotoo.$ = require('cheerio')
  return aotoo
}

module.exports = {
  fAotoo: fAotoo,
  nAotoo: nAotoo
}
