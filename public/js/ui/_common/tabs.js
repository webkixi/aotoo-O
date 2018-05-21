import $ from 'jquery'

import getdata from './data'

function index(router){
  const Tabs2 = Aotoo.wrap(
    <p>您老在搞笑么</p>
  )
  const data = [
    { title: '标签一', content: '标签一的内容'},
    { title: '标签二', content: <Tabs2/>},
    { title: '标签三', content:  Aotoo.list({data: getdata.buttomListData, listClass: 'row-flex-center-wrap', itemClass: 'mb8 mr8'})},
  ]
  const tabs = Aotoo.tabs({
    props: {
      data: data, 
      tabClass: 'ss-tabsGroup',
      itemMethod: function(dom){
        $(dom).off('hover').hover(function(e){
          let index = parseInt($(this).attr('data-treeid'))
          tabs.$select({
            select: index
          })
        })
      }
    }
  })
  const tabs2 = Aotoo.tabs({
    props: {
      data: data, 
      tabClass: 'ss-tabsGroup-card',
      itemMethod: function(dom){
        $(dom).off('click').click(function(e){
          let index = parseInt($(this).attr('data-treeid'))
          tabs2.$select({
            select: index
          })
        })
      }
    }
  })

  const Pages = Aotoo.wrap(
    <div className='sb-content'>
        <h1>Tabs 标签页</h1>
        <ul className='item-card row-flex-in mt20'>
          <li className='g-col-6 item-card-li'>
            <div className='item-head padding-15'>{tabs.render()}</div>
            <div className='fieldset'><span>基本类型</span></div>
            <div className='item-desc padding-15'>
              <p className='color-666 font-size-12'>通过设置 class 属性来选择不同的样式类型</p>
            </div>
          </li>
          <li className='g-col-6 item-card-li padding-15'>代码展示</li>
        </ul>
        <ul className='item-card row-flex-in mt20'>
          <li className='g-col-6 item-card-li'>
            <div className='item-head padding-15'>{tabs2.render()}</div>
            <div className='fieldset'><span>基本类型</span></div>
            <div className='item-desc padding-15'>
              <p className='color-666 font-size-12'>通过设置 class 属性来选择不同的样式类型</p>
            </div>
          </li>
          <li className='g-col-6 item-card-li padding-15'>代码展示</li>
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
