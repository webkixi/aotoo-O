import $ from 'jquery'
import treex from 'aotoo-react-treex'

const getdata = require('./permissiondata.json')

function index(router){
  const permissionFunc = (res, checkbox) =>{
    let output = []
    const xx = (item) => {
      return <div className="c-check row-flex-center">
          <input type="checkbox" data-id={item.id} name={item.id} className='item-input' />
          <span className="fkp-checkbox-box"></span>
          <span className='item-li'>{item.sourceName}</span>
        </div>
      
    }
    res.map( (item, ii) =>{
      output.push({
        title: checkbox ? xx(item) : item.sourceName,
        idf: item.id,
        parent: item.parentId
      })
    })

    return output
  }
  const permission = treex({
    props: {
      data: permissionFunc(getdata, true),
      listClass: 'ss-permission'
    }
  })

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
      //点击更多按钮
      $(dom).on('click', '.item-more', function(){
        console.log('===========889922')
        $(this).toggleClass('active')
        // $(this).parents('.inner').find('.hbody').toggleClass('item-removeHeight')
      })
      $(dom).on('click', '.c-check', function(){
        console.log('============0000022')
        // if ($(this).find('input').is(':checked')){
        //   console.log('=========')
        //   $(this).find('input').attr('checked', true)
        //   $(this).next('.property-ul').find('input[name]').prop('checked', true)
        // }else{
        //   $(this).find('input').attr('checked', false)
        //   $(this).next('.property-ul').find('input[name]').prop('checked', false)
        // }
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
