/*
 Aotoo
 react: React,
 reactDom: ReactDom,
 sax: SAX,
 _: lodash
 $: jquery2
 */
const aotoo_enveriment = require('aotoo-common')
const isClient = Aotoo.isClient
const context  = (()=>isClient ? window : global)() || {}
const libs = require('./libs')
context.ajax = libs.ajax
context.inject = libs.inject

module.exports = aotoo_enveriment
