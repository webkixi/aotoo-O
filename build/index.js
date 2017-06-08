import _ from 'lodash'
import * as gulpcss from './gulpcss'
import * as gulphtml from './gulphtml'
import * as gulp3ds from './gulp3ds'
const env = (process.env.NODE_ENV).toLowerCase();  // 'development' production
const browserSync = require('browser-sync').create()
const reload  = browserSync.reload

  const fs   = require('fs')
      , path = require('path')
      , webpack = require('webpack')
      , WebpackDevServer = require('webpack-dev-server')
      , glob = require('glob')
      , gulp = require('gulp')
      , gutil = require('gulp-util')
      , $    = require('gulp-load-plugins')()
      , del  = require('del')

function buildStart(opts){

  const configs  = require('../configs')()
      , version  = configs.version
      , getEntry = require('./entry')
      , mapFile  = require('./mapfile')

  const DIST    = path.join( __dirname, '../dist/out', version, (env=='development' ? 'dev' : '') )
      , DLLDIST = path.join( __dirname, '../dist/out/', 'dll' )
      , CSSSRC  = path.join( __dirname, '../public/css')
      , JSSRC   = path.join( __dirname, '../public/js')
      , HTMLSRC = path.join( __dirname, '../public/html')
      , SRC3DS  = path.join( __dirname, '../public/3ds')



  del.sync([ DIST ], { force: true })

  // css
  let _cssEntry = getEntry(CSSSRC, {type: 'css'})

  // 加入 common.css
  _cssEntry = _.merge(_cssEntry, {'css/common': path.join(__dirname, '../common/css/index.styl')})

  // 生成 css
  gulpcss.makeCss(_cssEntry, {
    src: CSSSRC,
    dist: DIST
  })



  // 第三方库
  const treedsEnv = {dist: DIST}
  gulp3ds.js(SRC3DS, treedsEnv)
  gulp3ds.css(SRC3DS, treedsEnv)



  // html
  const _htmlEntry = getEntry(HTMLSRC, {type: 'html'})
  gulphtml.makeHtml(_htmlEntry, {
    src: HTMLSRC,
    dist: DIST+'/html'
  })



  // js config
  const _jsEntry = getEntry(JSSRC, {type: 'js'})
  let webpackConfig = require('./webpack.config').webpackConfig(_jsEntry, {
    dist: DIST,
    dlldist: DLLDIST
  })

  const dllConfig = require('./webpack.config').dllConfig({
    dist: DLLDIST
  })

  const mapoptions = {
    dist: DIST,
    configs: configs,
    entry: {
      js: _jsEntry
    }
  }


  // js build or start webpack dev server
  function start(nm){
    webpackConfig.plugins.push(
      new webpack.DllReferencePlugin({
        manifest: require(path.join(DLLDIST, 'precommon-manifest.json'))
      })
    )
    
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
      mapFile(mapoptions)
      const devServer = new WebpackDevServer( compiler, require('./webpack.devserver.config')(webpackConfig))
      devServer.listen(8300, 'localhost', function (err, result) {
        if (err) console.log(err);
        setTimeout(function() {
          nm.emit('restart')
          setTimeout(function() {
            browserSync.init({
              proxy: 'http://localhost:8300/',
              files: [DIST+ '/**'],
              logFileChanges: false,
              notify: true,
              injectChanges: true
            })
          }, 5000);
        }, 15000);
        console.log('Listening at http://localhost:8300/');
      })
    }
  }


  function prepareDll(nm) {
    if (fs.existsSync(path.join(DLLDIST, 'precommon.js'))) {
      start(nm)
    } else {
      // 先编译 precommon.js
      webpack(dllConfig).run( (err, stats) => {
        if (err) throw new gutil.PluginError('[webpack]', err)
        start(nm)
      })
    }
  }


  // ready go go go
  prepareDll(opts)
}
module.exports = buildStart
