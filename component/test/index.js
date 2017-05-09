const Aotoo = require('aotoo')
const React = require('react')

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

function itemFun(dom){
  $(dom).find('button').click(function(){
    Abc.dispatch('CONTENT', {content: '你好，你很棒啊'})
  })
}

class abc extends Aotoo.CombineClass {
  constructor(config){
    super(config)
    this.combinex(Test, Actions)
  }
  
  content(message){
    this.dispatch('CONTENT', {content: message})
  }
}

export default function(cfg){
  return new abc(cfg)
}