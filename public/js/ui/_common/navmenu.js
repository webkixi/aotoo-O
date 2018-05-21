import $ from 'jquery'
import getData from './data'

function index(router){
  
  const navmenu = Aotoo.tree({data: getData.tagListData, listClass: 'ss-nav-row'})

  const navmenu2 = Aotoo.tree({data: getData.tagListData2, listClass: 'ss-nav-column'})

  const Pages = Aotoo.wrap(
    <div className='sb-content'>
        <h1>NavMenu 导航菜单</h1>
        <ul className='item-card mt20'>
          <li className='g-col-12 item-card-li'>
            <div className='item-head padding-15'>{navmenu}</div>
            <div className='fieldset'><span>顶部导航</span></div>
            <div className='item-desc padding-15'>
              <p className='color-666 font-size-12'>水平的顶部导航菜单。</p>
            </div>
          </li>
        </ul>
        <ul className='item-card mt20'>
          <li className='g-col-12 item-card-li'>
            <div className='item-head padding-15'>{navmenu2}</div>
            <div className='fieldset'><span>内嵌菜单</span></div>
            <div className='item-desc padding-15'>
              <p className='color-666 font-size-12'>垂直菜单，子菜单内嵌在菜单区域。</p>
            </div>
          </li>
        </ul>
    </div>
    ,function(dom){
      // $(dom).find('.ss-nav-row>li').hover( function(e){
      $(dom).on('click', '.ss-nav-row>li', function(e){
        $(this).addClass('select').removeClass('item-hidden').siblings('li').removeClass('select').addClass('item-hidden')
      })
      $(dom).on('click', '.ss-nav-column>li', function(e){
        $(this).addClass('select').removeClass('item-hidden')
      })
    }
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
