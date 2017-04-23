const ExtractTextPlugin = require('extract-text-webpack-plugin')
    , HtmlWebpackPlugin = require('html-webpack-plugin')
    , alias = require('./webpack.alias')
    , gutil = require('gulp-util')
    , webpack = require('webpack')
    , path = require('path')
    , BrowserSyncPlugin = require('browser-sync-webpack-plugin')
    , WriteMemoryFilePlugin = require('./plugins/writememoryfile-webpack-plugin')
    , Attachment2commonPlugin = require('./plugins/attachment2common-webpack-plugin')


let G = {
  entry: '',
  env: {},
  production: false
}

// dll common.dll.js
function dllConfig(env){
  const _dist = env.dist
  return {
    entry: {
      precommon: [path.join(__dirname, '../common/js/index.js')]
    },
    output: {
      path: _dist,
      filename: G.production ? "[name]__[hash:10].js" : "[name].js",
      // libraryTarget: 'var',
      library: '[name]_library'
    },
    plugins: [
      new webpack.DllPlugin({
        path: path.join(_dist, '[name]-manifest.json'),
        name: '[name]_library'
      }),
      new webpack.optimize.UglifyJsPlugin({
        exclude: /\.min\.js$/,
        mangle:true,
        compress: {
          drop_console: true,
          drop_debugger: true,
          unused: true,
          dead_code: true,
          warnings: false,
          screw_ie8: true
        }
      })
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

    devtool: G.production ? 'cheap-source-map' : 'cheap-module-eval-source-map',

    externals: {
      // "react" : "React"
    },

    module: {
      // noParse: /node_modules\/(jquey|moment|chart\.js)/,
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use:[{
            loader: "babel-loader?cacheDirectory",
            options: {
              presets:["react", "es2015", "stage-0", "stage-1", "stage-3"],
              plugins: [
                "transform-runtime",
                "add-module-exports",
                "transform-decorators-legacy",
                "transform-react-display-name"
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
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            publicPath: '/css/',
            use: ['css-loader?modules', 'stylus-loader']
          })
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

  return new BrowserSyncPlugin(
    {
      proxy: 'http://localhost:3000/',
      files: [dist.dest+ '/**'],
      logFileChanges: false,
      notify: true,
      injectChanges: true
    }
  )
}

// 配置webpack-dev-server的hotreload配置
function configurationDevEntry(cfg){
  if (!G.production) {
    var entry = cfg.entry
    var hotSverConfig = [
      'webpack-dev-server/client?http://localhost:3000/',
      'webpack/hot/only-dev-server',
    ]
    for (var item in entry) {
      var _tmp = hotSverConfig.concat(entry[item])
      cfg.entry[item] = _tmp
    }
  }
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
    new webpack.ProvidePlugin({ $aot: 'aotu' }),
    new Attachment2commonPlugin( path.join(env.dlldist, '/precommon.js') )
  ]

  // devlope plugins
  const devPlugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new WriteMemoryFilePlugin(),
    BrowserSync(env)
  ]

  // production plugins
  const proPlugins = [
    new webpack.optimize.UglifyJsPlugin({
      exclude: /\.min\.js$/,
      mangle:true,
      compress: {
        drop_console: true,
        drop_debugger: true,
        unused: true,
        dead_code: true,
        warnings: false,
        screw_ie8: true
      }
    }),
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
