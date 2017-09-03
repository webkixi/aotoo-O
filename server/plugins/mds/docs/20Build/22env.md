# 多环境支持
> 为了适应不同的环境配置

## 说明
从一开始我们就考虑到了适应各种不同的环境需求，如开发环境，测试环境，生产环境等，FKP2可以通过简单的命令行参数启用不同的配置文件以适应需求    

## 存放地址
#### 配置文件
默认配置文件存放在根目录下的config.js  
扩展配置文件存放地址为 _/configs/*_

#### 命名规则  
配置文件命名规则：以`env_`开头  



## 启用配置
#### 开发环境
```
./ly dev env_test  
./ly pro env_test
```  
启用不同的配置文件并开始编译  

#### 生产环境  
生产环境下，我们使用`pm2`来启动服务
```
pm2 start index.js --  env_test
```

## 配置文件说明
```.js
const config = {
  version: version,

  /*
   * 默认首页
   * dev开发 / pro生产模式时，默认打开的页面
   * 具体指定页面位置为 /public/src/pc/html 下
   */
  root: 'index',  // 可以任意指定 /public/src/pc/html/* 不用带扩展名，如 hello

  /*
   * nodejs 服务端端口
   */
  port: 8070,


  /*
   * 本地上传路径
   */
  upload: {
    root: './uploads',
  },

  /*
   * 允许editor编辑器上传图片
   * fkp-js的副编辑器采用百度ueditor
   */
  editorUploader: false,

  /*
   * 微信端配置文件
   */
  weixin: {
    token: 'weixin token name',
    appid: 'your weixin appid',
    appsecret: 'your weixin appsecret',
    encodingAESKey: ''
  },

  /*
   * api
   * 为了简化api的写法，统一管理 api 接口，返回json数组列表
   * 前端/node 端通用同一套api列表
   */
  apis:{
    apiip: "http://120.25.xxx.xxx",    //  api src 参考  根目录/pages/common/apilist.js
    port: ":8080/v1/",                 //  api src port 参考 根目录/pages/common/apilist.js
    domain: 'agzgz.com',
    mock: false   // numerical or false, numerical将启动 mock 数据
  },

  /*
   * static
   * 静态资源路径
   * node 端渲染时，模板引擎匹配的静态资源路径
   */
  static: {
  	dft:  path.join('./dist/'+version+'/'),
  	html: path.join('./dist/'+version+'/html'),
  	js:   path.join('./dist/'+version+'/js'),
  	css:  path.join('./dist/'+version+'/css'),
  	img:  path.join('./dist/'+version+'/images'),
    doc:  path.join(static_dir,'../fdocs'),
        dev: {
            dft:  path.join('./dist/'+version+'/dev'),
            html: path.join('./dist/'+version+'/dev/html'),
            js:   path.join('./dist/'+version+'/dev/js'),
            css:  path.join('./dist/'+version+'/dev/css'),
            img:  path.join('./dist/'+version+'/dev/images'),
            doc:  path.join(static_dir,'../fdocs'),
        }
	},

  /*
   * 第三方登陆
   * 配置自己的第三方登陆
   */
  auth: {
    github:{  //第三方github登陆
      clientID: 'github clientID',
      clientSecret: 'github clientSecret',
      callbackURL: 'http://www.agzgz.com/github/callback',
      successUrl: '/',
      userKey: 'githubuser',    //save this key to session
      headers: {"user-agent": "love_gz"}
    }
  },

  /*
   * 静态资源映射文件
   * 如果后端使用java/php的模板，将map文件交给后端映射路径
   * 将打包的js/css文件自动存储为JSON，node端render的时候
   * 会将静态文件匹配给同名html文件
   */
	mapJson:   path.join('./dist/'+version+'/map.json'),
	mapDevJson:   path.join('./dist/'+version+'/dev/map.json'),


  /*
   * markdown解析白名单
   * markdown扩展语法中的自定义变量，一般用于数据库存储
   * 匹配 `@@@` 内的内容
   * 白名单内容做为 json 传递到后端
   */
  markdownVariable: [
    'tags',
    'cats',
    'css',
    'js',
    'author',
    'desc',
    {'分类': 'cats'},   //支持中文 key
    {'作者': 'author'}
  ],

  db: {
    site_admin: { login: 'webkixi' },
    select: 'mongo',    //  false or 'mongo/mysql', mongo 采用 mongoose ORM
    requiredFolder: {   //  自动注册数据库时，会检测注册目录下是否包含control目录和model目录，目录名在此指定
      control: 'pages', //  control目录名/ control directory key
      model: 'models'   //  model目录名/   model directory key
    },
    mongo: {
      url: "mongodb://127.0.0.1:27017/fkp",
      options: {
        db: { native_parser: true },
        server: { poolSize: 3 },
        replset: { rs_name: 'myReplicaSetName' },
      },
      pageSize: 20
    },
  },

  route: {
    prefix: [
      '/deep3/level'
    ]
  }
}
```
