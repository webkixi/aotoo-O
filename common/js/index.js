/*
 Aotoo
 react: React,
 reactDom: ReactDom,
 sax: SAX,
 _: lodash
 $: jquery2
 */

const isClient = typeof window !== 'undefined'
const context =  (()=>isClient ? window : global)() || {}
require('./lib/common')
import aotooBase, {combinex, CombineClass, wrap} from 'aotoo'

let Aotoo = context.Aotoo
if (!Aotoo) {
  Aotoo = context.Aotoo = aotooBase
}

module.exports = Aotoo
