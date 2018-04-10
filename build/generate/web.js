import _ from 'lodash'
import * as gulpcss from '../gulpcss'
import * as gulphtml from '../gulphtml'
import * as gulp3ds from '../gulp3ds'

const fs = require('fs')
  , path = require('path')
  , webpack = require('webpack')
  , WebpackDevServer = require('webpack-dev-server')
  , gutil = require('gulp-util')
  , del = require('del')
  , wpConfig = require('../webpack.config')
  , wpDevConfig = require('../webpack.devserver.config')

  , mapFile = require('../mapfile')


export default function(nm, cmd_args, com_params) {
  const {
    env,
    configs,
    
    DIST,
    DLLDIST,
    CSSSRC,
    JSSRC,
    HTMLSRC,
    IMAGESSRC,
    SRC3DS,
    _cssEntry,
    _jsEntry,
    _htmlEntry
  } = com_params

  // 第三方库
  const threedsEnv = { dist: DIST }
  gulp3ds.js(SRC3DS, threedsEnv)
  gulp3ds.css(SRC3DS, threedsEnv)

  // 生成 css
  gulpcss.makeCss(_cssEntry, {
    src: CSSSRC,
    dist: DIST
  })

  // 生成 html
  gulphtml.makeHtml(_htmlEntry, {
    src: HTMLSRC,
    dist: DIST + '/html'
  })

  // 生成 js config
  let webpackConfig = wpConfig.webpackConfig(_jsEntry, {
    dist: DIST,
    dlldist: DLLDIST
  })

  const dllConfig = wpConfig.dllConfig({
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
  function start(nm, opts) {

    /*
     * webpack dll config
     * 
     webpackConfig.plugins.push(
       new webpack.DllReferencePlugin({
         manifest: require(path.join(DLLDIST, 'precommon-manifest.json'))
       })
     )
    */

    var compiler = webpack(webpackConfig)
    if (env == 'production') {
      compiler.run((err, stats) => {
        if (err) throw new gutil.PluginError('[webpack]', err)
        mapFile(mapoptions, () => process.exit() )
      })
    } else {

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
      const devServer = new WebpackDevServer(compiler, wpDevConfig(webpackConfig, opts))
      devServer.listen(configs.proxyPort, 'localhost', function (err, result) {
        if (err) console.log(err);
        console.log('Listening at http://localhost:' + configs.proxyPort);
      })
    }
  }
  
  function prepareDll(nm, opts = { serviceType: {} }) {
    if (fs.existsSync(path.join(DLLDIST, 'precommon.js')) && !opts.serviceType.clean) {
      start(nm, opts)
    } else {
      del.sync([DLLDIST], { force: true })
      // 先编译 precommon.js
      webpack(dllConfig).run((err, stats) => {
        if (err) throw new gutil.PluginError('[webpack]', err)
        start(nm, opts)
      })
    }
  }

  // ready go go go
  prepareDll(nm, cmd_args)
}