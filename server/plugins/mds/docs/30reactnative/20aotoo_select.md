# select组件
aotoo是一个轻量级的react库，使用aotoo可以更加快速的开发 `react` 的解耦组件，aotoo支持 `NODE/前端/REACT NATIVE` 三端开发，统一的接口及API规则。aotoo应用了部分 `react-redux` 的特性，但aotoo处理的是各个组件的微状态，当然我们也可以像redux那样处理工程级别代码的数据状态，但原则上aotoo不建议大家这么做

aotoo是一个微内核的工具库，我们可以动态的扩展aotoo的助手方法，以提升开发效率。作者本人是 `JQUERY` 的重度用户，因此无论开发理念或者是在API的接口规划上都希望遵循 `JQUERY` 的一套方式，当然并没有严格意义上的标准，只是尽量靠近 `JQUERY`


## INSTALL
```bash
yarn install aotoo
yarn install aotoo-web-widgets

npm i aotoo
npm i aotoo-web-widgets

# 建议使用yarn
```

## 引入  
```js
// pc or mobile
const aotoo = require('aotoo').default
require('aotoo-web-widgets')  // node & fed

// react native
const aotoo = require('aotoo').default
require('aotoo-rn-widgets')  // react native


/*
 * ES6 引入规则
*/
import aotoo from 'aotoo'
require('aotoo-web-widgets')

import aotoo from 'aotoo'
require('aotoo-rn-widgets')
```

###  NOTE
> 全局变量 Aotoo  
引入`aotoo`后，会自动产生全局变量 `Aotoo` 

> aotoo-web-widgets  
WEB端引入`aotoo`后，请引入web端的aotoo助手，`aotoo-web-widgets`，该库包含了几个非常有用的助手方法，记得吗？前端和node端都可以使用aotoo

> aotoo-rn-widgets  
React Native端引入`aotoo`后，请引入RN端的aotoo助手，`aotoo-rn-widgets`，该库保持了与WEB端一致的api，使得RN开发更加简单


## API
1. aotoo {function}   
  aotoo的核心方法  

2. aotoo.render  
  对 React.render的封装，更简单的使用，在node端，该方法会返回解析JSX后的字符串

> 以下方法属于aotoo的助手方法，也就是上面说的 `aotoo-web-widgets` 和 `aotoo-rn-widgets`    
1. aotoo.item  {function}   
   生成单个结构  

2. aotoo.list  {function}   
   生成列表结构  

3. aotoo.tree  {function}   
   生成树结构，RN端存在性能问题，不建议用    

4. aotoo.wrap  {function}   
   包裹JSX或者React Class，后面讲    

5. aotoo.transTree  {function}   
   将规则数组组合成树数据结构，list可以直接使用该数据   


## Other Api  
以下API转自lodash，具体文档请参考lodash  

* aotoo.find  
* aotoo.findIndex  
* aotoo.cloneDeep  
* aotoo.filter  
* aotoo.merge  
* aotoo.uniqueid  
* aotoo.isPlainObject  

## USAGE

### aotoo

```jsx
import aotoo from 'aotoo'
require('aotoo-web-widgets')


/*
 * 第一步, 定义一个常规 react class 
 */
class Test extends React.Component {
  constructor(props) {
    super(props)
    this.state = { message: '1234' }
  }
  render(){
    return (
      <div className='container'>
        {this.state.message}
        <button className="btn">试试看</button>
      </div>
    )
  }
}

/*
 * 第二步, 定义Action，修改state的属性状态 
 * key必须为大写
 * {ostate}: 为原始state，任何时候都不会变化，如上例，message会一直等于 '1234'
 * {opts}：为传入参数
 * {ctx}：实例，即下面的 instance
 * {this.curState}: 真实state的复制变量
 */
const Actions = {
  CONTENT: function(ostate, opts, ctx){
    let state = this.curState
    state.message = opts.content
    return state  // 将改变状态的state返回，aotoo的内部机制会自动将数据做setState
  }
}

/*
 * 第三步, 将 Test和Actions绑定，并生成实例
 * 自动生成实例方法 $content = function(opts){ ...... }
 * 执行$content方法会驱动 Actiions['CONTENT']方法，并促使绑定的 React Class响应
 */
const instance = aotoo(Test, Actions)


/*
 * 第四步, 设置实例的rendered方法，
 * rendered会在组件绑定到页面后执行
 * {dom} {DOM} 指向Test.render(...)中的结构
 * 这里用jquery绑定click事件，触发执行 $content方法，并重新渲染整个组件
 */
instance.rendered = function(dom){
  $(dom).find('.btn').click(function(){
    instance.$content({ content: '你好！世界' })
  })
}


/*
 * 第五步, 将组件绑定到页面ID
 */
instance.render('test')
```




