# copy2dist目录
> 项目中经常会引用到第三方库，比如`ueditor / webuploader...`，这类很难融入到现有代码结构当中的第三方库，FKP的解决方案按就是copy2dist  

FKP2在编译时，会主动将`_copy2dist`下的文件/目录原封不动的移动到 `dist`中去，方便我们在模板中引用

## 源码结构

    root
      │            
      ├── public  // 源
      │    │
      │    ├──css
      │    │   └── _copy2dist
      │    │          ├──animate.css  
      │    │          └──markdown.css  
      │    └──js
      │        └── _copy2dist
      │               └──ueditor  
      │                    ├──???.js
      │                    ├──???.css
      │                    └——zzz
      │                        └——??.js
      └── dist  // 输出
           └── dev
                └──css
                │   └── t
                │       └──animate.css
                │              
                └──js
                    └── t
                        └──ueditor
                              ├──???.js
                              ├──???.css
                              └——zzz
                                   └——??.js

## `t` 目录

`_copy2dist`下的文件及目录会原封不动的移动到`t`目录下  
>.warning 注意`_copy2dist`属于忽略目录，请参考[特殊命名](/docs/fkpdoc/20Build/14duplicate?treeid=8)


## 模板引用
```
// js
<script src='/js/t/ueditor.js'></script>

// css
<link href='/css/t/animate.css' />
```
