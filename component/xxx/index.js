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

export default Aotoo(Test, Actions)
