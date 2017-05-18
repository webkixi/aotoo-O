const isClient = typeof window !== 'undefined'
const context = (()=>isClient ? window : global)() || {}

// 全局
context.React    = require('react'),
context.ReactDom = ( C => C ? require('react-dom') : require('react-dom/server'))(isClient)
context.SAX      = require('fkp-sax')
context._        = require('lodash')
context.$        = ( C => C ? require('jquery') : require('cheerio'))(isClient)

function custom(){
  if (isClient) {
    React.render = ReactDom.render;
    React.unmountComponentAtNode = ReactDom.unmountComponentAtNode;
    React.findDOMNode = ReactDom.findDOMNode;
  }
  return {}
}
module.exports = custom()
