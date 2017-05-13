/*
 Aotoo
 react: React,
 reactDom: ReactDom,
 sax: SAX,
 _: lodash
 $: jquery2
 */

// import combinex, {CombineClass} from './mixins/combinex'
import aotooBase, {combinex, CombineClass} from './aotoo'
const isClient = ( function(){ return typeof window !== 'undefined' })()
const context =  (()=>isClient ? window : global)() || {}
const common = require('./lib/common')
const transTree = require('./lib/tree')
const wrap = require('./lib/wrap')

let Aotoo = context.Aotoo

if (!Aotoo) {
  const _common = ( () => isClient ? common.fed() : common.backed() )()

  // 全局 Aotoo
  Aotoo = context.Aotoo = function(rctCls, acts){
    return aotooBase(rctCls, acts)
  }

  for (let ele in _common) {
    Aotoo[ele] = _common[ele]
  }

  // 内嵌方法
  Aotoo.item = $item
  Aotoo.list = $list
  Aotoo.tree = $tree
  Aotoo.extend = _common._.merge
  Aotoo.combinex = combinex
  Aotoo.CombineClass = CombineClass
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
