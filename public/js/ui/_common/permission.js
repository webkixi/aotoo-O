import $ from 'jquery'
import treex from 'aotoo-react-treex'

const getdata = require('./permissiondata.json')

function index(router){
  //数据适配器
  const permissionFunc = (res, checkbox) =>{
    let output = []
    const xx = (item) => {
      return <div className="c-check row-flex-center">
        {item.checked == true
        ? <input type="checkbox" data-id={item.id} name={item.id} className='item-input' defaultChecked data-parentId={item.parentId}/> 
        : <input type="checkbox" data-id={item.id} name={item.id} className='item-input' data-parentId={item.parentId} />}
        <span className="fkp-checkbox-box"></span>
        <span className='item-li'>{item.sourceName}</span>
      </div>
    }
    res.map( (item, ii) =>{
       output.push({
        title: checkbox
                ?
                item.parentId == 0
                  ? <div className='item-title-level0'>{item.sourceName}<span className='color-2485cf btn-edit'></span></div> 
                  : xx(item) 
                : item.parentId == 0 
                  ? <div className='item-title-level0'>{item.sourceName}<span className='color-2485cf btn-edit'></span></div> 
                  // : item.sourceName,
                  : item.sourceName,
        idf: item.id,
        parent: item.parentId,

      })
    })
    return output
  }
  
  const pfunc = (res) => {
    let output = []
    res.map( (item, ii) =>{
      if (item.checked == true ){
        output.push({
          title: item.parentId == 0 
                    ? <div className='item-title-level0'>{item.sourceName}<span className='color-2485cf btn-edit'></span></div> 
                    : item.sourceName,
          idf: item.id,
          parent: item.parentId,
        })
      }
    })
    return output
  }

  //交互
  const eachCheckedFunc = ($input, checkedStatus) => {
    /**
      每点击一次，都执行遍历
      $input 是当前选中值的父级
      checkedStatus true是选中状态 false是取消状态
    */
    if (checkedStatus == true){
      $input.parents('.caption').next('.property-ul').find('input[data-id]').each(function(){
        if ($(this).is(':checked')){
          $input.prop('checked', true).removeClass('checked-vals')
        }
        else{
          $input.prop('checked', false).addClass('checked-vals')
          return false
        }
      })
    }
    else {
      $input.parents('.caption').next('.property-ul').find('input[data-id]').each(function(){
        if ($(this).is(':checked')){
          $input.prop('checked', false).addClass('checked-vals')
          return false
        }else{
          $input.prop('checked', false).removeClass('checked-vals')
        }
      })
    }
    //判断有父级的话 再去遍历
    if ($input.attr('data-parentId') && $input.parents('.caption').parent('.itemCategory').parent('li').data('treeid') != '1'){
      eachCheckedFunc($('input[data-id='+$input.attr('data-parentId')+']'), checkedStatus)
    }
  }

  //实例
  const permission = treex({
    props: {
      data: pfunc(getdata),
      listClass: 'ss-permission '
      // listClass: 'ss-permission ul-hidden'
    }
  })
let idrecode = []
let indexcode = []
function _getGroups(dataAry, idf){
  let nsons = []

  let sons = _.filter(dataAry, (o, jj) => {
    if (o.parent == idf) {
      indexcode.push(jj)
      return o.parent == idf
    }
  })

  sons.forEach( (son, ii) => {
    if (son.idf && idrecode.indexOf(son.idf) == -1) {
      idrecode.push(son.idf)
      nsons = nsons.concat(son).concat(_getGroups(dataAry, son.idf))
    } else {
      nsons = nsons.concat(son)
    }
  })
  return nsons
}

  const Pages = Aotoo.wrap(
    <div className='sb-content'>
        <h1>Tree 权限树</h1>
        <ul className='item-card mt20'>
          <li className='g-col-12 item-card-li'>
            <div className='item-head padding-15'>{permission.render()}</div>
          </li>
        </ul>
    </div>
    ,function(dom){
      //点击编辑 
      $(dom).on('click', '.btn-edit', function(){
        $(this).toggleClass('active')
        // const index = permission.getGroups(pfunc(getdata), '178')
        // let groups = _getGroups(permissionFunc(getdata, true), '178')
        // console.log(groups)
        // groups.unshift({
        //   titlte: 'xx',
        //   idf: '178'
        // })
        // permission.$update({data: groups, listClass: 'xxoo'})
        permission.$update({data: permissionFunc(getdata, true), listClass: 'ss-permission'})
      })
      $(dom).on('click', '.btn-edit.active', function(){
        $(this).removeClass('active')
        permission.$update({data: pfunc(getdata)})
      })
      //点击更多按钮
      $(dom).on('click', '.item-more', function(){
        $(this).toggleClass('active')
        $(this).parents('.caption').next('.property-ul').toggleClass('active')
      })
      $(dom).on('click', '.c-check', function(){
        const parentId = $(this).find('input').attr('data-parentId')
        let $input = $('input[data-id='+parentId+']')
        let checkStatus = false

        if ($(this).find('input').is(':checked')){
          $(this).find('input').attr('checked', true).removeClass('checked-vals')
          if ($(this).parents('.caption')){     //判断是否有子级 
            $(this).parents('.caption').next('.property-ul').find('input[name]').prop('checked', true)
          }
          checkStatus = true
        }
        else {
          $(this).find('input').attr('checked', false)
          if ($(this).parents('.caption')){     //判断是否有子级 
            $(this).parents('.caption').next('.property-ul').find('input[name]').prop('checked', false)
          }
          checkStatus = false
        }
        
        if (checkStatus == true){
          eachCheckedFunc($input, true)
        }
        else{
          eachCheckedFunc($input, false)
        }
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
