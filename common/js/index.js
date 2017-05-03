/*
 Aotoo
 react: React,
 reactDom: ReactDom,
 sax: SAX,
 _: lodash
 $: jquery2
 */

// const isClient = ( function(){ return typeof window !== 'undefined' })()
// const aotoo = require('./lib/global')
// const context = (()=>isClient ? window: global)() || {}
//
// let Aotoo = context.Aotoo
// if (!Aotoo) {
//   Aotoo = context.Aotoo = ( () => isClient ? aotoo.fAotoo() : aotoo.nAotoo() )()
//   context.React = Aotoo.react
//   context.ReactDom = Aotoo.reactDom
// }
//
// module.exports = Aotoo


const isClient = ( function(){ return typeof window !== 'undefined' })()
const aotoo = require('./lib/common')
const context = (()=>isClient ? window : global)() || {}
let Aotoo = context.Aotoo

function reallyReturn(wrap, isreact){
  let reactElement
  if (React.isValidElement(wrap)) reactElement = wrap
  else if (wrap.render) {
    reactElement = isClient ? wrap : wrap.render()
  }
  if (reactElement) {
    return reactElement
  }
}

function $item(props, isreact){
  const Item = require('./subassembly/itemview/foxdiv')
  return <Item {...props} />
}

function $list(props, isreact){
  let List = require('./subassembly/listview')
  const Component = <List {...props} />
  return reallyReturn(Component, isreact)
}

// 实例化 class
function aotooBase(cfg){
  this.config = cfg
}

if (!Aotoo) {
  const _aotoo = ( () => isClient ? aotoo.fAotoo() : aotoo.nAotoo() )()

  // 全局化
  context.React = _aotoo.react
  context.ReactDom = _aotoo.reactDom
  context.SAX = _aotoo.sax
  context._ = _aotoo._
  context.$ = _aotoo.$


  // 内嵌方法
  const _extend = _aotoo._.merge
  const _tree = ''
  const _item = $item
  const _list = $list

  const _combinex = ''
  const _ajax = ''

  // 实例化
  aotooBase.prototype = {

  }

  Aotoo = context.Aotoo = function(cfg){
    return new aotooBase(cfg)
  }

  for (let ele in _aotoo) {
    Aotoo[ele] = _aotoo[ele]
  }

  // Aotoo.react = _aotoo.react
  // Aotoo.reactDom = _aotoo.reactDom
  // Aotoo.render = _aotoo.render
  // Aotoo._ = _aotoo._
  // Aotoo.$ = _aotoo.$
  // Aotoo.SAX = _aotoo.sax

  Aotoo.fn = aotooBase.prototype

  Aotoo.extend = _extend
  Aotoo.combinex = _combinex
  Aotoo.tree = _tree
  Aotoo.list = _list
  Aotoo.item = _item
  Aotoo.ajax = _ajax
}

module.exports = Aotoo
