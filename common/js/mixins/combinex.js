/**
 * itemHlc  [react的高阶组件，给子组件绑定itemMethod方法，componentDidMount后]
 * ComposedComponent  {React-Element}   [被包围的子组件]
 */

const isClient = typeof window !== 'undefined'
const context = ( C => C ? window : global)(isClient) || {}
import SAX from 'fkp-sax'
import cloneDeep from 'lodash.clonedeep'
import merge from 'lodash.merge'
import uniqueId from 'lodash.uniqueid'
import React from 'react';
const ReactDom    = ( C => C ? require('react-dom') : require('react-dom/server'))(isClient)
const findDOMNode = ( C => C ? ReactDom.findDOMNode : function(){} )(isClient)
const render      = ( C => C ? ReactDom.render : ReactDom.renderToString)(isClient)

const componentMonuted = SAX('ReactComponentMonuted')
const store = ( sax => {
  try {
    if (!sax) throw 'storehlc depend on SAX, SAX is fkp-sax, is a Global fun'
    return (id, ComposedComponent, extension) => {
      if (!id) throw 'storehlc id must be set'
      return class extends ComposedComponent {
        constructor(props) {
          super(props)
          this.globalName = id

          // 初始化，组件没有渲染的状态
          const unmounted = {}
          unmounted[id] = false
          componentMonuted.append(unmounted)

          const queryer = sax(id)
          queryer.data.originalState
          ? queryer.data.originalState[id] = cloneDeep(this.state)
          : ( ()=>{
            let temp = {}; temp[id] = cloneDeep(this.state)
            queryer.data.originalState = temp
          })()
          sax.bind(id, this)

          if (typeof extension == 'object') {
            if (typeof extension.plugins == 'object' && !Array.isArray(extension.plugins)) {
              const plugins = extension.plugins
              Object.keys(extension.plugins).map( item => {
                if (typeof plugins[item] == 'function') {
                  // plugins[item] = this::plugins[item]
                  this[item] = plugins[item]
                }
              })
            }
          }
        }
      }
    }
  } catch (e) {
    return ComposedComponent
  }
})(SAX)

const isFunction = function(target){
  return typeof target == 'function'
}


/**
 * [dealWithReactElement 处理传入为react element 的场景，一般用于wrap]
 * @param  {react element} CComponent [description]
 * @return {react class}            [description]
 */
function dealWithReactElement(CComponent){
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
        const imd = isFunction(cb) ? cb : this.props.rendered || this.props.itemMethod
        imd.call(_ctx, that, self.intent)
      }

      super.componentDidMount ? super.componentDidMount() : ''
    }
    render(){
      return this.state.show ? CComponent : <span/>
    }
  }
}

/**
 * [combineX description]
 * @param  {react class | react element}   ComposedComponent [description]
 * @param  {object}   opts              [description]
 * @param  {Function} cb                [description]
 * @return {react class | object}       [description]
 */

export default function combineX(ComposedComponent, opts, cb){
  if (!ComposedComponent) return

  if ( typeof ComposedComponent == 'string' || Array.isArray(ComposedComponent) ) return

  let extension = cb

  if (typeof opts == 'function') {
    cb = opts
    opts = undefined
  }

  const globalName = uniqueId('Combinex_')

  let queryer = SAX(globalName, opts||{})

  // will return React class for type 2
  let returnReactClass = false
  if (opts.type == 'reactClass') {
    returnReactClass = true
    delete opts.type
  }





  /**
   * type 1
   * ComposedComponent 为 React element
   * @param  {[type]} React [description]
   * @return [type]         [description]
   */
  if (React.isValidElement(ComposedComponent)) {
    return dealWithReactElement(ComposedComponent)
  }






  /**
   * type 2
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

    componentWillUnmount(){
      const gname = this.globalName
      componentMonuted.data[gname] = false
      // ReactComponentMonuted = false
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
        const imd = isFunction(cb) ? cb : this.props.rendered || this.props.itemMethod
        imd.call(_ctx, that, self.intent)
      }

      const gname = this.globalName
      componentMonuted.data[gname] = true
      super.componentDidMount ? super.componentDidMount() : ''
      // ReactComponentMonuted = true
		}
  }

  class Query {
    constructor(config){
      this.element = store(globalName, Temp, extension)
      this.timer
      this.globalName = globalName
      this.saxer = queryer
      this.setActions = queryer.setActions
      this.on = queryer.on
      this.roll = queryer.roll
      this.hasMounted = this::this.hasMounted
    }

    hasMounted(){
      const gname = this.globalName
      return componentMonuted.data[gname]
    }

    dispatch(key, props){
      const that = this
      clearTimeout(this.timer)
      this.timer = setTimeout(function() {
        const hasMounted = that.hasMounted()
        if (hasMounted) dispatcher(key, props)
      }, 0);
    }
  }

  if (returnReactClass) {
    return store(globalName, Temp, extension)
  } else {
    return new Query()
  }
}


// CombineClass

function browserRender(id, X){
  if (typeof id == 'string') {
    return render(<X {...this.config.props}/>, document.getElementById(id))
  }

  else if (typeof id == 'object' && id.nodeType) {
    return render(<X {...this.config.props}/>, id)
  }
}

export class CombineClass{
  constructor(config){
    this.config = config
    this.isClient = isClient
    this.extension = {}
    this.element
    browserRender = this::browserRender

    this.inject()
  }

  combinex(GridsBase, Actions={}){
    const that = this
    const CombX = combineX(GridsBase, Actions, this.extension)
    this.x = CombX.element
    this.globalName = CombX.globalName
    this.dispatch = CombX::CombX.dispatch
    this.hasMounted = CombX::CombX.hasMounted

    this.setActions = function(key, func){
      const _actions = {}
      _actions[key] = func
      CombX.saxer.setActions(_actions)
      return this
    }
    this.on = this.setActions

    this.roll = function(key, data){
      CombX.saxer.roll(key, data)
      return this
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
      return this
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
    return this
  }

  setConfig(config){
    this.config = config || {}
    return this
  }

  setProps(props){
    this.config.props = props
    return this
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
      if (this.isClient) return browserRender(id, X)
    }

    const _props = this.config.props || {}
    return <X {..._props}/>
  }
}
