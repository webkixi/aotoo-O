class Steps extends React.Component{
  constructor( props) {
    super( props )
    this.state = {
      data: this.props.data,
      listClass: this.props.listClass || '',
      current: this.props.current || 0,
      direction: this.props.direction || 'horizontal',
      status: this.props.status,
      type: this.props.type || ''
    }
    this.adpterSteps = this::this.adpterSteps
  }
  //适配方法  处理数据
  adpterSteps (res, direction){
    if (res && res.length){
      return res.map( (item, ii) => {
        let iconTitle = item.iclass || false
        let num = (ii + 1).toString()
        let current = this.state.current
        let status = this.state.status || 'wait'
        return({
          body: [
            {
              title: this.state.type != 'dot' ? iconTitle == false ? current > ii ? ' ' : num : ' ' : <div className='ss-steps-icon-dot'><i className='item-dot'></i></div>,
              itemClass: item.iclass || 'ss-steps-icon'
            },
            {
              k: <em className='ss-steps-title'>{item.title}</em>,
              v: <p>{item.description}</p>,
              itemClass: 'ss-steps-item-content'
            }
          ],
          itemClass: current ? current - ii == 1 ? 'ss-'+status : current - ii > 0 ? 'ss-finish' : 'ss-wait' : 'ss-wait'
          // itemClass: current <= 0 ? 'ss-process' :  current - ii == 0 ? 'ss-'+status : current - ii < 0 ? 'ss-wait' :'ss-finish'
          // itemClass: (current - ii == 1 && status == 'error') ? 'ss-finish ss-next-error' : current > ii ? 'ss-finish' : (current == ii && status == 'error') ? 'ss-error' : (current < ii) ? 'ss-wait' : 'ss-process'
        })
      })
    }
  }
  render(){
    return Aotoo.list({
      data: this.adpterSteps(this.state.data, this.state.direction),
      listClass: this.state.listClass + ' ss-steps ss-steps-' + this.state.direction + (this.props.type == 'dot' ? '-' + this.props.type : ' '),
    })
  }
}

const Action = {
  UPDATE: (ostate, opts) => {
    ostate.current = opts.current
    ostate.status = opts.status
    return ostate
  }
}

const steps = (opts) => {
  const ins = Aotoo(Steps, Action)
  ins.setProps(opts)
  return ins
}

export default function _steps(opts){
  let dft = {
    // data: [],
    // current: 1,
    // direction: 'horizontal',
    // status: 'process'
  }
  dft = _.merge( dft, opts)
  return steps(dft)
}