### aotoo.item
```jsx
// 1
const testitem = Aotoo.item({
  data: {
    title: 'hello world',   // title support String or Jsx dom
    url: 'http://www.agzgz.com'
  }
})

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




### aotoo.list
```jsx
const testlist = Aotoo.list(
  {
    data: [
      { title: 'hello'},    // title support String or Jsx dom
      { title: 'world'},
      { title: 'agzgz'}
    ]
  }
)

Aotoo.render(
  testlist,
  'test'
)

// resault 
// <ul>
//  <li>hello</li>
//  <li>world</li>
//  <li>agzgz</li>
// </ul>
```




### aotoo.tree
```jsx
const testtree = Aotoo.list(
  {
    data: [
      { title: 'hello', idf: 'root'},   // title support String or Jsx dom
      { title: 'world', parent: 'root', idf: 'second'},
      { title: 'you are', parent: 'second', idf: 'third'},
      { title: 'beautiful', parent: 'third'},
      { title: 'agzgz', attr: {id: 'index'}}
    ]
  }
)

Aotoo.render(
  testtree,
  'test'
)

/*
// resault 
<ul>
  <li>    // => class=level-0
      <span>hello</span>
      ul
          li         // => class=level-1
              span   // => world
              ul
                  li         // => class=level-2
                      span   // => you are
                      ul
                          li    // => beautiful class=level-3
  </li>
  <li>agzgz</li>
</ul>
*/
```

### aotoo.wrap

#### wrap Jsx dom
```jsx
  // case 1
  const testdiv = <div><span className="agzgz">hello world<span></div>
  const NewReactClass = aotoo.wrap(
    testdiv,
    function(dom){
      $(dom).find('.agzgz').click(()=>{
        alert(1)
      })
    }
  )

  aotoo.render( <NewReactClass />, 'testdom')

  // case 2
  const testdiv = <div><span className="agzgz">hello world<span></div>
  const NewReactClass = aotoo.wrap( testdiv )

  aotoo.render( <NewReactClass rendered={function(dom){ //... }}/>, 'testdom')
```


#### wrap react class
```jsx
  class Test extends React.Component {
    constructor(props){
      super(props)
      ...
    }
    render(){
      return (
        // ...some jsx dom
      )
    }
  }

  // case 1
  const NewReactClass = aotoo.wrap(
    Test,
    function(dom){
      $(dom).find('.agzgz').click(()=>{
        alert(1)
      })
    }
  )

  // case 2
  const NewReactClass = aotoo.wrap( Test )
  aotoo.render( <NewReactClass rendered={function(dom){ //... }}/>, 'testdom')
  
```


### aotoo.transTree

```jsx
// the data as follow that will be translated to .... 

// before
data: [
  { title: 'hello', idf: 'root'},   // title support String or Jsx dom
  { title: 'world', parent: 'root', idf: 'second'},
  { title: 'you are', parent: 'second', idf: 'third'},
  { title: 'beautiful', parent: 'third'},
  { title: 'agzgz', attr: {id: 'index'}}
]

// after
/*
data: [
  { title: 'hello', li:[
    {title: 'world', li: [
      {title: 'you are', li:[
        {title: 'beautiful'}
      ]}
    ]}
  ]}, 
  { title: 'agzgz', attr: {id: 'index'}}
]
*/

// and then will be resolved to jsx dom with multi-layer
```