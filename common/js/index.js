/*
 Aotoo
 react: React,
 reactDom: ReactDom,
 sax: SAX,
 _: lodash
 $: jquery2
 */

// import aotooBase, {combinex, CombineClass, wrap} from './aotoo'
const common = require('./lib/common')
import aotooBase, {combinex, CombineClass, wrap} from 'aotoo'
const isClient = ( function(){ return typeof window !== 'undefined' })()
const context =  (()=>isClient ? window : global)() || {}
const _common = ( () => isClient ? common.fed() : common.backed() )()

let Aotoo = context.Aotoo
if (!Aotoo) {
  Aotoo = context.Aotoo = aotooBase
  for (let ele in _common) {
    Aotoo[ele] = _common[ele]
  }
}

// const isClient = ( function(){ return typeof window !== 'undefined' })()
// const context =  (()=>isClient ? window : global)() || {}
// import aotooBase, {combinex, CombineClass, wrap} from 'aotoo'
// let Aotoo = context.Aotoo
// if (!Aotoo) {
//   Aotoo = context.Aotoo = aotooBase
// }

module.exports = Aotoo
