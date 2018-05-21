import $ from 'jquery'

import getdata from  './data'

const listFunc = (data) => {
  return data.map( (item, ii) => {
    return {
      title: <a href='#' className='item-pic'><img src={item.img} /></a>,
      body: [
        {
          k: <a href='#' className='item-title textellipsis-1'>{item.title}</a>,
          v: <p className='item-desc textellipsis-2'>{item.desc}</p>
        }
      ]
    }
  })
}
const listFunc2 = (data) => {
  return data.map( (item, ii) => {
    return {
      title: <a href='#' className='item-pic'><img src={item.img} /></a>,
      body: [
        <a href='#' className='item-title mb8'>{item.title}</a>,
        <p className='item-desc mb8'>{item.desc}</p>,
        <p className='item-content color-666'>{item.content}</p>
      ]
    }
  })
}
const listFunc3 = (data) => {
  return data.map( (item, ii) => {
    return {
      title: <a href='#' className='item-pic'><img src={item.img} /></a>,
      body: [
        {
          k: <a href='#' className='item-title textellipsis-1 mb8'>{item.title}</a>,
          v: <p className='item-desc textellipsis-2 font-size-12'>{item.desc}</p>
        }
      ],
      dot: <div className='si-pop'>我就看看！</div>
    }
  })
}
function index(router){
 
  const list = Aotoo.list({data: listFunc(getdata.listData), listClass: 'ss-list'})
  const list2 = Aotoo.list({data: listFunc2(getdata.listData), listClass: 'ss-list-img-right'})
  const list3 = Aotoo.list({data: listFunc(getdata.listData), listClass: 'ss-list-a', itemClass: 'hhbody-space-around'})

  const list4 = Aotoo.list({data: listFunc3(getdata.listData), listClass: 'ss-list-column grids-row mt20', itemClass: 'g-col-3 ss-item-pop'})
  const list5 = Aotoo.list({data: listFunc(getdata.listData), listClass: 'ss-list-column-xm grids-row mt20', itemClass: 'g-col-3 ss-list-active'})

  const Pages = Aotoo.wrap(
    <div className='sb-content'>
        <h1>List 列表</h1>
        <div className='item-card mt20 padding-20'>
          {list}
        </div>
        <div className='item-card mt20 padding-20'>
          {list2}
        </div>
        <div className='item-card mt20'>
          {list3}
        </div>
        {list4}
        {list5}
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
