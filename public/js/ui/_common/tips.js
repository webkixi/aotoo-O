import $ from 'jquery'
import tooltip from  './tips_adapter'
function index(router){
  const TopCentertooltipWrap = Aotoo.wrap(
    <div>
      <h2>标题</h2>
      <p>这是一段内容,这是一段内容,这是一段内容,这是一段内容。这是一段内容,这是一段内容,这是一段内容,这是一段内容。这是一段内容,这是一段内容</p>
      <ul className='btn-list row-flex'><li><button className='btn btn-clean'>取消</button></li><li><button className='btn btn-comfirm'>确定</button></li></ul>
    </div>
    ,function (dom){
      $('.btn-comfirm').on('click', function(e){
        topCentertooltip.close()
      })
    }
  )
  const topCentertooltip = tooltip({
    title: 'Tooltip will show when mouse enter.',
    content: <TopCentertooltipWrap/>,
    placement: 'topleft',
    event: 'click',
    bgClose: true,
    classClose: '.btn-clean',
    type: 'popover',
    // rendered: function(dom){
    //   $('.btn-clean').on('click', function(e){
    //     console.log('xxoo')
    //     topCentertooltip.close()
    //   })
    // }
  })

  const topTooltip = tooltip({
    title: <button className="btn">topCenter</button>,
    content: '哈哈 你个傻逼',
    placement: 'top'
  })
  const topRightTooltip = tooltip({
    title: <button className='btn'>topRight</button>,
    content: '哈哈 你个傻逼',
    placement: 'topright'
  })
  const bottomCenterTooltip = tooltip({
    title: <button className='btn'>bottomLeft</button>,
    content: '哈哈 你个傻逼',
    placement: 'bottomleft'
  })
  const bottomTooltip = tooltip({
    title: <button className='btn'>bottomCenter</button>,
    content: '哈哈 你个傻逼',
    placement: 'bottom'
  })
  const bottomRightTooltip = tooltip({
    title: <button className='btn'>bottomRight</button>,
    content: '哈哈 你个傻逼',
    placement: 'bottomright'
  })
  const Pages = Aotoo.wrap(
    <div className='sb-content'>
        <h1>Tooltip 提示文字</h1>
        <ul className='item-card row-flex-wrap mt20'>
          <li className='g-col-4 padding-15'>
            {topCentertooltip.render()}
            <div className='fieldset'><span>左上角</span></div>
          </li>
          <li className='g-col-4 padding-15'>
            {topTooltip.render()}
            <div className='fieldset'><span>上居中</span></div>
          </li>
          <li className='g-col-4 padding-15'>
            {topRightTooltip.render()}
            <div className='fieldset'><span>右上角</span></div>
          </li>
          <li className='g-col-4 padding-15'>
            {bottomCenterTooltip.render()}
            <div className='fieldset'><span>左下角</span></div>
          </li>
          <li className='g-col-4 padding-15'>
            {bottomTooltip.render()}
            <div className='fieldset'><span>下居中</span></div>
          </li>
          <li className='g-col-4 padding-15'>
            {bottomRightTooltip.render()}
            <div className='fieldset'><span>右下角</span></div>
          </li>
        </ul>
    </div>
    ,function(dom){
      $(dom).on('click', '.tooltip-xx', function(){
        // tooltip({
        //   // ele: '.tooltip-xx',
        //   content: '哈哈 你个傻逼',
        //   cls: 'ss-tooltip-topleft',
        //   event: 'hover',
        //   mask: false,
        //   itemMethod: function(dom){
        //     console.log('===== 000')
        //   }
        // })
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
