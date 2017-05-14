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

let Aotoo = context.Aotoo

if (!Aotoo) {
  const _common = ( () => isClient ? common.fed() : common.backed() )()

  // 全局 Aotoo
  Aotoo = context.Aotoo = aotooBase

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
  const Item = require('./suba/itemview/foxdiv')
  if (!props) return Item
  return <Item {...props} />
}

function $list(props, isreact){
  const List = require('./suba/listview')
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
