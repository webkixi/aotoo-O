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
try {
  require('public/js/_init')
} catch (error) {
  console.log(error);
  console.log('=============== 建议 ==========');
  console.log(`
  public/js/_init/index.js为页面初始化提供钩子方法,
  该文件被打包进common.js中，"PAGELIEF"钩子中我们能够执行
  页面初始化的相关方法
  `);
}

$.fn.once = function (type, tgt, fn) {
  this.off(type, fn)
  this.on(type, tgt, fn)
  return this
}

pagelife.emit('pageStart')

module.exports = aotoo_enveriment
