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
const aotoo_enveriment = require('aotoo-common')
const libs = require('./libs')
context.ajax = libs.ajax
context.inject = libs.inject

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
