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

$.fn.once = function (type, tgt, fn) {
  this.off(type, fn)
  this.on(type, tgt, fn)
  return this
}

// Aotoo.CombineClass.prototype.inject = function(){
//   if (this.isClient) {
//     if (this.config.theme && this.config.autoinject) {
//       libs.inject.css(this.config.theme)  //注入样式
//     }
//     if (typeof src == 'function') {
//       src(libs.inject)
//     }
//   }
//   return this
// }

module.exports = aotoo_enveriment
