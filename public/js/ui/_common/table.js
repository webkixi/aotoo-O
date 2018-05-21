import $ from 'jquery'
import getData from './data'

//数据部分 head
const headTableData= [
  {
    title: 'Name',
    key: 'name',
    width: '30%',
  },
  {
    title: 'Age',
    key: 'age',
    width: '30%',
  },
  {
    title: 'Address',
    key: 'address',
    width: '40%',
  }
]
function index(router){

  const tableFunc = (headData, bodyData) =>{
    const hd = headData.map( (item, ii) => {
      return <li className='ss-table-td' style={{width: item.width}} key={'table_head_'+item.key}>{item.title}</li>
    })

    const bdlist = (data, ii) => {
      let op = []
      for (let i =0; i<headData.length; i++){
        op.push(<div className='ss-table-td' style={{width: headData[i].width}}  key={'table_'+headData[i].key+ii}>{data[headData[i].key]}</div>)
      }
      return op
    }

    const bd = bodyData.map( (item, ii) => {
      return {
        title: bdlist(item, ii)
      }
    })
    
    return {
      title: <ul key={'table_head_0'} className='ss-table-tthead ss-table-tr'>{hd}</ul>,
      body: Aotoo.list({data: bd, itemClass: 'ss-table-tr', listClass: 'ss-table-body'})
    }
  }
  
  const TableBody = Aotoo.item({data: tableFunc(headTableData, getData.tableData), itemClass: 'ss-table-hb ss-table-hover ss-table-odd-event'})


 const data = [
    { title: '基础', content: Aotoo.item({data: tableFunc(headTableData, getData.tableData), itemClass: 'ss-table-hb ss-table-hover ss-table-border-bottom'})},
    { title: '奇偶色', content: Aotoo.item({data: tableFunc(headTableData, getData.tableData), itemClass: 'ss-table-hb ss-table-odd-event ss-table-border-bottom'})},
    { title: '带边框', content: Aotoo.item({data: tableFunc(headTableData, getData.tableData), itemClass: 'ss-table-hb ss-table-hover ss-table-border'})},
    { title: '头部 fixed', content: Aotoo.item({data: tableFunc(headTableData, getData.tableData), itemClass: 'ss-table-hb ss-table-hover ss-table-fixed'})},
  ]
  const tabs = Aotoo.tabs({
    props: {
      data: data, 
      tabClass: 'ss-tabsGroup mt20',
      itemMethod: function(dom){
        $(dom).off('click').click(function(e){
          let index = parseInt($(this).attr('data-treeid'))
          tabs.$select({
            select: index
          })
        })
      }
    }
  })  

  const Pages = Aotoo.wrap(
    <div className='sb-content'>
        <h1>Table 表格</h1>
        <ul className='item-card mt20'>
          <li className='padding-15'>{TableBody}</li>
          <li className='padding-15 item-card-li'>
            <div className='fieldset'><span>基础用法</span></div>
            <div className='item-desc padding-15'>
              <p className='color-666 font-size-12'>通过设置 listClass 属性来选择不同的样式类型<br/>通过传 数据及方法 来显示列表 <a href='https://gitee.com/linguanhua/codes/hm4it1rqsj6a8wn3zuxbk32' target="_blank" className='ml8'>代码演示</a></p>
            </div>
          </li>
        </ul>
        <ul className='item-card mt20'>
          <li className='padding-15 item-card-li'>
            <div className='fieldset'><span>展示效果</span></div>
            {tabs.render()}
          </li>
        </ul>
    </div>
  )
  return <Pages/>
}

module.exports = function(router) {
  return {
    main: function () {
      return index(router)
    },
    enter: function (data) {
      return this.main()
    },
    leave: function () {
      console.log('======= 3333');
    }
  }
}
