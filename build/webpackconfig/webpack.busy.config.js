const ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  alias = require('../webpack.alias'),
  gutil = require('gulp-util'),
  webpack = require('webpack'),
  path = require('path'),
  BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
  WriteMemoryFilePlugin = require('../plugins/writememoryfile-webpack-plugin'),
  Attachment2commonPlugin = require('../plugins/attachment2common-webpack-plugin'),
  replacePlugin = require('../plugins/replace-webpack-plugin'),
  margv = JSON.parse(process.env.margv),
  HappyPack = require('happypack'),
  os = require('os')
  // 构造一个线程池
  ,
  happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
  })

const wp_extensions = [".js", ".jsx", ".json", '.html', '.ejs', '.pug', ".css", '.styl', '.less', '.hbs']

const UglifyJsPluginConfig = {
  exclude: /\.min\.js$/,
  mangle: false,
  compress: {
    drop_console: true,
    drop_debugger: true,
    unused: true,
    dead_code: true,
    warnings: false,
    screw_ie8: true
  }
}

// 配置webpack-dev-server的hotreload配置
function configurationDevEntry(entryfiles) {
  return entryfiles
}

// BrowserSync
function BrowserSync(env, appConfigs) {
  const dist = {
    dest: env.dist,
    html: path.join(env.dist, 'html'),
    css: path.join(env.dist, 'css')
  }

  return new BrowserSyncPlugin({
      reloadDelay: 1000,
      proxy: {
        target: 'http://localhost:' + appConfigs.proxyPort,
        ws: true
      },
      files: [dist.dest + '/**/*', !dist.dest + '/js/**/*'],
      logFileChanges: false,
      notify: false,
      injectChanges: true,
      host: 'localhost',
      port: 3000
    },
    // plugin options 
    {
      // prevent BrowserSync from reloading the page 
      // and let Webpack Dev Server take care of this 
      reload: true
    })
}

function configurationPlugins(env, G, appConfigs) {
  const commPlugins = [
    new ExtractTextPlugin({
      filename: (getPath) => {
        return G.production 
          ? getPath('css/[name]_dy_[hash:10].css').replace('css/js', 'css') 
          : getPath('css/[name]_dy.css').replace('css/js', 'css');
      },
      allChunks: true
    }),
    new HappyPack({
      id: "babel",
      verbose: true,
      loaders: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [
            "react", "es2015", "stage-0"
          ],
          plugins: [
            [
              "add-module-exports",
              "transform-runtime", {
                "helpers": false, // defaults to true; v6.12.0 (2016-07-27) 新增;
                "polyfill": true, // defaults to true
                "regenerator": true, // defaults to true
              }
            ],
          ]
        }
      }],
      threadPool: happyThreadPool
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'js/common',
      filename: G.production ? "[name]__[hash:10].js" : "[name].js",
      minChunks: 2, //Infinity
    }),
    new Attachment2commonPlugin(path.join(env.dlldist, '/precommon.js'))
  ]

  const devPlugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': true
    }),
    new webpack.NamedModulesPlugin(),
    new WriteMemoryFilePlugin(),
    BrowserSync(env, appConfigs)
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
  ]

  // production plugins
  const proPlugins = [
    new replacePlugin([
      [/\/images\//ig, '//img.7atour.com/images']
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__DEV__': false
    }),
    new webpack.optimize.UglifyJsPlugin()
    // new webpack.optimize.UglifyJsPlugin(UglifyJsPluginConfig)
  ]

  const webpackPlugins = G.production ? [...commPlugins, ...proPlugins] : [...commPlugins, ...devPlugins]
  return webpackPlugins
  // cfg.plugins = webpackPlugins
  // return cfg
}

module.exports = function (entryFiles, env, G, appConfigs) {
  const _dist = env.dist
  return {
    // cache: true,
    entry: configurationDevEntry(entryFiles),
    output: {
      path: _dist,
      publicPath: '/js/',
      filename: G.production ? "[name]__[hash:10].js" : "[name].js",
      chunkFilename: G.production ? '[id]_[name]_[hash:10].js' : '[name]_[id].js',
      libraryTarget: 'var'
    },
    watch: G.production ? false : true,
    devtool: G.production ? 'cheap-module-source-map' : margv.eval ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
    module: {
      // noParse: /node_modules\/(jquey|moment|chart\.js)/,
      rules: [{
          test: /\.js$/,
          use: [{
            loader: 'happypack/loader',
            options: { id: 'babel' }
          }],
          exclude: [
            path.resolve(__dirname, "../../node_modules")
          ],
          // test: /\.js$/,
          // exclude: /node_modules/,
          // use:[{
          //   loader: "babel-loader?cacheDirectory",
          //   options: {
          //     // presets:["react", "es2015", "stage-0", "stage-1", "stage-3"],
          //     presets:["react", "es2015", "stage-0"],
          //     plugins: [
          //       [
          //         "transform-runtime", {
          //           "helpers": false, // defaults to true; v6.12.0 (2016-07-27) 新增;
          //           "polyfill": true, // defaults to true
          //           "regenerator": true, // defaults to true
          //           // v6.15.0 (2016-08-31) 新增
          //           // defaults to "babel-runtime"
          //           // 可以这样配置
          //           // moduleName: path.dirname(require.resolve('babel-runtime/package'))
          //           // "moduleName": "babel-runtime"
          //         }
          //       ],
          //       // "add-module-exports",
          //       // "transform-decorators-legacy",
          //       // "transform-react-display-name",
          //       // "typecheck"
          //     ]
          //   }
          // }]
        },
        {
          test: /(\.ejs|\.html|\.hbs)$/,
          use: [{
            loader: "ejs-loader",
            options: { variable: 'data' }
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
    resolve: {
      alias: alias,
      extensions: wp_extensions
    },
    plugins: configurationPlugins(env, G, appConfigs)
  }
}