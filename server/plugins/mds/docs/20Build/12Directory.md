# 同名编译规则

## 同名映射  
每个HTML的模板页面都需要相应的静态资源（js/css），为了做到自动化挂载相关静态文件，fkp2中通过 `同名` 的方式简单的实现资源映射，这样系统会自动挂载`同名`的静态资源到模板上
而无需人工手动填写，生产环境的**hash**文件名也能够映射到模板中，是不是有点黑科技的感觉

#### hello.html输出自动匹配同名静态文件:

```.html
<!-- hello.html -->
<html>
  <head>
    <link rel="stylesheet" href="/css/common.css" />
    <link rel="stylesheet" href="/css/hello.css" />
  </head>
  <body>
    ...
    ...
    <script type="text/javascript" src="/js/common.js" ></script>
    <script type="text/javascript" src="/js/hello.js"></script>
  </body>
</html>
```


## hello 的目录结构  

```
root
  │            
  ├── public  // 源
  │    │
  │    ├──html
  │    │   └───────hello.hbs
  │    │
  │    ├──css
  │    │   └──pages
  │    │        └──hello
  │    │            ├──xxx.styl
  │    └──js        └──yyy.styl
  │        └──pages
  │             └──hello
  │                 ├——xxx.js
  │                 └——yyy.js
  │
  └── server  // NODE端
       └── pages             
            └──────hello.js
```

- html/hello.hbs 模板，文件，所有其他部分都是为模板服务
- css/pages/hello/*  与模板匹配的CSS内容，目录，该目录下所有文件会编译成为 hello.css
- js/pages/hello/*  与模板匹配的JS内容，目录，该目录下所有文件会编译成为 hello.js
- server/pages/hello.js  与模板匹配的nodejs内容，文件，该文件为 hello 提供http服务，这样浏览器就能够通过url访问http://domain/hello

#### 简单了解下api访问   
FKP2基于KOA2的MVC模式实现了 NODE 的 server端服务，在上例中，_**server/pages/hello.js**_ 文件，实际上是 MVC 中的 control 层
，当浏览器访问 _http:://localhost:3000/hello_ 时，_server/pages/hello.js_ 将会响应，并展示hello的页面。同时该文件也作为api供ajax的数据调用
具体的操作我们后面实例会讲到    

1. localhost:3000/hello:  
`server/pages/hello.js` GET响应  
2. ajax.get('/hello'):  
ajax/api指向`server/pages/hello.js` GET  
3. ajax.post('/hello'):  
ajax/api指向`server/pages/hello.js` POST  


## CSS产出结构

```
dist
  │            
  ├──css
  │   └──hello__b4e2783d81.css  //生产环境
  │   
  └──dev
      └──css
          └──hello.css  //开发环境
```

## JS产出结构
```
dist
  │            
  ├──js
  │   └──hello__b4e2783d81.js  //生产环境
  │   
  └──dev
      └──js
          └──hello.js  //开发环境

```


## HTML产出结构
JS/CSS会将与HTML的同名目录产出同名`.css/.js`，产出后的HTML结构如下:

```
dist
  │            
  ├──html
  │   └──hello.html  //生产环境
  └──dev
      └──html
          └──hello.html  //开发环境

```
