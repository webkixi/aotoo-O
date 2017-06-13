/**
* list 通用组件
* 返回 div > (ul > li)*n
*/
import cloneDeep from 'lodash.clonedeep'
// const isClient = typeof window !== 'undefined'
// const React = (typeof React != 'undefined' ? React : require('react'))
// const reactDom = ( C => typeof ReactDOM != 'undefined' ? ReactDOM : typeof ReactDom != 'undefined' ? ReactDom : C ? require('react-dom') : require('react-dom/server'))(isClient)

var Fox = require('../itemview/foxli')

class TmpApp extends React.Component {
	constructor(props){
		super(props)
		this._dealWithData = this::this._dealWithData
		this._dealWithItemView = this::this._dealWithItemView
		this.listMethod = this::this.listMethod
	}

	componentDidMount(){
		this.listMethod(this.props.listMethod)
	}

	listMethod(lmd){
		if (lmd && typeof lmd == 'function') {
			let that = reactDom.findDOMNode(this);
			lmd(that, this.props.store)
		}
	}

	_dealWithItemView(opts){
		var that = this;
		var props = cloneDeep(that.props);
		props.idf = opts.i;
		props.key = 'fox'+opts.i;
		props.data = opts.item;

		const listOperate = {
			// parent: this.getListDom
		}

		//删除多余的属性
		delete props.listClass;
		delete props.listMethod;
		delete props.onscrollend;

		return <Fox ref={"child_"+opts.i} operate={listOperate} idf={opts.i} {...props} data={opts.item} />;
	}

	_dealWithData(data){
		const stateData = this.props.data
		const items = stateData.map((item, ii) => this._dealWithItemView({i: ii, item: item}))
		return items.length ? <ul className="hlist"> {items} </ul> : ''
	}

	render(){
		let fills = this._dealWithData()
		let _cls = 'list-wrap'
		let sty
		if(this.props.listClass){
			_cls = "list-wrap " + this.props.listClass||''
		}
		if(this.props.listStyle){
			sty = this.props.listStyle;
		}
		if (this.props.header || this.props.footer || this.props.children) {
			return (
				<div className={_cls} style={sty}>
					{this.props.header}
					{fills}
					{this.props.footer}
					{this.props.children}
				</div>
			)
		} else {
			if (fills) {
				const fill = fills
				const ulclass = `hlist ${this.props.listClass||''}`
				return React.cloneElement(fill, {className: ulclass})
			} else {
				return <ul className="hlist"></ul>
			}

		}
	}
}


// class TmpApp extends React.Component {
// 	constructor(props){
// 		super(props)
// 		var pdata = this.props.data;
// 		if( pdata ){ if(!Array.isArray( pdata )){ pdata = [ pdata ] } }
// 		this.selected = []
// 		this.state = {
// 			data: pdata||[]
// 		}
//
// 		this._dealWithData = this::this._dealWithData
// 		this._dealWithItemView = this::this._dealWithItemView
// 		this.listMethod = this::this.listMethod
// 		this.getListDom = this::this.getListDom
// 	}
//
// 	shouldComponentUpdate(nextProps, nextState) {
//     return true
// 	}
//
// 	componentWillMount() {
//
// 	}
//
// 	getListDom(){
// 		return reactDom.findDOMNode(this);
// 	}
//
// 	componentWillReceiveProps(nextProps) {
// 		var pdata = nextProps.data;
// 		if (pdata) {
// 			if(!Array.isArray( pdata )) pdata = [ pdata ]
// 			this.setState({ data: pdata })
// 		}
// 	}
//
// 	componentDidMount(){
// 		this.listMethod(this.props.listMethod)
// 	}
//
// 	listMethod(lmd){
// 		if (lmd && typeof lmd == 'function') {
// 			let that = reactDom.findDOMNode(this);
// 			lmd(that, this.props.store)
// 		}
// 	}
//
// 	_dealWithItemView(opts){
// 		var that = this;
// 		var props = cloneDeep(that.props);
// 		props.idf = opts.i;
// 		props.key = 'fox'+opts.i;
// 		props.data = opts.item;
//
// 		const listOperate = {
// 			parent: this.getListDom
// 		}
//
// 		//删除多余的属性
// 		delete props.listClass;
// 		delete props.listMethod;
// 		delete props.itemView;
// 		delete props.onscrollend;
//
// 		if(that.props.itemView){
// 			var view = that.props.itemView;
// 			return React.createElement(view, props, that.props.children);
// 		}else{
// 			return <Fox ref={"child_"+opts.i} operate={listOperate} idf={opts.i} {...props} data={opts.item} />;
// 		}
// 	}
//
// 	_dealWithData(data){
// 		const stateData = this.state.data
// 		const items = stateData.map((item, ii) => this._dealWithItemView({i: ii, item: item}))
// 		return items.length ? <ul className="hlist"> {items} </ul> : ''
// 	}
//
// 	render(){
// 		let fills = this._dealWithData()
// 		let _cls = 'list-wrap'
// 		let sty
// 		if(this.props.listClass){
// 			_cls = "list-wrap " + this.props.listClass||''
// 		}
// 		if(this.props.listStyle){
// 			sty = this.props.listStyle;
// 		}
// 		if (this.props.header || this.props.footer || this.props.children) {
// 			return (
// 				<div className={_cls} style={sty}>
// 					{this.props.header}
// 					{fills}
// 					{this.props.footer}
// 					{this.props.children}
// 				</div>
// 			)
// 		} else {
// 			if (fills) {
// 				const fill = fills
// 				const ulclass = `hlist ${this.props.listClass||''}`
// 				return React.cloneElement(fill, {className: ulclass})
// 			} else {
// 				return <ul className="hlist"></ul>
// 			}
//
// 		}
// 	}
//
// }

module.exports = TmpApp;
