const isClient = typeof window !== 'undefined'
const context = isClient ? window : global
const React    = (typeof React != 'undefined' ? React : require('react'))
const reactDom = ( C => typeof ReactDOM != 'undefined' ? ReactDOM : typeof ReactDom != 'undefined' ? ReactDom : C ? require('react-dom') : require('react-dom/server'))(isClient)
const render   = ( C => C ? reactDom.render : reactDom.renderToString)(isClient)

if (!context.React) {
  context.React = React
  context.ReactDom = reactDom
}

import combinex, {CombineClass, wrap} from 'react-combinex'
const suba = require('./suba')
let extension = {plugins: {}}

export {combinex, CombineClass, wrap}

export default function aotoo(rctCls, acts, opts){
  let keynames = Object.keys(acts)
  const lowKeyNames = keynames.map( item => item.toLowerCase() )
  const upKeyNames = keynames

  class Temp extends CombineClass {
    constructor(config={}) {
      super(config)
      let ext = {}
      const plugins = extension.plugins
      Object.keys(plugins).map( item => {
        if (typeof plugins[item] == 'function') {
          ext[item] = this::plugins[item]
        }
      })
      this.extension.plugins = ext
      this.combinex(rctCls, acts)
    }
  }

  // Temp.prototype = ( proptype => {
  //   for (let ii=0; ii<lowKeyNames.length; ii++) {
  //     const actName = upKeyNames[ii]
  //     proptype[lowKeyNames[ii]] = function(param){
  //       this.dispatch(actName, param)
  //       return this
  //     }
  //   }
  //   return proptype
  // })(Temp.prototype)

  return new Temp(opts)
}

// 支持plugins插件，可同时外挂在aotoo及在react class内部中使用
aotoo.plugins = function(key, fun){
  aotoo[key] = fun
  extension.plugins[key] = fun
}

// 支持前端render
function fedRender(element, id){
  if (typeof id == 'object') {
    if (id.nodeName) render(element, id)
  }
  if (typeof id == 'string') {
    return render(element, document.getElementById(id))
  }
  return element
}

function nodeRender(element){
  return render(reactElement)
}

aotoo.plugins('item', suba.item)
aotoo.plugins('list', suba.list)
aotoo.plugins('tree', suba.tree)
aotoo.plugins('transTree', suba.transTree)
aotoo.plugins('wrap', wrap)
aotoo.combinex = combinex
aotoo.CombineClass = CombineClass
aotoo.render = isClient ? fedRender : nodeRender
