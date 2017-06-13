// const React = (typeof React != 'undefined' ? React : require('react'))
const transTree = require('./lib/tree')

function $item(props, isreact){
  const Item = require('./itemview/foxdiv')
  if (!props) return Item
  return <Item {...props} />
}

function $list(props, isreact){
  const List = require('./listview')
  if (!props) return List
  return <List {...props} />
}

function $tree(props){
  if ( Array.isArray(props.data) ) {
    const treeData = transTree(props.data)
    return $list({data: treeData})
  }
}

module.exports = {
  item: $item,
  list: $list,
  tree: $tree,
  transTree: transTree
}
