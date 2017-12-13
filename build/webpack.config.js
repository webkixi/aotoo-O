const ExtractTextPlugin = require('extract-text-webpack-plugin')
    , HtmlWebpackPlugin = require('html-webpack-plugin')
    , alias = require('./webpack.alias')
    , gutil = require('gulp-util')
    , webpack = require('webpack')
    , path = require('path')
    , BrowserSyncPlugin = require('browser-sync-webpack-plugin')
    , WriteMemoryFilePlugin = require('./plugins/writememoryfile-webpack-plugin')
    , Attachment2commonPlugin = require('./plugins/attachment2common-webpack-plugin')
    , appConfigs = require('../configs/index')()
    , myPort = appConfigs.port
    , margv = JSON.parse(process.env.margv)
    


let G = {
  entry: '',
  env: {},
  production: false
}

const UglifyJsPluginDllConfig = {
  exclude: /\.min\.js$/,
  mangle:false,
  sourceMap: false,
  compress: {
    drop_console: true,
    drop_debugger: true,
    unused: true,
    dead_code: true,
    warnings: false,
    screw_ie8: true
  }
}

const UglifyJsPluginConfig = {
  exclude: /\.min\.js$/,
  mangle:false,
  compress: {
    drop_console: true,
    drop_debugger: true,
    unused: true,
    dead_code: true,
    warnings: false,
    screw_ie8: true
  }
}

// dll common.dll.js
function dllConfig(env){
  const _dist = env.dist
  return {
    entry: {
      precommon: [
        'babel-polyfill',
        path.join(__dirname, '../common/js/index.js')
      ]
    },
    devtool: G.production ? 'cheap-module-source-map' : 'cheap-module-source-map',
    output: {
      path: _dist,
      filename: G.production ? "[name].js" : "[name].js",
      libraryTarget: 'var',
      // library: '[name]_library'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use:[{
            loader: "babel-loader?cacheDirectory",
            options: {
              presets:["react", "es2015", "stage-0"],
              plugins: [
                // 'react-hot-loader/babel',
                [
                  "transform-runtime", {
                    "helpers": false, // defaults to true; v6.12.0 (2016-07-27) 新增;
                    "polyfill": true, // defaults to true
                    "regenerator": true, // defaults to true
                    // v6.15.0 (2016-08-31) 新增
                    // defaults to "babel-runtime"
                    // 可以这样配置
                    // moduleName: path.dirname(require.resolve('babel-runtime/package'))
                    // "moduleName": "babel-runtime"
                  }
                ],
                // "add-module-exports",
                // "transform-decorators-legacy",
                // "transform-react-display-name",
                // "typecheck"
              ]
            }
          }]
        },
        {
          test: /\.styl$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            publicPath: '/css/',
            use: ['css-loader?modules', 'stylus-loader']
          })
        }
      ]
    },
    resolve:{
      extensions:[
        ".js",
        ".json",
        ".css",
        '.styl',
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        '__DEV__': false
      }),
      // new webpack.DllPlugin({
      //   path: path.join(_dist, '[name]-manifest.json'),
      //   name: '[name]_library'
      // }),
      // new webpack.optimize.UglifyJsPlugin(UglifyJsPluginDllConfig)
      new webpack.optimize.UglifyJsPlugin()
    ]
  }
}

