const ExtractTextPlugin = require('extract-text-webpack-plugin')
  , HtmlWebpackPlugin = require('html-webpack-plugin')
  , alias = require('../webpack.alias')
  , gutil = require('gulp-util')
  , webpack = require('webpack')
  , path = require('path')
  , BrowserSyncPlugin = require('browser-sync-webpack-plugin')
  , WriteMemoryFilePlugin = require('../plugins/writememoryfile-webpack-plugin')
  , Attachment2commonPlugin = require('../plugins/attachment2common-webpack-plugin')
  , replacePlugin = require('../plugins/replace-webpack-plugin')
  , margv = JSON.parse(process.env.margv)
  , HappyPack = require('happypack')
  , os = require('os')
  // 构造一个线程池
  , happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })


const UglifyJsPluginDllConfig = {
  exclude: /\.min\.js$/,
  mangle: false,
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

function envPlugins(G, params) {
  return G.production ? params.concat(new webpack.optimize.UglifyJsPlugin()) : params
}

module.exports = function(env, G, appConfigs) {
  const _dist = env.dist
  return {
    entry: {
      precommon: [
        'babel-polyfill',
        path.join(__dirname, '../../common/js/index.js')
      ]
    },
    devtool: G.production ? 'cheap-module-source-map' : 'cheap-module-source-map',
    output: {
      path: _dist,
      filename: G.production ? "[name].js" : "[name].js",
      libraryTarget: 'var',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [{
            loader: 'happypack/loader',
            options: { id: 'babel' }
          }],
          exclude: [
            path.resolve(__dirname, "../../node_modules")
          ],
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
    resolve: {
      alias: alias,
      extensions: [
        ".js",
        ".json",
        ".css",
        '.styl',
      ]
    },
    plugins: envPlugins(G, [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': G.production ? JSON.stringify('production') : JSON.stringify('development'),
        '__DEV__': false
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
      // new webpack.DllPlugin({
      //   path: path.join(_dist, '[name]-manifest.json'),
      //   name: '[name]_library'
      // }),
      // new webpack.optimize.UglifyJsPlugin(UglifyJsPluginDllConfig)
      // new webpack.optimize.UglifyJsPlugin()
    ])
  }
}