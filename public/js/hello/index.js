// Aotoo.render(
//   <div>1234</div>,
//   'test'
// )

// const testitem = Aotoo.item({
//   data: {
//     title: '网易',
//     url: 'http://www.163.com'
//   }
// })
//
// Aotoo.render(
//   testitem,
//   'test'
// )


// const testlist = Aotoo.list(
//   {
//     data: [
//       { title: '网易'},
//       { title: '太平洋'},
//     ]
//   }
// )
//
// Aotoo.render(
//   testlist,
//   'test'
// )

const testtree = Aotoo.tree(
  {
    data: [
      { title: '网易'},
      { title: '太平洋'},
    ]
  }
)

Aotoo.render(
  testtree,
  'test'
)
