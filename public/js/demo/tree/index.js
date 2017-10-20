require('./tree.stylus')
const _data = [
  {title: <div className='row-flex-justify-between-wrap tree-head'><em>广东</em><a href='javascript:;'>天河区</a></div>, idf: 'gd'},
  {title: <div className='row-flex-justify-between-wrap tree-head'><em>湖南</em><a href='javascript:;' className='tree-toggle-icon'></a></div>, idf: 'hn'},
  {title: <div className='row-flex-justify-between-wrap tree-head'><em>湖北</em><a href='javascript:;' className='tree-toggle-icon'>天河区</a></div>, idf: 'hb'},
  {title: '广州', parent: 'gd'},
  {title: '深圳', parent: 'gd'},
  {title: '珠海', parent: 'gd'},
  {title: '汕头', parent: 'gd'},
  {title: '韶关', parent: 'gd'},
  {title: '长沙', parent: 'hn'},
  {title: '株洲', parent: 'hn'},
  {title: '湘潭', parent: 'hn'},
  {title: '韶山', parent: 'hn'},
  {title: '娄底', parent: 'hn'},
  {title: '长沙', parent: 'hb'},
  {title: '韶山', parent: 'hb'},
  {title: '娄韶山底', parent: 'hb'},
  {title: '娄底', parent: 'hb'},
  {title: '娄底', parent: 'hb'},
]
const treeTest = Aotoo.tree({
  data: _data,
  listClass: 'tree-basic-more'
})
Aotoo.render(treeTest, 'tree')
