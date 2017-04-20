const ExtractTextPlugin = require('extract-text-webpack-plugin')
      , HtmlWebpackPlugin = require('html-webpack-plugin')
      , alias = require('./webpack.alias')
      , webpack = require('webpack')
      , path = require('path')
      , BrowserSyncPlugin = require('browser-sync-webpack-plugin')

let G = {
  entry: '',
  env: {},
  production: false
}

function _webpackConfig(_entry, env){
  const _dist = env.dist
  return {
    entry: _entry,
    output: {
      path: _dist,
      filename: G.production ? "[name]__[hash:10].js" : "[name].js",
      publicPath: '/dist/out/js/',
      chunkFilename: G.production ? '[id]_[name]_[hash:10].js' : '[name]_[id].js',
      libraryTarget:'var'
    },

    devtool: G.production ? 'cheap-source-map' : 'cheap-module-eval-source-map',

    externals: {
      "react" : "React"
    },

    module: {
      // noParse: /node_modules\/(jquey|moment|chart\.js)/,
      rules: [
        {
          test: /\.js$/,
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
          test: /(\.ejs|\.html)$/,
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

function BrowserSync(env){
  const dist = {
    dest: env.dist,
    html: path.join(env.dist, 'html'),
    css: path.join(env.dist, 'css')
  }
  
  return new BrowserSyncPlugin(
    {
      server: {
        baseDir: [ dist.html, dist.css],
        index: ["index.html"]
      },
      files: [dist.dest+ '/**'],
      logFileChanges: false,
      notify: false,
      injectChanges: true
    },
    { 
      reload: true 
    }
  )
}

// 配置webpack插件
function configurationPlugins(cfg, env){
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
      minChunks: 2,
      name: 'js/common'
    })
  ]

  // devlope envirement plugins
  const devPlugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': true
    }),
    new webpack.HotModuleReplacementPlugin(),
    BrowserSync(env)
  ]

  // production envirement plugins
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
  return configurationPlugins(_wpConfig, env)
}


module.exports = webpackConfig