// webpack config
function _webpackConfig(_entry, env){
  const _dist = env.dist
  return {
    entry: _entry,
    // cache: true,
    output: {
      path: _dist,
      publicPath: '/js/',
      filename: G.production ? "[name]__[hash:10].js" : "[name].js",
      chunkFilename: G.production ? '[id]_[name]_[hash:10].js' : '[name]_[id].js',
      libraryTarget:'var'
    },
    watch: G.production ? false : true,
    devtool: G.production ? 'cheap-module-source-map' : margv.eval ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
    module: {
      // noParse: /node_modules\/(jquey|moment|chart\.js)/,
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use:[{
            loader: "babel-loader?cacheDirectory",
            options: {
              // presets:["react", "es2015", "stage-0", "stage-1", "stage-3"],
              presets:["react", "es2015", "stage-0"],
              plugins: [
                [
                  "transform-runtime", {
                    "helpers": false, // defaults to true; v6.12.0 (2016-07-27) 新增;
                    "polyfill": true, // defaults to true
                    "regenerator": true, // defaults to true
                    // v6.15.0 (2016-08-31) 新增
                    // defaults to "babel-runtime"
                    // 可以这样配置
                    // moduleName: path.dirname(require.resolve('babel-runtime/package'))
                    // "moduleName": "babel-runtime"
                  }
                ],
                // "add-module-exports",
                // "transform-decorators-legacy",
                // "transform-react-display-name",
                // "typecheck"
              ]
            }
          }]
        },
        {
          test: /(\.ejs|\.html|\.hbs)$/,
          use:[{
            loader: "ejs-loader",
            options: { variable: 'data'}
          }]
        },
        {
          test: /\.styl$/,
          use: ExtractTextPlugin.extract({           // 适合协作开发
            fallback: "style-loader",
            publicPath: '/css/',
            use: ['css-loader', 'stylus-loader']
          })
          // use: ['css-loader?modules', 'stylus-loader']    // 模块化，适合组件开发
          // use: ['style-loader', 'css-loader', 'stylus-loader']  // 插入页面内部，适合组件方式，不适合模块式协作开发
        },
        {
          test: /\.stylus$/,
          use: ['style-loader', 'css-loader', 'stylus-loader']  // 插入页面内部，适合组件方式，不适合模块式协作开发
        }
      ]
    },
    performance: {
      "hints": false
    },
    resolve:{
      alias: alias,
      // mainFields: ['jsnext:main','main'],
      extensions:[
        ".js",
        ".jsx",
        ".json",
        '.html',
        '.ejs',
        '.pug',
        ".css",
        '.styl',
        '.less',
        '.hbs'
      ]
    },
    plugins: []
  }
}

// BrowserSync
function BrowserSync(env){
  const dist = {
    dest: env.dist,
    html: path.join(env.dist, 'html'),
    css: path.join(env.dist, 'css')
  }

  return new BrowserSyncPlugin({
    reloadDelay: 1000,
    proxy: {
      target: 'http://localhost:8300',
      ws: true
    },
    files: [dist.dest+ '/**'],
    logFileChanges: false,
    notify: true,
    injectChanges: true,
    host: 'localhost',
    port: 3000
  }, 
  // plugin options 
    {
      // prevent BrowserSync from reloading the page 
      // and let Webpack Dev Server take care of this 
      reload: false
    })
}

// 配置webpack-dev-server的hotreload配置
function configurationDevEntry(cfg){
  // if (!G.production) {
  //   var entry = cfg.entry
  //   var hotSverConfig = [
  //     // 'babel-polyfill',
  //     'react-hot-loader/patch',
  //     'webpack-dev-server/client?http://localhost:8300',
  //     'webpack/hot/only-dev-server',
  //   ]
  //   for (var item in entry) {
  //     var _tmp = hotSverConfig.concat(entry[item])
  //     cfg.entry[item] = _tmp
  //   }
  // }
  return cfg
}

// config webpack plugins
function configurationPlugins(cfg, env){

  // common plugins
  const commPlugins = [
    new ExtractTextPlugin({
      filename:  (getPath) => {
        return G.production
        ? getPath('css/[name]_dy_[hash:10].css').replace('css/js', 'css')
        : getPath('css/[name]_dy.css').replace('css/js', 'css');
      },
      allChunks: true
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      // name: 'js/common'
      name: 'js/common',
      filename: G.production ? "[name]__[hash:10].js" : "[name].js",
      minChunks: 2, //Infinity
    }),
    // new webpack.ProvidePlugin({ Aotoo: 'aotoo' }),
    new Attachment2commonPlugin( path.join(env.dlldist, '/precommon.js') )
  ]

  // devlope plugins
  const devPlugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': true
    }),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
    new WriteMemoryFilePlugin(),
    BrowserSync(env)
  ]

  // production plugins
  const proPlugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__DEV__': false
    }),
    // new webpack.optimize.UglifyJsPlugin(UglifyJsPluginConfig)
    new webpack.optimize.UglifyJsPlugin()
  ]

  const webpackPlugins = G.production ? [...commPlugins, ...proPlugins] : [...commPlugins, ...devPlugins]
  cfg.plugins = webpackPlugins
  return cfg
}

// 输出webpack配置文件
function webpackConfig(_entry, env){
  G.entry = _entry
  G.env = env
  G.production = false
  if (process.env.NODE_ENV == 'production') {
    G.production = true
  }

  const _wpConfig = _webpackConfig(_entry, env)
  const wpConfig = configurationDevEntry(_wpConfig)
  return configurationPlugins(wpConfig, env)
}

module.exports = {
  dllConfig: dllConfig,
  webpackConfig: webpackConfig
}
