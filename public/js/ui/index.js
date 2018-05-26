// import $ from 'jquery'
import 'aotoo-react-router'

const routerData = require('./routerconfig')

const router = Aotoo.router({
  props: {
    data: routerData,
    routerClass: 'router-basic router-click',
    showMenu: true,
    itemMethod: function (dom) {
      $(dom).on('click', '.caption', function (e) {
        e.stopPropagation()
        const _path = $(this).attr('data-path') ? $(this).attr('data-path') :  $(this).parent('li').attr('data-path')
        if (_path) {
          router.goto(_path)
        }
        $('.router-close-input').removeClass('checked')
      })
    }
  }
})
const Pages = Aotoo.wrap(
  <div className='s-wrapper'>
    <div className='s-header'>
      <ul className='row-flex-justify-between-center hei-p100'>
        <li className='g-col-3'><a href='#' className='logo'><img src='https://file.iviewui.com/dist/03635a3c88122ad605117128f3fda0ca.png'/></a></li>
      </ul>
      <input type='checkbox' className='router-close-input' />
      <ul className='router-close'>
        <li><span></span></li>
        <li><span></span></li>
      </ul>
    </div>
    <div className='s-body'>{router.render()}</div>
  </div>
  ,function(dom){
    $(dom).find('.router-close-input').click(function(e){
      $(this).toggleClass('checked')
      $('.router-click .routerMenus').toggleClass('switchplatform')
    })
  }
)
// router.start('a1')
Aotoo.render(<Pages />, 'ui')