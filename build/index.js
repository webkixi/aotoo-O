import _ from 'lodash'
import * as gulpcss from './gulpcss'
import * as gulphtml from './gulphtml'
import * as gulp3ds from './gulp3ds'
const env = (process.env.NODE_ENV).toLowerCase();  // 'development' production
const margv = JSON.parse(process.env.margv)
const browserSync = require('browser-sync').create()
const reload  = browserSync.reload
const envConfig = (() => margv.config ? margv.config : undefined)()
const reDemo = /(.*\/test)/

  const fs   = require('fs')
      , path = require('path')
      , webpack = require('webpack')
      , WebpackDevServer = require('webpack-dev-server')
      , glob = require('glob')
      , gulp = require('gulp')
      , gutil = require('gulp-util')
      , $    = require('gulp-load-plugins')()
      , del  = require('del')

function buildStart(nm, opts){

  const configs  = require('../configs')(envConfig)
      , version  = configs.version
      , getEntry = require('./entry')
      , mapFile  = require('./mapfile')

  const DIST    = path.join( __dirname, '../dist/out', version, (env=='development' ? 'dev' : '') )
      , DLLDIST = path.join( __dirname, '../dist/out/', 'dll' )
      , CSSSRC  = path.join( __dirname, '../public/css')
      , JSSRC   = path.join( __dirname, '../public/js')
      , HTMLSRC = path.join( __dirname, '../public/html')
      , IMAGESSRC = path.join( __dirname, '../public/images')
      , SRC3DS  = path.join( __dirname, '../public/3ds')

  del.sync([ DIST ], { force: true })

  // 第三方库
  const treedsEnv = { dist: DIST }
  gulp3ds.js(SRC3DS, treedsEnv)
  gulp3ds.css(SRC3DS, treedsEnv)

  // css
  let _cssEntry = getEntry(CSSSRC, {type: 'css'})
  _cssEntry = _.merge(_cssEntry, { 'css/common': path.join(__dirname, '../common/css/index.styl') })  // 加入 common.css
  const _htmlEntry = getEntry(HTMLSRC, {type: 'html'})
  const _jsEntry = getEntry(JSSRC, {type: 'js'})
  
  // 生产环境剔除demo
  if (env == 'production') {
    Object.keys(_cssEntry).forEach(key => {
      if (reDemo.test(key)) delete _cssEntry[key]
    })

    Object.keys(_htmlEntry).forEach(key => {
      if (reDemo.test(key)) delete _htmlEntry[key]
    })

    Object.keys(_jsEntry).forEach( key => {
      if (reDemo.test(key)) delete _jsEntry[key]
    })
  }

  // 生成 css
  gulpcss.makeCss(_cssEntry, {
    src: CSSSRC,
    dist: DIST
  })

  // 生成 html
  gulphtml.makeHtml(_htmlEntry, {
    src: HTMLSRC,
    dist: DIST+'/html'
  })

  // 生成 js config
  let webpackConfig = require('./webpack.config').webpackConfig(_jsEntry, {
    dist: DIST,
    dlldist: DLLDIST
  })

  const dllConfig = require('./webpack.config').dllConfig({
    dist: DLLDIST
  })

  const mapoptions = {
    dist: DIST,
    imagessrc: IMAGESSRC,
    configs: configs,
    entry: {
      js: _jsEntry
    }
  }


  // js build or start webpack dev server
  function start(nm, opts){
    // webpackConfig.plugins.push(
    //   new webpack.DllReferencePlugin({
    //     manifest: require(path.join(DLLDIST, 'precommon-manifest.json'))
    //   })
    // )
    
    var compiler = webpack(webpackConfig)
    if (env == 'production') {
      compiler.run( (err, stats) => {
        if (err) throw new gutil.PluginError('[webpack]', err)
        mapFile(mapoptions, ()=>{
          process.exit()
        })
      })
    } 
    else {
      const Delay = {
        dev: [1200, 1300],
        fed: [1000, 3000]
      }
      
      let delay = Delay.fed
      if (nm && nm.emit) {
        delay = Delay.dev
      }

      // 生成mapfile.json
      let initRestartNodeServer = true
      compiler.plugin('done', function (stats) {
        mapFile(mapoptions, { delay: delay }, function (params) {
          if (initRestartNodeServer) {
            initRestartNodeServer = false
            if (nm && nm.emit) nm.emit('restart')
          }
        })
      })

      // opts.serviceType 用于启动webpack-dev-server的服务模式或者代理模式
      // opts.statics 静态文件存放的绝对路径
      opts.env = env
      const devServer = new WebpackDevServer( compiler, require('./webpack.devserver.config')(webpackConfig, opts))
      devServer.listen(configs.proxyPort, 'localhost', function (err, result) {
        if (err) console.log(err);
        console.log('Listening at http://localhost:'+configs.proxyPort);
      })
    }
  }


  function prepareDll(nm, opts={serviceType:{}}) {
    if (fs.existsSync(path.join(DLLDIST, 'precommon.js')) && !opts.serviceType.clean) {
      start(nm, opts)
    } else {
      del.sync([ DLLDIST ], { force: true })
      // 先编译 precommon.js
      webpack(dllConfig).run( (err, stats) => {
        if (err) throw new gutil.PluginError('[webpack]', err)
        start(nm, opts)
      })
    }
  }


  // ready go go go
  prepareDll(nm, opts)
}
module.exports = buildStart
