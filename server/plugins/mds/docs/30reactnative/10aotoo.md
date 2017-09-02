# 在RN中使用aotoo
> 我们可以在React Native中使用aotoo来开发RN相关组件

## INSTALL
```bash
yarn install aotoo
yarn install aotoo-rn-widgets
# 建议使用yarn
```

## 引入  
```js
/*
 * App.js
 * 项目使用expo来开发RN，同样支持 react native init新建模式
*/
import React from 'react';
import aotoo from 'aotoo'
require('aotoo-rn-widgets')

const MyApp = require('./src').default
export default class App extends React.Component {
  render() {
    return <MyApp />
  }
}
```

###  NOTE
> 全局变量 Aotoo  
引入`aotoo`后，会自动产生全局变量 `Aotoo` 

<>

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

