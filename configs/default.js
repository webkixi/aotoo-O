const merge = require('lodash').merge
const path = require('path');
const fs = require('fs');
const static_dir = '../public'
const version = require('../package.json').version

const ROOT = path.join(__dirname, '../')
const SRC = path.join(__dirname, '../public/')
const DISTOUT = path.join(__dirname, '../dist/out/')

const config = {
  version: version,

  /*
    * 默认首页
    * dev开发 / pro生产模式时，默认打开的页面
    * 具体指定页面位置为 /public/src/pc/html 下
    */
  root: 'hello',

  /*
    * nodejs 服务端端口
    */
  port: 8070,


  /*
    * 本地上传路径
    */
  upload: {
    root: '../dist/uploads',
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
    dft:  path.join(DISTOUT, version+'/'),
    html: path.join(DISTOUT, version+'/html'),
    js:   path.join(DISTOUT, version+'/js'),
    css:  path.join(DISTOUT, version+'/css'),
    img:  path.join(DISTOUT, 'images'),
    doc:  path.join(ROOT, 'fdocs'),
      dev: {
        html: path.join(DISTOUT, version+'/dev/html'),
        js:   path.join(DISTOUT, version+'/dev/js'),
        dft:  path.join(DISTOUT, version+'/dev'),
        css:  path.join(DISTOUT, version+'/dev/css'),
        img:  path.join(DISTOUT, 'images'),
        doc:  path.join(ROOT, 'fdocs'),
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

function _config(target){
  if (typeof target == 'string' && fs.existsSync('./'+target+'.js')) {
    return merge(config, require('./configs/'+target+'.js'))
  }
  return config;
}

module.exports = _config
