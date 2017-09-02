# Aotoo.item
> 安装完成后，我们开始使用Aotoo，Aotoo.item可以简单的设置单个独立的元素，根据数据  

### 生成简单的View
```js
const itemData = { title: '我是title' }
const testItem = Aotoo.item({ data: itemData })

// testitem 为标准的JSX，
/*
testItem = (
  <View>
    <Text>我是title</Text>
  </View>
)
*/
```


```js
// 2
const testitem = Aotoo.item({
  data: {
    title: 'hello world'    // title support String or Jsx dom
  }
})

Aotoo.render(
  testitem,
  'test'
)

// resault 
// 1  =>  <div><a href...>hello world</a></div>
// 2  =>  <div>hello world</div>
```

