
//
// 常规
//
// Aotoo.render(
//   <div>1234</div>,
//   'test'
// )


//
// item
//
// const testitem = Aotoo.item({
//   data: {
//     title: '网易',
//     url: 'http://www.163.com'
//   }
// })
//
// Aotoo.render(
//   testitem,
//   'test'
// )

//
// list
//
// const testlist = Aotoo.list(
//   {
//     data: [
//       { title: '网易'},
//       { title: '太平洋'},
//     ]
//   }
// )
//
// Aotoo.render(
//   testlist,
//   'test'
// )

//
// tree
//
const testtree = Aotoo.tree(
  {
    data: [
      { title: '网易'},
      { title: '太平洋'},
    ]
  }
)

Aotoo.render(
  testtree,
  'test'
)

//const data =  Aotoo.transTree([])

//
// wrap
//
// const Testwrap = Aotoo.wrap(
//   <div className="btn">abc</div>
//   , function(dom){
//     $(dom).click(()=>{
//       alert('1234')
//     })
//   }
// )

// Aotoo.render(
//   <Testwrap />,
//   'test'
// )


//
// combinex
//
// class Test extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       test: '1234'
//     }
//   }
//   render(){
//     return (
//       <div className='container'>
//         {this.state.test}
//         <button className="btn">试试看</button>
//       </div>
//     )
//   }
// }

// const Actions = {
//   CONTENT: function(state, props){
//     state.test = props.content
//     return state
//   }
// }

// const Abc = Aotoo.combinex(Test, Actions)

// function itemFun(dom){
//   $(dom).find('button').click(function(){
//     Abc.dispatch('CONTENT', {content: '你好，你很棒啊'})
//   })
// }

// Aotoo.render(<Abc.element itemMethod={itemFun}/>, 'test')


//
// combineClass
//
// class Test extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       test: '1234'
//     }
//   }
//   render(){
//     return (
//       <div className='container'>
//         {this.state.test}
//         <button className="btn">试试看</button>
//       </div>
//     )
//   }
// }

// const Actions = {
//   CONTENT: function(state, props){
//     state.test = props.content
//     return state
//   }
// }

// function itemFun(dom){
//   $(dom).find('button').click(function(){
//     Abc.dispatch('CONTENT', {content: '你好，你很棒啊'})
//   })
// }

// class abc extends Aotoo.CombineClass {
//   constructor(config){
//     super(config)
//     this.combinex(Test, Actions)
//   }

//   content(message){
//     this.dispatch('CONTENT', {content: message})
//   }
// }

// const Abc = new abc({
//   props: {}
// })

// Abc.rendered = function(dom){
//   $(dom).find('button').click( e=>{
//     Abc.content('你好呀，世界')
//   })
// }
// Abc.render('test')


//
// import a combineClass class
//
// import abc from 'component/test'
// ========= 111 =========
// const Xxx = abc()
// const Yyy = Aotoo.wrap(
//   <Xxx.x />
//   ,function(dom){
//   $(dom).find('button').click( e=>{
//     Xxx.content('你好呀，世界')
//   })
// })
// Aotoo.render(<Yyy />, 'test')

// ========= 222 ==========
// const Xxx = abc({props: {}})
// Xxx.rendered = function(dom){
//   $(dom).find('button').click( e=>{
//     Xxx.content('你好呀，世界')
//   })
// }
// Xxx.render('test')




//
//
//
// import xxx from 'component/xxx'
// xxx.append({
//   YYY: function(state, param){
//     state.test = param.content
//     return state
//   }
// })

// // xxx.render('test', function(dom){
// //   $(dom).find('button').click( e=>{
// //     xxx.content({content: '你好呀，世界'})
// //   })
// // })

// xxx.render('test', function(dom){
//   $(dom).find('button').click( e=>{
//     xxx.yyy({content: '什么鬼啊'})
//   })
// })
