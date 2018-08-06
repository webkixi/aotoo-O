//获取元素的纵坐标（相对于窗口）
function getTop(e){
  var offset=e.offsetTop;
  if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
  return offset;
}
//获取元素的横坐标（相对于窗口）
function getLeft(e){
  var offset=e.offsetLeft;
  if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
  return offset;
}
if (!document.getElementById('xx')){
  $('body').append('<div id="xx"></div>')
}


class Box extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: props
    }
  }
  render() {
    return this.state.title
  }
}

//弹出结构
const createDiv = (opts, ins) =>{
  // const opts = this.state
  let Wrap = null
  if (opts.type == 'popover'){
    Wrap = Aotoo.wrap(
      <div className={opts.placement ? 'ss-popover ss-popover-'+opts.placement : 'ss-popover'}>
        <div className='ss-popover-content'>{opts.content}</div>
      </div>
      ,function(dom){
        if (opts.event == 'click'){
          $('body, '+opts.classClose||'').on('click', function(){
            ins.close()
          })
        }
        else {
          $('body').hover(function(){
            ins.close()
          })
        }
      }
    )
  }
  else {
    Wrap = Aotoo.wrap(
      <div className={opts.placement ? 'ss-tooltip ss-tooltip-'+opts.placement : 'ss-tooltip'}>
        <div className='ss-tooltip-content'>{opts.content}</div>
      </div>
      ,function(dom){
        if (opts.event == 'click'){
          $('body, '+opts.classClose||'').on('click', function(){
            ins.close()
          })
        }
        else {
          $(dom).hover(function(e){
            e.stopPropagation()
            ins.show()
          },function(e){
            e.stopPropagation()
            ins.close()
          })
        }
      }
    )
  }
  const kk = React.render(<Wrap/>, document.getElementById('xx'))
  return $('#xx').append(kk)
}
//弹出结构定位
const commonPartInteract = (e, opts, ins) =>{ 
  createDiv(opts, ins)
  if (opts.placement.indexOf('top') > -1){
    const kk = $('#xx>div')
    if (opts.type == 'popover'){
      $('.ss-popover').css({left: getLeft(e.target), top: getTop(e.target) - kk.height() - 10})
    }
    else {
      $('.ss-tooltip').css({left: getLeft(e.target), top: getTop(e.target) - e.target.offsetHeight - 10})
    }
  }
  else {
    if (opts.type == 'popover'){
      // $('.ss- tooltip').css({left: getLeft(e.target), top: getTop(e.target) - e.target.offsetHeight - 10})
    }
    else {
      $('.ss-tooltip').css({left: getLeft(e.target), top: getTop(e.target) + e.target.offsetHeight + 10})
    }
  }
}


const actions = {
  // CLOSE: function(state, props){
  //   console.log() 
  // }
}

function _rendered(ins, ctx, opts, cb){
  return function(dom, ctx){
    if (opts.event == 'click'){
      $(dom).off().on('click', function(e){
        e.stopPropagation()
        if ($('#xx').hasClass('ss-display-none')){
          $('#xx').removeClass('ss-display-none')
        }
        commonPartInteract(e, opts, ins)
      })
      $('#xx').off().on('click', function(e){
        e.stopPropagation()
      })
    }
    else {
      $(dom).hover(function(e){
        e.stopPropagation()
        if ($('#xx').hasClass('ss-display-none')){
          $('#xx').removeClass('ss-display-none')
        }
        commonPartInteract(e, opts, ins)
        ins.show()
      }, function(e){
        // ins.close()
      })
      // $('.ss-popover').hover(function(e){
      //   e.stopPropagation()
      // })

    }
    if (typeof cb == 'function'){
      cb.call(ctx, dom, ctx.dom)
    }
  }
}

function output(opts){
  const ins = Aotoo(Box, actions)
  ins.rendered = _rendered(ins, this, opts, opts.rendered ? opts.rendered : '' )
  ins.extend({
    show: function(props){
      $('#xx').removeClass("ss-display-none")
    },
    close: function(props){
      $('#xx').addClass("ss-display-none")
    }
  })
  ins.setProps(typeof opts.title == 'string' ? <span>{opts.title}</span> : opts.title)
  return ins
}


export default function xx(opts){
  let noon = false
  let dft = {
    content: '',
    clas: '',
    placement: '',
    itemMethod: noon
  }
  dft = _.merge(dft, opts)
  return output(dft)
}



// //获取元素的纵坐标（相对于窗口）
// function getTop(e){
//   var offset=e.offsetTop;
//   if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
//   return offset;
// }
// //获取元素的横坐标（相对于窗口）
// function getLeft(e){
//   var offset=e.offsetLeft;
//   if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
//   return offset;
// }
// $('body').append('<div id="xx" class="ss-cover-bg"></div>')

// $('.ss-cover-bg').on('click', '.ss-cover-bg', function(){
//   console.log('====')
//   $(this).html('')
// })

// class Box extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       title: this.props.children,
//       content: this.props.content,
//       cls: this.props.cls||'',
//       placement: this.props.placement,
//       event: this.props.event || false,
//       type: this.props.type || 'tooltip'
//     }
//   }
  
//   createDiv = () =>{
//     $('#xx').html('')
//     const opts = this.state
//     let wrap = null
//     if (opts.type == 'popover'){
//       wrap = (
//         <div className={opts.placement ? 'ss-popover ss-popover-'+opts.placement : 'ss-popover'}>
//           <div className='ss-popover-content'>{opts.content}</div>
//         </div>
//       )
//     }
//     else {
//       wrap = (
//         <div className={opts.placement ? 'ss-tooltip ss-tooltip-'+opts.placement : 'ss-tooltip'}>
//           <div className='ss-tooltip-content'>{opts.content}</div>
//         </div>
//       )
//     }
//     const kk = React.render(wrap, document.getElementById('xx'))
//     return $('#xx').append(kk)
//   }

//   commonPart = (e) => { 
//     this.createDiv()
//     const opts = this.state
//     if (opts.placement.indexOf('top') > -1){
//       const kk = this.createDiv().find('>div')
//       if (opts.type == 'popover'){
//         console.log(getLeft(e.target), getTop(e.target), kk.height())
//         $('.ss-popover').css({left: getLeft(e.target), top: getTop(e.target) - kk.height() - 10})
//       }
//       else {
//         $('.ss-tooltip').css({left: getLeft(e.target), top: getTop(e.target) - e.target.offsetHeight - 10})
//       }
//     }
//     else {
//       if (opts.type == 'popover'){
//         // $('.ss-tooltip').css({left: getLeft(e.target), top: getTop(e.target) - e.target.offsetHeight - 10})
//       }
//       else {
//         $('.ss-tooltip').css({left: getLeft(e.target), top: getTop(e.target) + e.target.offsetHeight + 10})
//       }
//     }
//   }
//   mouserOver = (e) => {
//     this.commonPart(e)
//   }
//   mouserOut = (e) => {
//     $('#xx').html('')
//   }
//   handChanges = (e) =>{
//     if ($('#xx>div').length == 0){
//       this.commonPart(e)
//     }
//   }
  
//   render() {
//     const opts = this.state
//     return (
//       opts.event == false
//       ? <div className={'ss-display-block'} onMouseEnter={this.mouserOver} onMouseLeave={this.mouserOut}>{opts.title}</div>
//       : <div className={opts.cls} onClick={this.handChanges}>{opts.title}</div>
//     )
//   }
// }



// export default Box