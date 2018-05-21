import $ from 'jquery'

function index(router){
  const tagListData = [
    { title: <div className='tag-fff'>标签一</div> },
    { title: <div className='tag-fff-f9b427'>标签二</div> },
    { title: <div className='tag-fff-2485cf'>标签三</div> },
    { title: <div className='tag-f9b427'>标签四</div> },
    { title: <div className='tag-f20d0d'>标签五</div> },
    { title: <div className='tag-2485cf'>标签六</div> },
    { title: <div className='tag-fff tag-close'>标签七</div> },
  ]
  const data = [
    { title: '标签一', itemClass: 'mb8 mr8 tag-fff'},
    { title: '标签二', itemClass: 'mb8 mr8 tag-fff-f9b427'},
    { title: '标签三', itemClass: 'mb8 mr8 tag-fff-2485cf'},
    { title: '标签四', itemClass: 'mb8 mr8 tag-f9b427'},
    { title: '标签五', itemClass: 'mb8 mr8 tag-f20d0d'},
    { title: '标签六', itemClass: 'mb8 mr8 tag-2485cf'},
    { title: '标签七', itemClass: 'mb8 mr8 tag-fff tag-close'},
  ]
  const tagList = Aotoo.list({data: data, listClass: 'row-flex-center-wrap'})

  const Pages = Aotoo.wrap(
    <div className='sb-content'>
        <h1>Tag 标签</h1>
        <ul className='item-card row-flex-in mt20'>
          <li className='g-col-6 item-card-li'>
            <div className='item-head padding-15'>{tagList}</div>
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
