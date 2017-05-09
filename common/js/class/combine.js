// import {inject} from 'libs'
import combineX from '../mixins/combinex'

// BaseCombine
export default class  {
  constructor(config){
    this.config = config
    this.isClient = (() => typeof window !== 'undefined')()
    this.element
    this.inject = this::this.inject
    this.combinex = this::this.combinex

    this.inject()
  }

  combinex(GridsBase, Actions={}){
    const CombX = combineX(GridsBase, Actions)
    this.x = CombX.element
    this.dispatch = CombX.dispatch
    this.setActions = function(key, func){
      const _actions = {}
      _actions[key] = func
      CombX.saxer.setActions(_actions)
    }
    this.roll = function(key, data){
      CombX.saxer.roll(key, data)
    }
    this.on = this.setActions
  }

  inject(src){
    if (this.isClient) {
      // const ij = inject()
      // if (this.config.theme && this.config.autoinject) {
      //   ij.css(['/css/m/'+this.config.theme])  //注入样式
      // }
      // if (typeof src == 'function') {
      //   src(ij)
      // }
      // return ij
    }
  }

  browserRender(id, X){
    if (typeof id == 'string') {
      return React.render(<X {...this.config.props}/>, document.getElementById(id))
    }

    else if (typeof id == 'object' && id.nodeType) {
      return React.render(<X {...this.config.props}/>, id)
    }
  }

  render(id, cb){
    id = id || this.config.container
    const X = this.x

    if (typeof id == 'function' || typeof cb == 'function') {
      this.config.rendered = typeof id == 'function' ? id : cb
    }
    if ( typeof this.config.rendered == 'function' || typeof this.rendered == 'function' ) {
      this.config.props.rendered = (this.config.rendered || this.rendered )
    }

    if (typeof id == 'string' || typeof id == 'object') {
      if (this.isClient) return this.browserRender(id, X)
    }

    return <X {...this.config.props}/>
  }
}
