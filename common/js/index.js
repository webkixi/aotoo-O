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

module.exports = require('aotoo-common')
const libs = require('./libs')
context.ajax = libs.ajax