import $ from 'jquery'
import treex from 'aotoo-react-treex'
// import tabs from 'aotoo-react-tabs'
import getData from './data'

/**
 * 对链接的一些处理  toQueryPair toQueryString
 */
var urlparse = function (url) {
  if(!url){
    console.log('非法参数，请重新检查！');
    return;
  }
  var anchor = document.createElement('a');
  anchor.href = url;
  return {
    source: url,
    protocol: anchor.protocol.replace(':',''),
    host: anchor.hostname,
    port: anchor.port,
    query: anchor.search,
    params: (function(){
      var ret = {},
      seg = anchor.search.replace(/^\?/,'').split('&'),
      len = seg.length, i = 0, str;
      for (; i < len; i++) {
        if (!seg[i])  continue;
        str = seg[i].split('=');
        ret[str[0]] = str[1];
      }
      return ret;
    })(),
    file: (anchor.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
    hash: anchor.hash.replace('#',''),
    path: anchor.pathname.replace(/^([^\/])/,'/$1'),
    relative: (anchor.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
    segments: anchor.pathname.replace(/^\//,'').split('/')
  }
}
const toQueryPair = (key, value) => {
    if (typeof value == 'undefined'){
        return key;
    }
    return key + '=' + encodeURIComponent(value === null ? '' : String(value));
}
const toQueryString = (obj) => {
    var ret = [];
    for(var key in obj){
        key = encodeURIComponent(key);
        var values = obj[key];
        if(values && values.constructor == Array){//数组
            var queryValues = [];
            for (var i = 0, len = values.length, value; i < len; i++) {
                value = values[i];
                queryValues.push(toQueryPair(key, value));
            }
            ret = ret.concat(queryValues);
        }else{ //字符串
            ret.push(toQueryPair(key, values));
        }
    }
    return ret.join('&');
}


function index(router){

  const searchBoxTreexSmallLoopFunc = (output, res, checkbox, state) => {
    res.map( (item, ii) => {
      if (item.propertyValue && item.propertyValue.length> 0){
        searchBoxTreexSmallLoopFunc(output, item.propertyValue, checkbox, true)
      }
      output.push({
        title: (
          checkbox ? 
              <div className="c-check row-flex-center" >
                <input data-id={item.id}  type="checkbox" className={item.propertyValue && item.propertyValue.length> 0 ? 'lsb-ck-all' : 'lsb-ck'} name={item.value} />
                <span className="fkp-checkbox-box"></span>
                <span className='item-li'>{item.value}</span>
              </div>
            : item.propertyValue && item.propertyValue.length> 0 ? <span data-id={item.id} className='item-li'>{item.value}</span> : <div className='caption'><span  data-id={item.id} className='item-li'>{item.value}</span></div>
        ),
        idf: item.id ? item.id : '',
        parent: item.parent,
      })
    })
    return output
  }
  const searchBoxTreexSmallFunc = (res, checkbox) => {
    let output = []
    let isShowBX = true     //是否显示【不限】按钮
    if (res && res.length > 0){
      res.map( (item) => {
        if (item.propertyValue && item.propertyValue.length> 0){
          searchBoxTreexSmallLoopFunc(output, item.propertyValue, checkbox)
          isShowBX = false
        }
        output.push({
          title: (
              checkbox ? 
                  <div className="c-check item-li-wrap row-flex-center">
                    {item.propertyValue && item.propertyValue.length > 0 ? <i className='item-icons hidden'></i> : ''}
                    <input type="checkbox" className="item-checkboxAll" data-id={item.id} />
                    <span className="fkp-checkbox-box"></span>
                    <span className='item-li'>{item.value}</span>
                  </div>
              : <div className='item-li-wrap'><span className='item-li' data-id={item.id}>{item.value}</span></div>
          ),
          idf: item.id ? item.id : '',
          parent: item.level != 2 ? item.parent : '',
          itemClass: item.propertyValue && item.propertyValue.length > 0 ? 'item-level-more' : '',
        })
      })
      if (isShowBX == true){
        checkbox ? 
          output.unshift({
            title: (
              <div className="c-check item-li-wrap row-flex-center">
                <input type="checkbox" className="lsb-ck" />
                <span className="fkp-checkbox-box"></span>
                <span className='item-li'>不限</span>
              </div>
            )
          }) : ''
      }
    }
    let ins = Aotoo.tree({
      listClass: 'row-flex-wrap list-search-attr-single item-hidden',
      data: output
    })
    return ins
  }
  const searchBoxTreexFunc = (res, checkbox) => {
    return [
      {
        title: <label className='item-title' data-type={res.propertyCode}>{res.propertyName}</label>,
        body: searchBoxTreexSmallFunc(res.propertyValue, checkbox),
        footer: <i className='item-more hidden'></i>,
        dot: checkbox ? <ul className='row-flex-justify-center-center wid-p100 mt20 mb10'><li><button className='btn-link-999 btn-small searchbox-btn-cancel' data-code={res.propertyCode}>取消</button></li><li className='ml4'><button className='btn-primary btn-small searchbox-btn-confirm' data-code={res.propertyCode}>确定</button></li></ul> : <button className='btn-link-999 btn-small searchbox-btn mt6' data-code={res.propertyCode}>多选</button>
      }
    ]
  }

  const searchBoxTreexCheckedInsFunc = (res) => {
    return res.map( (item) => {
      return {
        title: <div className='item-checked' data-id={item.ids} data-type={item.code}><label className='bg-2485cf'>{item.name}</label>{item.values}<i className='itrem-checked-close'></i></div>
      }
    })
  }

  const searchBoxTreexInsFunc = (data) => {
    let output = []
    let ins = []
    if (data.customParam && data.customParam.length > 0){     //已选中数据 
      data.customParam.map( (item, ii) => {
        if (item.paramValue && item.paramValue.length > 0){
          output.push({
            title: <label className='item-title' data-type={data.code}>{item.paramName}</label>,
            footer: Aotoo.list({data: searchBoxTreexCheckedInsFunc(item.paramValue), listClass: 'row-flex-wrap mt7', itemClass: 'mr8'}),
            dot: <a href='javascript:;' className='clean-all ss-link ml20'>全部清除</a>
          })
          ins.unshift(
            treex({
              props: {
                data: output,
                listClass: 'list-search-attr'
              }
            })
          )
          ins[0].propertyCode = item.propertyCode
        }
      })
    }
    if (data.propertyParam && data.propertyParam.length > 0){     //筛选条件
      data.propertyParam.map( (item, ii) =>{
        let xx = ii + 1
        ins[xx] = treex({
          props: {
            data: searchBoxTreexFunc(item),
            listClass: 'list-search-attr'
          }
        })
        ins[xx].propertyCode = item.propertyCode
      })
    } 
    return ins
  }

  //获取单个小treex的数据
  const getSingleSearchData = (res, id) =>{
    return _.find(res, o=>o.propertyCode == id)
  }
  //搜索条件 点击【多选】按钮 触发的方法
  const updataSingle = (ins, id, res, checkbox) => {
    const insSmall = _.find(ins, {propertyCode: id})
    insSmall.$update({
      data: searchBoxTreexFunc(res, checkbox)
    })
  }
  //更新一级列表是否有选择的状态（蓝色小点）
  const mapCheck = (x) => {
    // 环境             结束本次循环        退出循环
    // JavaScript for  continue;         break;
    // JQuery each     return true;      return false;
    let someChecked = false;
    let kk = true
    let $input = $('input[name='+x+']');
    $input.parents('.level0').find('input[name]').each(function(){
      if ($(this).is(':checked')){
        someChecked = true;
        // return false;
      }else{
        kk = false
        // return false
      }
    })
    if(someChecked){
      $input.parents('.level0').find('.item-icons').removeClass('hidden')
    }else{
      $input.parents('.level0').find('.item-icons').addClass('hidden')
      $input.parents('.level0').find('.item-checkboxAll').prop('checked', false)
    }
    if (kk && someChecked){
      $input.parents('.level0').find('.item-checkboxAll').prop('checked', true)
    }
  }

  const treexListIns = searchBoxTreexInsFunc(getData.treexData.data)
  const treeList = treexListIns.map(item=>item.render())

  const Pages = Aotoo.wrap(
    <div className='sb-content'>
        <h1>Treex 树形控件</h1>
        <ul className='item-card row-flex-in mt20'>
          <li className='g-col-12 item-card-li'>
            <div className='item-head padding-15'>{treeList}</div>
            <div className='fieldset'><span>基本类型</span></div>
            <div className='item-desc padding-15'>
              <p className='color-666 font-size-12'>通过设置 class 属性来选择不同的样式类型</p>
            </div>
          </li>
        </ul>
    </div>
    ,function(dom){
      let urlpareseHref = urlparse(window.location.href)
      let getHrefSearch = window.location.search
      //点击跳转
      $(dom).on('click', '.item-li-wrap>.item-li', function(e){
        e.preventDefault()
        let getHrefSearchKey = $(this).parents('.inner').find('.hheader .item-title').data('type')
        
        let values =[]
        if ($(this).parents('li').hasClass('item-level-more')){ //判断带有二级或三级数据 title
          $(this).parent('.item-li-wrap').next('ul').find('>li').each(function(){
            let value = $(this).find('.caption .item-li').attr('data-id')
            values.push(value)
          })
          let getHrefSearchList = values.join(',')
          getHrefSearch = getHrefSearch ? '&'+getHrefSearchKey+'='+getHrefSearchList : '?'+getHrefSearchKey+'='+getHrefSearchList+''
          alert(window.location.href+getHrefSearch)
          // window.location = window.location.href+getHrefSearch
        }else{
          let getHrefSearchList = $(this).data('id')
          getHrefSearch = getHrefSearch ? '&'+getHrefSearchKey+'='+getHrefSearchList : '?'+getHrefSearchKey+'='+getHrefSearchList+''
          alert(window.location.href+getHrefSearch)
        }
        // window.location = window.location.href+getHrefSearch
      })
      //点击单个清除
      $(dom).on('click', '.item-checked', function(){
        var key = $(this).data('type')
        let values = $(this).data('id')+''
        alert(key+':'+values)
      })
      //点击全部清除
      $(dom).on('click', '.clean-all', function(){
        alert( window.location.pathname)
      })
      //判断是否显示更多按钮
      $(dom).find('.list-search-attr-single').each(function(){
        if($(this).height() > 36){
          $(this).parents('.inner').find('.item-more').removeClass('hidden')
        }
      })
      //点击更多按钮
      $(dom).on('click', '.item-more', function(){
        $(this).toggleClass('active')
        $(this).parents('.inner').find('.hbody').toggleClass('item-removeHeight')
      })
      //多选按钮
      $(dom).on('click', '.searchbox-btn', function(e){
        const id = $(this).attr('data-code')
        const checkedData = getSingleSearchData(getData.treexData.data.propertyParam, id)
        updataSingle(treexListIns, id, checkedData, true)
      })
      //取消按钮
      $(dom).on('click', '.searchbox-btn-cancel', function(e){
        const id = $(this).attr('data-code')
        const checkedData = getSingleSearchData(getData.treexData.data.propertyParam, id)
        updataSingle(treexListIns, id, checkedData)
      })
      //确定按钮
      $(dom).on('click', '.searchbox-btn-confirm', function(e){
        let getHrefSearchKey = $(this).parents('.inner').find('.hheader .item-title').data('type')
        let [getHrefSearchKeyValue,getHrefSearchList] = [[],null]
        $(this).parents('.inner').find('input[name]').each(function(){
          if($(this).is(':checked') == true){
            getHrefSearchKeyValue.push($(this).attr('data-id'))
          }
        })
        if(getHrefSearchKeyValue.length){
          getHrefSearchList = getHrefSearchKeyValue.join(',')
          getHrefSearch = getHrefSearch ? '&'+getHrefSearchKey+'='+getHrefSearchList : '?'+getHrefSearchKey+'='+getHrefSearchList+''
          alert(window.location.href+getHrefSearch)
          // window.location = window.location.href+getHrefSearch
        }
        // else{
        //   window.location.reload()
        // }
      })
      //一级全选
      $(dom).on('click', '.item-checkboxAll', function(){
        console.log('==========')
        if($(this).is(':checked')){
          $(this).attr('checked', true)
          $(this).parents('.caption').next('.property-ul').find('input').prop('checked', true)
          $(this).prev('.item-icons').removeClass('hidden')
        }else{
          $(this).attr('checked', false)
          $(this).parents('.caption').next('.property-ul').find('input').prop('checked', false)
          $(this).prev('.item-icons').addClass('hidden')
        }
      })
      //二级全选
      $(dom).on('click', '.lsb-ck-all', function(){
        const x = $(this).attr('name')
        if($(this).is(':checked')){
          $(this).attr('checked', true)
          $(this).parents('.caption').next('.property-ul').find('input').prop('checked', true)
        }else{
          $(this).attr('checked', false)
          $(this).parents('.caption').next('.property-ul').find('input').prop('checked', false)
          $(this).parents('.level0').find('.item-checkboxAll').prop('checked', false)
        }
        mapCheck(x)
      })
      //单选
      $(dom).on('click', '.lsb-ck', function(){
        const x = $(this).attr('name')
        if($(this).is(':checked')){
          $(this).attr('checked', true)
        }else{
          $(this).attr('checked', false)
          $(this).parents('.property-ul').prev('.caption').find('input').prop('checked', false)
          $(this).parents('.level0').find('.item-checkboxAll').prop('checked', false)
        }
        mapCheck(x)
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
