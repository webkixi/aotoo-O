# CommonCss构成
> 考虑到浏览器缓存能提升访问速度，将CSS分为以下两个部分
1. 公共部分  
2. 业务部分

编译后，我们看到的HTML模板中的 _common.css_ 结构如下  

```.html
<!-- 开发环境 -->
<html>   
  <head>
    <link rel="stylesheet" href="/css/common.css" />
    <link rel="stylesheet" href="/css/hello.css" />
    ...
    ...
</html>

<!-- 生产环境 -->
  ...
    <link rel="stylesheet" href="/css/common__ffc6301e62.css" />
    <link rel="stylesheet" href="/css/hello__42a68043cb.css" />
    ...
    ...
</html>
```

## 如何引入common.css

每个页面均动态引入了`common.css`，我们在模板开发中无需手动指定，只需要包含特定的头部就可以了，以index.hbs为例

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
公共头部(head.html)  

```.html
<!-- public/html/_common/header/head.html  -->

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<link rel="shortcut icon" href="/images/favicon.ico">
{{{commoncss}}}
{{{pagecss}}}   <!-- 当检测到同名css时，由node端挂载到这里  -->
{{{attachCss}}}   <!-- 由node端的control文件指定，并挂载到这里  -->
<meta name="description" content="">
```

## common.css的组成

FKP2并没有自带`UI`库，FKP2的UI库是以组件为基础设计的，具有低耦合性，并没有特定的标准，可以根据不同的项目灵活的配置
但common.css包含一些有用的公共部分，在开发中可以方便的使用  

    1. flexboxgrid.less // flex栅格，用法同bootstrap3
    2. iconfont
    3. utill.less  // 助手库，几行code
    4. normalize.less

gzip后 ~6k  
FKP2的组件对以上库有依赖

## 生成common.css
生成 common.css 非常简单
`/public/css/global`文件夹中的所有文件将合并至`common.css`  


    root
      │            
      └── public  // 源
          │
          └──css
              └──global
                    ├──base.styl
                    ├──base.less
                    ├──ui/    // ui不属于忽略目录，目录下的文件会被统一合成到 common.css并被模板引入
                    │   └── other.styl/.less
                    ├── _stylus
                    │     ├──flexboxgrid.styl
                    │     ├──normalize.styl
                    │     ├──index.styl
                    │     └── ...
                    └── _less
                           ├──flexboxgrid.less
                           ├──normalize.less
                           ├──index.less
                           └── ...

请参考 [《特殊目录》](/docs/fkpdoc/20Build/14duplicate)
>.warning 注意：_stylus 及 _less 为忽略目录，我们在base.style及base.less中手动@import了所需类型文件的index文件   

.
>.warning 注意：同一目录下只能有同一种文件类型，比如全部为 _*.styl_ 或者 _*.less_
