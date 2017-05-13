import combinex, {CombineClass} from 'react-combinex'

export {combinex, CombineClass}
export default function aotoo(rctCls, acts){
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
