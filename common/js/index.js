/*
 Aotoo
 react: React,
 reactDom: ReactDom,
 sax: SAX,
 _: lodash
 $: jquery2
 */

import combinex, {CombineClass} from './mixins/combinex'
const isClient = ( function(){ return typeof window !== 'undefined' })()
const aotoo = require('./lib/common')
const transTree = require('./lib/tree')
const context = (()=>isClient ? window : global)() || {}
// const combinex = require('./mixins/combinex')
// const combineClass = require('./class/combine')
const wrap = require('./lib/wrap')
let Aotoo = context.Aotoo

// 实例化 class
function aotooBase(rctCls, acts){
  const extend = require('lodash.merge')

  let keynames = Object.keys(acts)
  const lowKeyNames = keynames.map( item => item.toLowerCase() )
  const upKeyNames = keynames

  class Temp extends CombineClass {
    constructor(config={}) {
      super(config)
      this.rClass = rctCls
      this.acts = acts
      this.combinex(rctCls, acts)
    }

    setConfig(config){
      this.config = config || {}
      return this
    }

    setProps(props){
      this.config.props = props
      return this
    }
  }

  Temp.prototype = ( proptype => {
    for (let ii=0; ii<lowKeyNames.length; ii++) {
      const actName = upKeyNames[ii]
      proptype[lowKeyNames[ii]] = function(param){
        this.dispatch(actName, param)
        return this
      }
    }
    return proptype
  })(Temp.prototype)

  return new Temp()

}

if (!Aotoo) {
  const _aotoo = ( () => isClient ? aotoo.fAotoo() : aotoo.nAotoo() )()

  // 全局 Aotoo
  Aotoo = context.Aotoo = function(rctCls, acts){
    return aotooBase(rctCls, acts)
  }

  for (let ele in _aotoo) {
    Aotoo[ele] = _aotoo[ele]
  }

  // 内嵌方法
  Aotoo.item = $item
  Aotoo.list = $list
  Aotoo.tree = $tree
  Aotoo.extend = _aotoo._.merge
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
