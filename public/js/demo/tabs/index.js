require('aotoo-react-tabs')
import Adapater from './adapter'
import Datas from './_data'
require('./tabs.stylus')

const Tabs = Aotoo.tabs({
  props: {
    tabClass: 'tabs-lr',
    data: Adapater.adapterCheckmudd(Datas._data.data.data.customPartitions),
    tabItemMethod: function(dom, index){
      $(dom).once('click', function(){
        Tabs.$select({ select: index })
      })

    }
  }
})

Tabs.render('tabs')
