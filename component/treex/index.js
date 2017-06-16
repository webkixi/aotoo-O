
const {
  list, 
  transTree,
  find,
  findIndex,
  merge,
  isArray,
  filter
} = Aotoo

const bars = {
    trigger:  <div className="treex-bar"><div className="treex-trigger-bar">加载更多内容</div></div>
  , pulldown: <div className="treex-bar"><div className="treex-pull-bar">刷新页面</div></div>
  , loading:  <div className="treex-bar"><div className="treex-loading">Loading...</div></div>
  , over:     <div className="treex-bar"><div className="treex-over-bar">没有更多内容了</div></div>
}

function getBehaviorBar(type, val){
  switch (type) {
    case 'pulldown':
      if (val) {
        return typeof val == 'boolean' ? bars.pulldown : val
      }
      break;
    case 'loading':
      if (val) {
        return typeof val == 'boolean' ? bars.loading : val
      }
      break;
    case 'over':
      if (val) {
        return typeof val == 'boolean' ? bars.over : val
      }
      break;
    case 'trigger':
      if (val) {
        return typeof val == 'boolean' ? bars.trigger : val
      }
      break;
  }
}

class Tree extends React.Component {
  constructor(props){
    super(props)
    this.preRender = this::this.preRender
    this.state = {
      data: this.props.data||[],
      pulldown: false,
      loading: false,
      trigger: false,
      over: false
    }
  }

  preRender(){
    const header = this.props.header ? this.props.header : ''
    const footer = this.props.footer ? this.props.footer : ''

    const list_part = list({
      data: transTree(this.state.data),
      listClass: this.props.listClass,
      itemClass: this.props.itemClass,
      itemMethod: this.props.itemMethod
    })

    if (
      header ||
      footer ||
      this.state.trigger ||
      this.state.pulldown ||
      this.state.loading ||
      this.state.over
    ) {
      return (
        <div className="list-container">
          {getBehaviorBar('pulldown', this.state.pulldown)}
          {header}
          {list_part}
          {footer}
          {getBehaviorBar('trigger', this.state.trigger)}
          {getBehaviorBar('over', this.state.over)}
          {getBehaviorBar('loading', this.state.loading)}
        </div>
      )
    } else {
      return list_part
    }
  }

  render(){
    return this.preRender()
  }
}

const Actions = {
  UPDATE: function(ostate, opts={}){
    let state = this.curState
    let data = state.data

    const index = opts.index
    if (!index && index!=0) {
      if ( isArray(opts.data) ) {
        state.data = opts.data
        return state
      }
    } else {
      if (opts.query) {

      }

      let oriData = data[index]
      oriData = merge(oriData, opts.data)
      return state
    }
  },

  APPEND: function(ostate, opts={}){
    let state = this.curState
    let data = state.data

    if (isArray(opts.data)) {
      data = data.concat(opts.data)
    } else {
      data.push(opts.data)
    }

    return state
  },

  PREPEND: function(ostate, opts={}){
    let state = this.curState
    let data = state.data

    if (isArray(opts.data)) {
      data = opts.data.concat(data)
    } else {
      data.unshift(opts.data)
    }

    return state
  },

  /*
    opts:{
      index: {number}
      query: {Json}
    }
  */
  DELETE: function(ostate, opts={}){
    let state = this.curState
    let data = state.data

    if (opts.index) {
      data.splice(opts.index, 1);
    }
    else if(opts.query) {
      const index = findIndex(data, opts.query)
      if (index>-1) {
        data.splice(index, 1)
      }
    }
    return state
  },

  // ========== 状态控制 ===========

  LOADING: function(ostate, opts={}){
    let state = this.curState
    if (!state.over) {
      state.loading = opts.loading || true
      state.pulldown = false
    }
    return state
  },

  LOADED: function(ostate, opts={}){
    let state = this.curState
    if (!state.over) {
      state.loading = false
      state.pulldown = false
    }
    return state
  },

  OVER: function(ostate, opts={}){
    let state = this.curState
    state.loading = false
    state.pulldown = false
    state.trigger = false
    state.over = opts.over || true
    return state
  },

  PULLDOWN: function(ostate, opts={}){
    let state = this.curState
    state.loading = false
    state.over = false
    state.pulldown = opts.pulldown || true
    return state
  },

  TRIGGER: function(ostate, opts={}){
    if (!this||!this.state) return
    let state = this.curState
    state.loading = false
    state.pulldown = false
    state.over = false
    state.trigger = opts.trigger || true
    return state
  },
}

