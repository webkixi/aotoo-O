import $ from 'jquery'
import echarts from  '../../../3ds/js/echarts'
import data from './data'

function index(router){
  
  const Pages = Aotoo.wrap(
    <div className='sb-content'>
        <h1>Button 按钮</h1>
        <ul className='item-card mt20'>
          <li className='g-col-12 item-card-li padding-15'><div id='main' style={{width: '500px', height: '500px'}}></div></li>
          <li className='g-col-12 item-card-li padding-15'>代码展示</li>
        </ul>
    </div>
    ,function(dom){
      var myChart = echarts.init(document.getElementById('main'));
      // 绘制图表
      myChart.setOption({
          title: {
              text: 'ECharts 入门示例'
          },
          tooltip: {},
          xAxis: {
              data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          },
          yAxis: {},
          series: [{
              name: '销量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
          }]
      });
    }
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
