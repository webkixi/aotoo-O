class DocsList extends React.Component{
  constructor(props){
    super(props)
    this.state = {}
  }
  componentWillMount() {
    if (this.props.data){
      this.setState({
        data: this.props.data   // array [{title: '', url: ''}]
      })
    }
  }
  render(){
    let lis = this.state.data.map((item, i)=>{
      let _img = item.img ? <img src={item.img} /> : <span className="iconfont icon-favor star"></span>
      return (
        <li key={item.title+i}>
          <a href={item.url}>
            <span className='img'>
              {_img}
            </span>
            <span>{item.title}</span>
          </a>
        </li>
      )
    })
    return (
      <ul> {lis} </ul>
    )
  }
}

let exportHtml = (datas) => {
  if (!datas) return false
  let id = 'CacheDocList'
  return Cache.ifid(id, ()=>{
    let _datas = datas.map((item, i)=>{
      return {
        title: item.name,
        url: '/docs/'+item.name,
        img: item.img||'',
        key: item.name+i
      }
    })
    let tmp = ReactDomServer.renderToString(<DocsList data={_datas} />)
    Cache.set(id, tmp)
    return tmp;
  })
}

export default exportHtml