let idrecode = []
let indexcode = []
function _getGroups(dataAry, idf){
  let nsons = []

  let sons = filter(dataAry, (o, jj) => {
    if (o.parent == idf) {
      indexcode.push(jj)
      return o.parent == idf
    }
  })

  sons.forEach( (son, ii) => {
    if (son.idf && idrecode.indexOf(son.idf) == -1) {
      idrecode.push(son.idf)
      nsons = nsons.concat(_getGroups(dataAry, son.idf))
    } else {
      nsons = nsons.concat(son)
    }
  })
  return nsons
}

let myParentsIndex = []
let myParents = []

/**
 * [查找特定idf的数据，]
 * @param  {[type]} dataAry [description]
 * @param  {[type]} idf     [description]
 * @return {[type]}         [description]
 */
function findParents(dataAry, idf){
  let _parentIndex
  const item = find(dataAry, (o,ii)=>o.idf==idf)

  if (item && item.parent) {
    const p = find(dataAry, (o, ii)=>{
      _parentIndex = ii
      return o.idf==item.parent
    })
    if (p){
      myParents.push({index: _parentIndex, content: p})
      findParents(dataAry, item.parent)
    }
  }
}

function App(opts){
  const treeX = Aotoo(Tree, Actions, opts)
  treeX.extend({
    getGroups: function(data, idf, son){
      data = data||this.data||[]
      idrecode = []
      indexcode = []
      const index = findIndex(data, o=>o.idf==idf)
      indexcode.push(index)
      let groups = _getGroups(data||[], idf)
      if (son) return groups
      return indexcode
    },

    getParents: function(data, idf){
      data = data||this.data||[]
      myParents = []
      findParents(data, idf)
      return myParents
    },

    findAndUpdate: function(query, target){
      const data = this.data||[]
      if (query) {
        const index = findIndex(data, query)
        if (index) {
          this.dispach('UPDATE', {
            index: index,
            data: target
          })
        }
      }
    }
  })
  return treeX
}



/*
 [ {title: '', idf: 'aaa', index: 0},
  {title: 'abcfd', parent: 'aaa', index: 1},
  {title: 'bcasd', parent: 'aaa', index: 2},
  {title: 'aacwq', parent: 'aaa', index: 2},

  {title: <button>123</button>, idf: 'bbb', index: 3},
  {title: 'yyufs', parent: 'bbb', index: 4},
  {title: 'xfdsw', parent: 'bbb', index: 5},
  {title: 'xxxdsehh', parent: 'bbb', index: 5}, ]
*/


/*
  props: {
    data: {Array},
    loading: {Boolean || JSX }
    header: {JSX},
    footer: {JSX},
    itemClass: {String},
    listClass: {String},
    itemMethod: {Function}   componentDidMount 后列表项响应事件
  }
  theme: {String}  注入样式
  autoinject: {Boolean} 是否自动注入
  rendered: {Function} 渲染完成后的动作，在原生react 的 componentDidMount 后
*/

export default function tree(opts){
  let dft = {
    props: {
      data: [],
      loading: false,
      header: '',
      footer: '',
      itemClass: '',
      listClass: '',
      itemMethod: ''
    },
    theme: '',
    autoinject: true,
    rendered: ''
  }
  dft = merge(dft, opts)
  return App(dft)
}

export function pure(opts){
  return tree(opts)
}
