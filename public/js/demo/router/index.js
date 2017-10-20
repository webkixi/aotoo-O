require('aotoo-react-router')
require('./router.stylus')
const routerData = [
  {title: '我是一级', idf: 'aa1'},
  {title: '我是二级', idf: 'aa2', parent: 'aa1'},
  {title: '我是三级', idf: 'aa3', parent: 'aa2'},
  {title: '我是四级A', content: '什么3', path: 'a4', attr:{path: 'a4'}, parent: 'aa3'},
  {title: '我是四级B', content: '什sssssss么4', path: 'a5', attr:{path: 'a5'}, parent: 'aa3'},
  {title: '我是一级B', content: 'forLeave', path: 'a2', attr:{path: 'a2'}},
  {title: '我是一级C', content: '<WrapElement />', path: 'a3', attr:{path: 'a3'}, itemClass: 'yyy'}
]
const router = Aotoo.router({
  props: {
    animate: 'fade',
    data: routerData,
    itemClass: 'nihao',
    routerClass: 'router-mob-basic',
    showMenu: true,     //控制Mean是否显示
    itemMethod: function(dom){
      if($(dom).hasClass('itemroot')) {
        $(dom).find("li.nihao:not(.itemroot)").click(function(e){
          e.stopPropagation()
          const _path = $(this).attr('data-path')
          router.goto(_path)
        })
      } else {
        $(dom).click(function(e){
          e.stopPropagation()
          const _path = $(dom).attr('data-path')
          router.goto(_path)
        })
      }
    }
  }
})
router.start('a4')
router.render('router', function(dom){ })
