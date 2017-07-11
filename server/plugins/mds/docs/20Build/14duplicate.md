# 特殊命名
> 使用FKP2需要注意一些特殊命名，以免编译出错   


## `-` (中横杠) 禁用
不要使用 `-` (中横杠) 命名文件/目录  
FKP2在编译时，会将嵌套目录自动命名为带`-`的文件名  
```
pages/abc/xxx/index.css -> dist/css/abc-xxx.css
pages/abc/xxx/index.js -> dist/js/abc-xxx.js
```

## `_` (下划线) 带忽略属性
以`_`(下划线)开始的文件/目录，编译时会主动忽略  

#### 忽略目录
```
pages/_abc/xxx/index.js -> dist/
pages/abc/xxx/index.js  -> dist/abc-xxx.js

pages/_abc/xxx/index.css -> dist/
pages/abc/xxx/index.css  -> dist/abc-xxx.css

```

#### 忽略文件
```
{
  pages/abc/xxx/_hello.js
  pages/abc/xxx/index.js
}
  -> dist/abc-xxx.js 不包含_hello.js内容  

{
  pages/abc/xxx/_hello.css
  pages/abc/xxx/index.css
}
  -> dist/abc-xxx.css 不包含_hello.css内容

```

#### 引入忽略文件  
> 忽略文件不会主动被编译环境编译生成，但可以手动引入  

结构
```
root/public/js
    │
    └──pages
        └──abc  // -> dist/js/abc.js
           ├── yyy.js
           └── _xxx   //忽略目录
                ├──hello.js
                └──nihao.js

```

yyy.js  
```
import {fun} from './_xxx/hello'
```
