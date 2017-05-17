/*
 Aotoo
 react: React,
 reactDom: ReactDom,
 sax: SAX,
 _: lodash
 $: jquery2
 */

// import aotooBase, {combinex, CombineClass, wrap} from './aotoo'
import aotooBase, {combinex, CombineClass, wrap} from 'aotoo'
const isClient = ( function(){ return typeof window !== 'undefined' })()
const context =  (()=>isClient ? window : global)() || {}
const common = require('./lib/common')
const transTree = require('./lib/tree')
const suba = require('./suba')

let Aotoo = context.Aotoo

if (!Aotoo) {
  const _common = ( () => isClient ? common.fed() : common.backed() )()

  // 全局 Aotoo
  Aotoo = context.Aotoo = aotooBase

  for (let ele in _common) {
    Aotoo[ele] = _common[ele]
  }

  // 内嵌方法
  Aotoo.item = suba.item
  Aotoo.list = suba.list
  Aotoo.tree = suba.tree
  Aotoo.extend = _common._.merge
  Aotoo.combinex = combinex
  Aotoo.CombineClass = CombineClass
  Aotoo.wrap = wrap
  Aotoo.transTree = transTree
}

module.exports = Aotoo
