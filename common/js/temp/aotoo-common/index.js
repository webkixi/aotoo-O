/*
 Aotoo
 react: React,
 reactDom: ReactDom,
 sax: SAX,
 _: lodash
 $: jquery2
 */

const isClient = typeof window !== 'undefined'
const context  = (()=>isClient ? window : global)() || {}

// require('./lib/common')
context.$ = require('jquery')
context._ = require('lodash')
context.SAX = require('fkp-sax')
const aotooBase = require('../aotoo').default

React.render = ReactDom.render;
React.unmountComponentAtNode = ReactDom.unmountComponentAtNode;
React.findDOMNode = ReactDom.findDOMNode;

let Aotoo = context.Aotoo
if (!Aotoo) {
  Aotoo = context.Aotoo = aotooBase
}

module.exports = Aotoo
