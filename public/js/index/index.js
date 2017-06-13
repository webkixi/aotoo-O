// const $ = require('jquery')
// const React = require('react')
// const ReactDom = require('react-dom')

//
/// 常规
////
// Aotoo.render(
//   <div>1234</div>,
//   'test'
// )


//
/// item
////
// const testitem = Aotoo.item({
//   data: {
//     title: '网易',
//     url: 'http://www.163.com'
//   }
// })

// Aotoo.render(
//   testitem,
//   'test'
// )

//
/// list
////
// const testlist = Aotoo.list(
//   {
//     data: [
//       { title: '网易'},
//       { title: '太平洋'},
//     ]
//   }
// )

// Aotoo.render(
//   testlist,
//   'test'
// )

//
/// tree
////
// const testtree = Aotoo.tree(
//   {
//     data: [
//       { title: '网易'},
//       { title: '太平洋'},
//     ]
//   }
// )

// Aotoo.render(
//   testtree,
//   'test'
// )

//const data =  Aotoo.transTree([])

//
/// wrap
////
// const Testwrap = Aotoo.wrap(
//   <button className="btn">abc</button>
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
/// combinex
////
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
/// combineClass
////
// class Test extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       test: '1234'
//     }
//   }
//   render(){
//     console.log(this)
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









// import treex from 'component/treex'
// const treeTest = treex({
//   props: {
//     data: [
//       {title: '1111'},
//       {title: '2222'},
//       {title: '3333'}
//     ]
//   }
// })

// const testlist = Aotoo.list(
//   {
//     data: [
//       { title: '网易'},
//       { title: '太平洋'},
//     ]
//   }
// )

// const btns = Aotoo.list({
//   data: [
//     <button id="update" className="btn">update</button>,
//     <button id="append" className="btn">append</button>,
//     <button id="prepend" className="btn">prepend</button>,
//     <button id="delete" className="btn">delete</button>
//   ]
// })


// const Box = Aotoo.wrap(
//   <div>
//     {treeTest.render()}
//     {btns}
//   </div>
//   , function(dom){
//     $('#update').click(function(){
//       treeTest.$update({
//         data: [
//           {title: 'aaaaaa'},
//           {title: 'bbbbbb'},
//           {title: 'cccccc'}
//         ]
//       })
//     })
//     $('#append').click(function(){
//       treeTest.$append({
//         data: {title: '1111'}
//       })
//     })
//     $('#prepend').click(function(){
//       treeTest.$prepend({
//         data: {title: '1111'}
//       })
//     })
//     $('#delete').click(function(){
//       treeTest.$delete({
//         query: {title: '1111'}
//       })
//     })
//   }
// )


// Aotoo.render(<Box />, 'test')










//
///   Aotoo plugins
////
class Test extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      test: '1234'
    }
  }
  render(){
    return (
      <div className='container'>
        {this.state.test}
        <button className="btn">试试看</button>
      </div>
    )
  }
}

const Actions = {
  CONTENT: function(state, props){
    state.test = props.content
    return state
  }
}

function xxx(){
  const axxx = Aotoo(Test, Actions)
  return axxx.render(function(dom){
    $(dom).find('button').click(function(){
      axxx.$content({
        content: '哈哈哈'
      })
    })
  })
}

Aotoo.plugins('xxx', xxx)

class ATest extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      test: 'a12111111'
    }
  }
  render(){

    return (
      <div className='container'>
        {this.xxx()}
        <hr />
        {this.state.test}
        <button className="btn abtn">啊哈哈哈</button>
      </div>
    )
  }
}

const AActions = {
  CONTENT: function(state, props){
    state.test = props
    return state
  }
}

const yyy = Aotoo(ATest, AActions)
yyy.render('test', function(dom){
  $(dom).find('.abtn').click(function(){
    yyy.$content('什么鬼')
  })
})
