/**
 * React-combinex
 * 增强react的用法，贴近jquery的使用方式
 */
const isClient = typeof window !== 'undefined'
const context = ( C => C ? window : global)(isClient) || {}
import cloneDeep from 'lodash.clonedeep'
import merge from 'lodash.merge'
import uniqueId from 'lodash.uniqueid'
const SAX = ( ()=> typeof SAX != 'undefined' ? SAX : require('fkp-sax'))()
const React = (typeof React != 'undefined' ? React : require('react'))
const reactDom = ( C => typeof ReactDOM != 'undefined' ? ReactDOM : typeof ReactDom != 'undefined' ? ReactDom : C ? require('react-dom') : require('react-dom/server'))(isClient)
const findDOMNode = ( C => C ? reactDom.findDOMNode : function(){} )(isClient)
const render      = ( C => C ? reactDom.render : reactDom.renderToString)(isClient)

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
function dealWithReactElement(CComponent, opts, cb){
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

      super.componentDidMount ? super.componentDidMount() : ''

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

  let queryer = SAX(globalName)
  if (opts) { queryer.append(opts) }

  // will return React class for type 2
  let returnReactClass = false
  if (typeof opts == 'object' && opts.type == 'reactClass') {
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
    return dealWithReactElement(ComposedComponent, opts, cb)
  }






  /**
   * type 2
   * ComposedComponent 为 React class
   * @type {[type]}
   */

  function dispatcher(key, props, QueryCtx){
    const ctx = queryer.store.ctx[globalName]

    const liveState = cloneDeep(ctx.state)
    const oState = queryer.data.originalState[globalName]
    // const oState = JSON.parse(queryer.data.originalState[globalName])

    const queryActions = queryer.data

    // const _state = {
    //   curState: liveState,
    // }

    queryActions.curState = liveState
    QueryCtx.data = liveState.data

    if (queryActions[key]) {
      const _tmp = queryActions[key].call(queryActions, oState, props)
      if (_tmp) {
        // const target = merge({}, oState, _tmp)
        ctx.setState(_tmp)
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

      super.componentDidMount ? super.componentDidMount() : ''

      const _ctx = {
        // state: queryer.data.originalState[globalName],
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

      queryer.roll('rendered')
		}
  }

  class Query {
    constructor(config){
      this.config = config
      this.element = store(globalName, Temp, extension)
      this.timer
      this.globalName = globalName
      this.saxer = queryer
      this.setActions = queryer.setActions
      this.on = queryer.on
      this.roll = queryer.roll
      this.data

      this.hasMounted = function(){
        const gname = this.globalName
        return componentMonuted.data[gname]
      }

      this.dispatch = function(key, props){
        const that = this
        clearTimeout(this.timer)
        this.timer = setTimeout(function() {
          const hasMounted = that.hasMounted()
          if (hasMounted) dispatcher(key, props, that)
        }, 0);
      }
    }
  }

  if (returnReactClass) {
    return store(globalName, Temp, extension)
  } else {
    return new Query()
  }
}

combineX.wrap = function(ComposedComponent, opts, cb){
  if (!opts) opts = {type: 'reactClass'}

  if (typeof opts == 'function') {
    cb = opts
    opts = {
      type: 'reactClass'
    }
  }

  if (typeof opts == 'object') {
    opts.type = 'reactClass'
  }

  return combineX(ComposedComponent, opts, cb)
}


// CombineClass

function browserRender(id, X, config){
  const props = config.props
  if (typeof id == 'string') {
    return render(<X {...props}/>, document.getElementById(id))
  }

  else if (typeof id == 'object' && id.nodeType) {
    return render(<X {...props}/>, id)
  }
}

function _rendered(ctx, cb){
  return function(dom, intent){
    ctx.elements = this.refs
    ctx.data = ctx.combx.data ? ctx.combx.data : ctx.config.props.data  // 用于实例中做数据查询，该data同步于react class的state.data，dispatcher中动态更新该值
    cb.call(this, dom, intent, ctx)
  }
}

export class CombineClass{
  constructor(config){
    this.config = config
    this.isClient = isClient
    this.extension = {}
    this.elements   // rendered方法中赋值，react class的componentDidMount之后将refs的内容赋值给该变量
    browserRender = this::browserRender

    this.inject()
  }

  combinex(GridsBase, Actions={}){
    const that = this
    const CombX = combineX(GridsBase, Actions, this.extension)
    this.combx = CombX
    this.globalName = CombX.globalName
    this.x = CombX.element
    this.dispatch = CombX::CombX.dispatch
    this.hasMounted = CombX::CombX.hasMounted


    let keynames = Object.keys(Actions)
    const lowKeyNames = keynames.map( item => item.toLowerCase() )
    const upKeyNames = keynames

    for (let ii=0; ii<lowKeyNames.length; ii++) {
      const actName = upKeyNames[ii]
      this['$'+lowKeyNames[ii]] = function(param){
        this.dispatch(actName, param)
        return this
      }
    }

    // this.setActions = function(key, func){
    //   const _actions = {}
    //   _actions[key] = func
    //   CombX.saxer.setActions(_actions)
    //   return this
    // }

    this.on = (key, fun)=>{
      CombX.saxer.on(key, fun)
      return this
    }

    this.roll = function(key, data){
      CombX.saxer.roll(key, data)
      return this
    }

    this.emit = this.roll


    this.appendActions = function(obj){
      CombX.saxer.append(obj)
      Object.keys(obj).map(function(item){
        const lowCaseName = '$'+item.toLowerCase()
        that[lowCaseName] = function(param){
          that.dispatch(item, param)
        }
      })
      return this
    }
  }

  extend(exts){
    if (typeof exts == 'object') {
      Object.keys(exts).map( _name => {
        this[_name] = exts[_name]
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

  reRender(){
    this.render()
  }

  render(id, cb){
    id = id || this.config.container
    const X = this.x
    let _props = this.props || this.config.props

    if (typeof id == 'function' || typeof cb == 'function') {
      this.config.rendered = typeof id == 'function' ? id : cb
    }
    if ( typeof this.config.rendered == 'function' || typeof this.rendered == 'function' ) {
      const rended = (this.config.rendered || this.rendered )
      if (_props) _props.rendered = _rendered(this, rended)
      else {
        _props = {
          rendered: _rendered(this, rended)
        }
      }
    }

    this.config.props = _props || {}

    if (typeof id == 'string' || typeof id == 'object') {
      if (this.isClient) {
        this.config.container = id
        return browserRender(id, X, this.config)
      }
    }

    _props = _props || {}
    return <X {..._props}/>
  }
}
