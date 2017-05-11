/**
 * itemHlc  [react的高阶组件，给子组件绑定itemMethod方法，componentDidMount后]
 * ComposedComponent  {React-Element}   [被包围的子组件]
 */

const isClient = (() => typeof window !== 'undefined')()
import SAX from 'fkp-sax'
import React from 'react';
const findDOMNode = ( isClient ? require('react-dom').findDOMNode : function(){} )
import cloneDeep from 'lodash.clonedeep'
import merge from 'lodash.merge'
import uniqueId from 'lodash.uniqueid'

const store = ( sax => {
  try {
    if (!sax) throw 'storehlc depend on SAX, SAX is fkp-sax, is a Global fun'
    return (id, ComposedComponent) => {
      if (!id) throw 'storehlc id must be set'
      return class extends ComposedComponent {
        constructor(props) {
          super(props)
          this.globalName = id
          const queryer = sax(id)
          queryer.data.originalState
          ? queryer.data.originalState[id] = cloneDeep(this.state)
          : ( ()=>{
            let temp = {}; temp[id] = cloneDeep(this.state)
            queryer.data.originalState = temp
          })()
          sax.bind(id, this)
        }
      }
    }
  } catch (e) {
    return ComposedComponent
  }
})(SAX)


export default function combineX(ComposedComponent, opts, cb){
  if (typeof opts == 'function') {
    cb = opts
    opts = undefined
  }
  if (!ComposedComponent) {
    console.log('请指定ComposedComponent');
    return
  }
  if ( typeof ComposedComponent == 'string' ||
    Array.isArray(ComposedComponent)
  ) { return }

  const globalName = uniqueId('Combinex_')
  let queryer = SAX(globalName, opts||{})
  // let queryer = SAX(globalName)

  /**
   * ComposedComponent 为 React element
   * @param  {[type]} React [description]
   * @return [type]         [description]
   */
  if (React.isValidElement(ComposedComponent)) {
    return class extends React.Component {
      constructor(props){
        super(props)
        this.intent = this.props.intent
        this.state = { show: true }

        this.show = this.show.bind(this)
        this.hide = this.hide.bind(this)
      }
      componentWillMount() {
        if (this.props.show == false) this.setState({ show: false })
      }
      show(){
        this.setState({
          show: true
        })
      }
      hide(){
        this.setState({
          show: false
        })
      }

      componentDidUpdate(){
        this.componentDidMount()
      }

      componentDidMount() {
        let self = this
  			let that = findDOMNode(this);
        const _ctx = {
          show: this.show,
          hide: this.hide
        }

        if( typeof this.props.itemDefaultMethod == 'function' ){
          self.props.itemDefaultMethod.call(_ctx, that, self.intent)
        }

        if (
          typeof cb == 'function' ||
          typeof this.props.rendered == 'function' ||
          typeof this.props.itemMethod == 'function'
        ) {
          const imd = cb || this.props.rendered || this.props.itemMethod
          imd.call(_ctx, that, self.intent)
        }

        super.componentDidMount ? super.componentDidMount() : ''
      }
      render(){
        return this.state.show ? ComposedComponent : <var/>
      }
    }
  }


  /**
   * ComposedComponent 为 React class
   * @type {[type]}
   */

  function dispatcher(key, props){
    const ctx = queryer.store.ctx[globalName]

    const liveState = merge({}, ctx.state)
    const oState = queryer.data.originalState[globalName]
    // const oState = JSON.parse(queryer.data.originalState[globalName])

    const queryActions = queryer.data

    const _state = {
      curState: liveState,
    }

    if (queryActions[key]) {
      const _tmp = queryActions[key].call(_state, oState, props)
      if (_tmp) {
        const target = merge({}, oState, _tmp)
        ctx.setState(target)
      }
    }
  }

  let ReactComponentMonuted = false
  class Temp extends ComposedComponent {
    constructor(props) {
      super(props);
			this.intent = this.props.intent || [];
    }

    componentDidUpdate(){
      this.componentDidMount()
    }

    componentDidMount(){
			let self = this
			let that = findDOMNode(this);

      const _ctx = {
        dispatch: dispatcher,
        refs: this.refs
      }

			if( typeof this.props.itemDefaultMethod == 'function' ){
        self.props.itemDefaultMethod.call(_ctx, that, self.intent)
			}

      if (
        typeof cb == 'function' ||
        typeof this.props.rendered == 'function' ||
        typeof this.props.itemMethod == 'function'
      ) {
        const imd = cb || this.props.rendered || this.props.itemMethod
        imd.call(_ctx, that, self.intent)
      }

      super.componentDidMount ? super.componentDidMount() : ''
      ReactComponentMonuted = true
		}
  }

  class Query {
    constructor(config){
      this.element = store(globalName, Temp)
      this.timer
      this.globalName = globalName
      this.saxer = queryer
      this.setActions = queryer.setActions
      this.on = queryer.on
      this.roll = queryer.roll
    }

    dispatch(key, props){
      clearTimeout(this.timer)
      this.timer = setTimeout(function() {
        if (ReactComponentMonuted) dispatcher(key, props)
      }, 0);
    }
  }

  if (opts.type == 'reactClass') {
    return Temp
  } else {
    return new Query()
  }
}


// BaseCombine
export class CombineClass{
  constructor(config){
    this.config = config
    this.isClient = (() => typeof window !== 'undefined')()
    this.element
    this.inject = this::this.inject
    this.combinex = this::this.combinex

    this.inject()
  }

  combinex(GridsBase, Actions={}){
    const that = this
    const CombX = combineX(GridsBase, Actions)
    this.x = CombX.element
    this.dispatch = CombX.dispatch

    this.setActions = function(key, func){
      const _actions = {}
      _actions[key] = func
      CombX.saxer.setActions(_actions)
    }
    this.on = this.setActions

    this.roll = function(key, data){
      CombX.saxer.roll(key, data)
    }
    this.emit = this.roll

    this.append = function(obj){
      CombX.saxer.append(obj)
      Object.keys(obj).map(function(item){
        const lowCaseName = item.toLowerCase()
        that[lowCaseName] = function(param){
          that.dispatch(item, param)
        }
      })
    }
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
      if (this.config.props) this.config.props.rendered = (this.config.rendered || this.rendered )
      else {
        this.config.props = {
          rendered: (this.config.rendered || this.rendered )
        }
      }
    }

    if (typeof id == 'string' || typeof id == 'object') {
      if (this.isClient) return this.browserRender(id, X)
    }

    return <X {...this.config.props}/>
  }
}
