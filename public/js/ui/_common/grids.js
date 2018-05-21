import $ from 'jquery'


//数据部分
const gridsListData = [
  {title: <div className='bg-00a0e9 height-50 padding-20'>Col</div>},
  {title: <div className='bg-00a0e9 height-50 padding-20'>Col</div>},
  {title: <div className='bg-00a0e9 height-50'>Col</div>},
  {title: <div className='bg-00a0e9 height-50 padding-20'>Col</div>},
  {title: <div className='bg-00a0e9 height-50 padding-20'>Col</div>},
]
const gridsListData2 = [
  {title: 'Col', itemClass: 'g-col-3 bg-68bdf0 height-50 row-flex-justify-center-center padding-tb-20'},
  {title: 'Col', itemClass: 'g-col-6 bg-00a0e9 height-50 row-flex-justify-center-center padding-tb-20'},
  {title: 'Col', itemClass: 'g-col-3 bg-68bdf0 height-50 row-flex-justify-center-center padding-tb-20'},
]


function index(router){
  
  const gridsList = Aotoo.list({data: gridsListData, listClass: 'grids-row color-fff mb10', itemClass: 'g-col-3'})
  const gridsList2 = Aotoo.list({data: gridsListData2, listClass: 'row-flex color-fff mb10'})

  const Pages = Aotoo.wrap(
    <div className='sb-content'>
        <h1>Grids 栅格</h1>
        {gridsList}
        {gridsList2}
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
