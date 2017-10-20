// import treex from 'aotoo-react-treex'

//处理数据结构

function adaComTreex(result){
  if (result.length){
    return result.map( item => {
      return {
        title: (item.customLevel == 2) ? <div className='row-flex-justify-between-wrap tree-head'><em>{item.navTitle}</em></div> : item.navTitle,
        idf: item.id,
        parent: (item.customLevel != 2) ? item.parentId : ''
      }
    })
  }
}

function adacontents(res) {
  return Aotoo.tree({
    data: adaComTreex(res),
    listClass: 'tree-basic-tabs'
  })
}

function adapterCheckmudd(res){
  let checkmuddTreex = []
  let ids = ''
  let newRes = []
  if(res.length){
    const newRes = _.filter(res, o => o.customLevel == 1 )
    const differRes = _.differenceBy(res, newRes)
    newRes.map(item => {
      //筛选与item.id相关的数据
      const idData = _.filter(differRes, o=>{
        if (o.idLinks.indexOf(item.id)> -1){
          return o
        }
      })
      const little_tree = adacontents(idData)
      checkmuddTreex.push({
        title: <a href='javascript:;' data-id={item.id}>{item.navTitle}</a>,
        content: little_tree
      })
    })
  }
  return checkmuddTreex
}
export default {
  adapterCheckmudd: adapterCheckmudd
}
