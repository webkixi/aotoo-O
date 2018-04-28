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
const context = Aotoo.context
const libs = require('./libs')
context.ajax = libs.ajax
const pagelife = SAX('PAGELIFE')
require('public/js/_init')

$.fn.once = function (type, tgt, fn) {
  this.off(type, fn)
  this.on(type, tgt, fn)
  return this
}

pagelife.emit('pageStart')

module.exports = aotoo_enveriment
