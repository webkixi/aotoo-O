import $ from 'jquery'

import getdata from './data'

function index(router){

  //适用于信息流的适配器 
  const flowFunc = (res) => {
    if (res && res.length){
      return res.map( (item) => {
        return {
          title: item.title,
          body: item.des
        }
      })
    }
    else{
      return [{title: '暂无数据'}]
    }
  }
  const flowFunc2 = (res) => {
    if (res && res.length){
      return res.map( (item) => {
        return {
          title: (
            <div className='inner'>
              <div className='hheader'>
                <h5>{item.title}</h5>
                <p className='color-999'>{item.des}</p>
              </div>
            </div>
          ),
        }
      })
    }
    else{
      return [{title: '暂无数据'}]
    }
  }
  const flowList = Aotoo.list({data: flowFunc(getdata.infoFlowData2), listClass: 'wid-p72 ss-flow'})
  const flowList2 = Aotoo.list({data: flowFunc(getdata.infoFlowData3), listClass: 'wid-p72 ss-flow'})
  const flowList3 = Aotoo.list({data: flowFunc(getdata.infoFlowData4), listClass: 'wid-p72 ss-flow'})
  const flowList4 = Aotoo.list({data: flowFunc(getdata.infoFlowData5), listClass: 'wid-p72 ss-flow'})
  const flowList5 = Aotoo.list({data: flowFunc2(getdata.infoFlowData6), listClass: 'wid-p72 ss-flow-2'})
  const flowList6 = Aotoo.list({data: flowFunc(getdata.infoFlowData7), listClass: 'wid-p72 ss-flow'})
  const flowList7 = Aotoo.list({data: flowFunc(getdata.infoFlowData8), listClass: 'wid-p72 ss-flow'})
  const flowList8 = Aotoo.list({data: flowFunc2(getdata.infoFlowData9), listClass: 'wid-p72 ss-flow-2'})

  const Pages = Aotoo.wrap(
    <div className='sb-content'>
        <h1>Infoflow 信息流</h1>
        <ul className='item-card mt20'>
          <li className='g-col-12 item-card-li padding-15'>{flowList}</li>
          <li className='g-col-12 item-card-li padding-15'>代码展示</li>
        </ul>
        <ul className='item-card mt20'>
          <li className='g-col-12 item-card-li padding-15'>{flowList2}</li>
          <li className='g-col-12 item-card-li padding-15'>代码展示</li>
        </ul>
        <ul className='item-card mt20'>
          <li className='g-col-12 item-card-li padding-15'>{flowList3}</li>
          <li className='g-col-12 item-card-li padding-15'>代码展示</li>
        </ul>
        <ul className='item-card mt20'>
          <li className='g-col-12 item-card-li padding-15'>{flowList4}</li>
          <li className='g-col-12 item-card-li padding-15'>代码展示</li>
        </ul>
        <ul className='item-card mt20'>
          <li className='g-col-12 item-card-li padding-15'>{flowList5}</li>
          <li className='g-col-12 item-card-li padding-15'>代码展示</li>
        </ul>
        <ul className='item-card mt20'>
          <li className='g-col-12 item-card-li padding-15'>{flowList6}</li>
          <li className='g-col-12 item-card-li padding-15'>代码展示</li>
        </ul>
        <ul className='item-card mt20'>
          <li className='g-col-12 item-card-li padding-15'>{flowList7}</li>
          <li className='g-col-12 item-card-li padding-15'>代码展示</li>
        </ul>
        <ul className='item-card mt20'>
          <li className='g-col-12 item-card-li padding-15'>{flowList8}</li>
          <li className='g-col-12 item-card-li padding-15'>代码展示</li>
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
