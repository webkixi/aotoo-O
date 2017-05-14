import combinex, {CombineClass} from 'react-combinex'
// import combinex, {CombineClass} from './mixins/combinex'

export {combinex, CombineClass, wrap}

const wrap = combinex

let extension = {plugins: {}}

export default function aotoo(rctCls, acts){
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

aotoo.plugins = function(key, fun){
  extension.plugins[key] = fun
}
