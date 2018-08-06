import $ from 'jquery'

function index(router){
  const Pages = Aotoo.wrap(
    <div className='sb-content'>
        <h1>Sub Sup</h1>
        <ul className='item-card row-flex-in mt20'>
          <li className='g-col-6 item-card-li padding-15'>
            <p>傻逼<sup className='ss-dot'></sup></p>
            <p>傻逼<sub className='ss-dot'></sub></p>
          </li>
          <li className='g-col-6 item-card-li padding-15'>代码展示</li>
        </ul>
        <ul className='item-card row-flex-in mt20'>
          <li className='g-col-6 item-card-li padding-15 row-flex'>
            <span className='ss-relative-ib mr8'><span className='ss-avatar-circle-lg'><span className='flex-vertical-center'>傻逼</span></span><sup className='ss-dot-absolute'></sup></span>
            <span className='ss-relative-ib mr8'><span className='ss-avatar-circle'><span className='flex-vertical-center'>傻逼</span></span><sub className='ss-dot-absolute'></sub></span>
            <span className='ss-relative-ib mr8'><span className='ss-avatar-circle-sm'><span className='flex-vertical-center icon-user'></span></span><sup className='ss-dot-absolute'></sup></span>
          </li>
          <li className='g-col-6 item-card-li padding-15'>代码展示</li>
        </ul>
        <ul className='item-card row-flex-in mt20'>
          <li className='g-col-6 item-card-li padding-15 row-flex'>
            <span className='ss-relative-ib mr8'><span className='ss-avatar-radius-lg border-radius-0'><span className='flex-vertical-center'>傻逼</span></span><sup className='ss-dot-absolute'></sup></span>
            <span className='ss-relative-ib mr8'><span className='ss-avatar-radius-lg'><span className='flex-vertical-center'>傻逼</span></span><sup className='ss-dot-absolute'></sup></span>
            <span className='ss-relative-ib mr8'><span className='ss-avatar-radius'><span className='flex-vertical-center'>傻逼</span></span><sub className='ss-dot-absolute'></sub></span>
            <span className='ss-relative-ib mr8'><span className='ss-avatar-radius-sm'><span className='flex-vertical-center icon-user'></span></span><sup className='ss-dot-absolute'></sup></span>
          </li>
          <li className='g-col-6 item-card-li padding-15'>代码展示</li>
        </ul>
    </div>
  )
  return <Pages/>
}

module.exports = function(router) {
  return {
    main: function () {
      return index(router)
    },
    enter: function (data) {
      return this.main()
    },
    leave: function () {
      console.log('======= 3333');
    }
  }
}
