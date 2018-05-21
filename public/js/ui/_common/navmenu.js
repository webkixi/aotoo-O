// import $ from 'jquery'
import getData from './data'

function index(router){
  const tagListData = [
    { title: <span className='item-level0 icon-xx'>内容管理</span>, idf: 'n1'},
    { title: '用户管理', idf: 'n2', itemClass: 'item-hidden item-padding'},
    { title: '新增用户', parent: 'n2', attr: {path: 'x'} },
    { title: '活跃用户', parent: 'n2', attr: {path: 'x'}},
    { title: '统计分析 ', idf: 'n3', itemClass: 'item-hidden item-padding'},
    { title: '分组一 ', idf: 'n3a', parent: 'n3' },
    { title: '选项1 ', parent: 'n3a', attr: {path: 'x'}},
    { title: '选项2 ', parent: 'n3a', attr: {path: 'x'}},
    { title: '分组二 ', idf: 'n3b', parent: 'n3' },
    { title: '选项3 ', parent: 'n3b', attr: {path: 'x'} },
    { title: '选项4 ', parent: 'n3b', attr: {path: 'x'} },
  ]
  const navmenu = Aotoo.tree({data: tagListData, listClass: 'ss-nav-row'})

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
        {/* <ul className='item-card mt20'>
          <li className='g-col-12 item-card-li'>
            <div className='item-head padding-15'>{navmenu2}</div>
            <div className='fieldset'><span>内嵌菜单</span></div>
            <div className='item-desc padding-15'>
              <p className='color-666 font-size-12'>垂直菜单，子菜单内嵌在菜单区域。</p>
            </div>
          </li>
        </ul> */}
    </div>
    ,function(dom){
      // $(dom).find('.ss-nav-row>li').hover( function(e){
      $(dom).on('click', '.ss-nav-row>li', function(e){
        console.log('=========== 99')
        $(this).addClass('select').removeClass('item-hidden').siblings('li').removeClass('select').addClass('item-hidden')
      })
      // $(dom).on('click', '.ss-nav-column>li', function(e){
      //   $(this).addClass('select').removeClass('item-hidden')
      // })
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
