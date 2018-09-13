import stepsComponent from './steps_adapter'

const dt = [
  {
    title: 'Finished',
    description: 'This is a description.',
    // iclass: 'icon-mp',
    iclass: '',
    iconFinishedClass: 'icon_close_right'
  },
  {
    title: 'In Progress',
    description: 'This is a description.',
    // iclass: 'icon-mp'
    iclass: '',
  },
  {
    title: 'Waiting',
    description: 'This is a description.',
    // iclass: 'icon-mp'
    // iclass: '',
  }
]

const stepsHorizontal = stepsComponent({
  data: dt,       //必填 数据
  // direction: 'vertical',      //指定步骤条方向。目前支持水平（horizontal）和竖直（vertical）两种方向
  // listClass: 'xx',     //外层class
  // current: 1,     //当前位置
  // status: 'error'     //当前位置的状态 可选 wait process finish error
  // type: ''   //默
})

const stepsHorizontalDot = stepsComponent({
  data: dt,       //必填 数据
  direction: 'horizontal',      //指定步骤条方向。目前支持水平（horizontal）和竖直（vertical）两种方向
  listClass: 'ss-steps-dot',     //外层class
  type: 'dot',
  // current: 1,     //当前位置
  // status: 'error'     //当前位置的状态 可选 wait process finish error
})

const stepsVertical = stepsComponent({
  data: dt,       //必填 数据
  direction: 'vertical',      //指定步骤条方向。目前支持水平（horizontal）和竖直（vertical）两种方向
})

const stepsVerticalDot = stepsComponent({
  data: dt,       //必填 数据
  direction: 'vertical',      //指定步骤条方向。目前支持水平（horizontal）和竖直（vertical）两种方向
  listClass: 'ss-steps-dot',     //外层class
  type: 'dot',
})

const Page = Aotoo.wrap(
  <div style={{margin: '20px'}}>
    {stepsHorizontal.render()}
    <div style={{height: '300px', margin: '30px'}}>
      {stepsVertical.render()}
    </div>
    {stepsHorizontalDot.render()}
    <div style={{height: '300px', margin: '80px 30px'}}>
      {stepsVerticalDot.render()}
    </div>
  </div>
  ,function(dom){
   setTimeout(() => {
    stepsHorizontal.$update({
      current: 2,
      status: 'error'
    })
   }, 1000); 
   setTimeout(() => {
    stepsVerticalDot.$update({
      current: 1,
      status: 'process'
    })
   }, 1000); 
  }
)

export default <Page/>