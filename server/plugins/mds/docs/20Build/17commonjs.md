# CommonJs构成
> 考虑到JS执行效率及浏览器缓存能提升访问速度，将JS分为以下两个部分
1. 公共部分  
2. 业务部分

FKP2将`react`等第三方库，通过gulp合并、压缩并与webpack CommonsChunkPlugin提取的公共文件合并一处，成为`common.js`,供页面调用
编译后，我们看到的HTML结构最终如下
```.html
<!-- 开发环境 -->
<html>   
  <body>
    ...
    ...
    <script type="text/javascript" src="/js/common.js" ></script>
    <script type="text/javascript" src="/js/hello.js"></script>
  </body>
</html>


<!-- 生产环境 -->
    ...
    ...
    <script type="text/javascript" src="/js/common__76ca5b11b16af5e0f907.js" ></script>
    <script type="text/javascript" src="/js/hello__76ca5b11b16af5e0f907.js" ></script>
  </body>
</html>
```

## 如何引入common.js
每个页面均动态引入了`common.js`，我们在模板开发中无需手动指定，只需要包含特定的头部就可以了，以index.hbs为例

```.html
<!-- public/html/index.hbs -->
<!-- 生成文件为 dist/dev/html/index.html(开发环境) -->
<!-- 生成文件为 dist/html/index.html(生产环境) -->

<!doctype html>
<html class="no-js" lang="en">
  <head>
    <title>Hello World</title>
    @@include('./_common/header/head.html')

  </head>
  <body>
    我是首页
    @@include('./_common/footer/foot.html')

  </body>
</html>
```  

公共footer(foot.html)  

```.html
<!-- public/html/_common/footer/foot.html  -->

{{{commonjs}}}
{{{pagejs}}}   <!-- 当检测到同名js时，由node端挂载到这里  -->
{{{attachJs}}}   <!-- 由node端的control文件指定，并挂载到这里  -->
```

## common.js的构成  

- React.js
- JQ2.js
- Lodash.js > 4.0
- immutable.js
- webpack CommonsChunkPlugin提取的公共文件

-----

gzip后 ~180k  
FKP的组件依赖于以上几个库

## 生成commonjs
打开 `/build/src_config.js` 可以看到三个数组的配置

* vendorList_adv  
第三方依赖库, commonjs的第三方库配置，可以在这里增减相关的全局库  

* globalList  
自定义库会和上面的第三方库一起打包成common.js，fkp2的全局React融合了React和reactDom，正是在这里设置的  

* ieRequireList  
IE兼容库, 这个配置会生成ie.js，包含sham/shim等兼容js，PC端的话，请在模板中引入   
