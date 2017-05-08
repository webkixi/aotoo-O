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
        const ctx = {
          show: this.show,
          hide: this.hide
        }

  			if( this.props.itemDefaultMethod ){
  				if (this.props.itemMethod) this.props.itemMethod.call(ctx, that, self.intent)
  				setTimeout(function(){
  					if( typeof self.props.itemDefaultMethod === 'function' ) self.props.itemDefaultMethod.call(ctx, that, self.intent)
  				}, 17)
  			} else if (typeof cb == 'function' || this.props.itemMethod){
          const imd = cb ||this.props.itemMethod
  				imd.call(ctx, that, self.intent)
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

			if( this.props.itemDefaultMethod ){
				if (this.props.itemMethod) this.props.itemMethod.call(_ctx, that, self.intent)
				setTimeout(function(){
					if( typeof self.props.itemDefaultMethod === 'function' ) self.props.itemDefaultMethod.call(_ctx, that, self.intent)
				}, 17)
			}
      else if (typeof cb == 'function' || this.props.itemMethod){
        const imd = cb ||this.props.itemMethod
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
