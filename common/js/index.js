/*
 Aotoo
 react: React,
 reactDom: ReactDom,
 sax: SAX,
 _: lodash
 $: jquery2
 */

const isClient = ( function(){ return typeof window !== 'undefined' })()
const aotoo = require('./lib/common')
const transTree = require('./lib/tree')
const context = (()=>isClient ? window : global)() || {}
const combinex = require('./mixins/combinex')
const combineClass = require('./class/combine')
const wrap = require('./lib/wrap')
let Aotoo = context.Aotoo

// 实例化 class
function aotooBase(rctCls){
  this.reactClass = rctCls
}

if (!Aotoo) {
  const _aotoo = ( () => isClient ? aotoo.fAotoo() : aotoo.nAotoo() )()

  // 全局 Aotoo
  Aotoo = context.Aotoo = function(cfg){
    return new aotooBase(cfg)
  }

  for (let ele in _aotoo) {
    Aotoo[ele] = _aotoo[ele]
  }

  // 内嵌方法
  aotooBase.prototype = {}
  Aotoo.fn = aotooBase.prototype
  Aotoo.item = $item
  Aotoo.list = $list
  Aotoo.tree = $tree
  Aotoo.extend = _aotoo._.merge
  Aotoo.combinex = combinex
  Aotoo.CombineClass = combineClass
  Aotoo.wrap = wrap
  Aotoo.transTree = transTree
}

function $item(props, isreact){
  const Item = require('./subassembly/itemview/foxdiv')
  if (!props) return Item
  return <Item {...props} />
}

function $list(props, isreact){
  const List = require('./subassembly/listview')
  if (!props) return List
  return <List {...props} />
}

function $tree(props){
  if ( Array.isArray(props.data) ) {
    const treeData = transTree(props.data)
    return $list({data: treeData})
  }
}

module.exports = Aotoo
