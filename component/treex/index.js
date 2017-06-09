// import List from 'component/widgets/listView'
// import baseX from 'component/class/basex'
// import transTree from 'component/util/tree'
import inject from 'aotoo-inject'
const injecter = inject()

const List = Aotoo.list
const transTree = Aotoo.transTree

const bars = {
   trigger:  <div className="treex-bar"><div className="trigger-bar">加载更多内容</div></div>
  ,pulldown: <div className="treex-bar"><div className="pull-bar">刷新页面</div></div>
  ,loading:  <div className="treex-bar"><div className="loading">Loading...</div></div>
  ,over:     <div className="treex-bar"><div className="over-bar">没有更多内容了</div></div>
}
const trigger  =
const pulldown =
const loading  = <div className="treex-bar"><div className="loading">Loading...</div></div>
const over     =

class Tree extends React.Component {
  constructor(props){
    super(props)
    this.preRender = this::this.preRender
    this.state = {
      data: this.props.data
    }
  }

  preRender(){
    const header = this.props.header ? this.props.header : ''
    const footer = this.props.footer ? this.props.footer : ''
    const list_part = <List
      data={transTree(this.state.data)}
      listClass={this.props.listClass}
    />

    const list_box = if (header || footer) {
      return (
        <div className="list-container">
          {header}
          {list_part}
          {footer}
        </div>
      )
    } else {
      return list_part
    }
  }

  render(){
    return list_box
  }
}

const Actions = {
  UPDATE: function(state, props={}){
    let curState = state
    let group = curState.group
    let groupItem = curState.groupItem
    let data = curState.data

    const index = props.index
    if (!index && index!=0) {
      if ( _.isArray(props.data) ) {
        curState.data = props.data
        return curState
      }
    } else {
      let oriData = data[index]
      oriData = _.merge(oriData, props.data)
      return curState
    }
  },
  MERGE: function(state, props={}){
    let curState = this.curState
    let group = curState.group
    let groupItem = curState.groupItem
    let data = curState.data

    const index = props.index
    if (!index && index!=0) {
      if ( _.isArray(props.data) ) {
        curState.data = props.data
        return curState
      }
    } else {
      let oriData = data[index]
      oriData = _.merge(oriData, props.data)
      return curState
    }
  }
}

let idrecode = []
let indexcode = []
function getGroups(dataAry, idf){
  let nsons = []

  let sons = _.filter(dataAry, (o, jj) => {
    if (o.parent == idf) {
      indexcode.push(jj)
      return o.parent == idf
    }
  })

  sons.forEach( (son, ii) => {
    if (son.idf && idrecode.indexOf(son.idf) == -1) {
      idrecode.push(son.idf)
      nsons = nsons.concat(getGroups(dataAry, son.idf))
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
  const item = _.find(dataAry, (o,ii)=>o.idf==idf)

  if (item && item.parent) {
    const p = _.find(dataAry, (o, ii)=>{
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
      idrecode = []
      indexcode = []
      const index = _.findIndex(data, o=>o.idf==idf)
      indexcode.push(index)
      let groups = getGroups(data||[], idf)
      if (son) return groups
      return indexcode
    },

    getParents: function(data, idf){
      myParents = []
      findParents(data, idf)
      return myParents
    },

    update: function(props){
      this.dispatch('UPDATE', props)
    }
  })
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

export default function tree(opts){
  var noop = false
    , dft = {
        data: [],
        props: false,
        theme: 'tree/permission',
        autoinject: true,
        autoTree: true,
        container: false,
        header: '',
        footer: '',
        itemClass: '',
        listClass: 'permission-ul',
        treeClass: '',
        itemMethod: '',
        listMethod: '',
        rendered: '',
        fold: false
      };

  dft = _.merge(dft, opts)
  return App(dft)
}

export function pure(props){
  return tree(props)
}
