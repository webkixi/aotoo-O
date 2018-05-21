import $ from 'jquery'

import data from './data'

function index(router){

  const buttomList = Aotoo.list({data: data.buttomListData, listClass: 'row-flex-center-wrap', itemClass: 'mb8 mr8'})
  const buttomList2 = Aotoo.list({data: data.buttomListData2, listClass: 'row-flex-center-wrap', itemClass: 'mb8 mr8'})
  const buttomList3 = Aotoo.list({
    data: data.buttomListData3,
    listClass: 'row-flex-center-wrap',
    itemClass: 'mb8 mr8',
    itemMethod: function(dom){
      $(dom).find('.btn-click').off('click').click(function(e){
        e.stopPropagation()
        $(this).addClass('btn-loading').html(`<i class="icon-loading s-spli"></i><span type="btn-span">Loading</span>`)
      })
    }
  })
  // const buttomList3 = Aotoo.list({data: buttomListData, listClass: 'grids-row mt20', itemClass: 'g-col-3 row-flex-center f-ju-center'})
  const Pages = Aotoo.wrap(
    <div className='sb-content'>
        <h1>Button 按钮</h1>
        <ul className='item-card row-flex-in mt20'>
          <li className='g-col-6 item-card-li padding-15'>{buttomList}</li>
          <li className='g-col-6 item-card-li padding-15'>代码展示</li>
        </ul>
        <ul className='item-card row-flex-in mt20'>
          <li className='g-col-6 item-card-li padding-15'>{buttomList2}</li>
          <li className='g-col-6 item-card-li padding-15'>代码展示</li>
        </ul>
        <ul className='item-card row-flex-in mt20'>
          <li className='g-col-6 item-card-li padding-15'>{buttomList3}</li>
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
