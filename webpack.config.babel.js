import * as gulpcss from './build/gulpcss'
import * as gulphtml from './build/gulphtml'

const fs = require('fs')
      , path = require('path')
      , webpack = require('webpack')
      , glob = require('glob')
      , gulp = require('gulp')
      , $ = require('gulp-load-plugins')()
      , ExtractTextPlugin = require('extract-text-webpack-plugin')
      , HtmlWebpackPlugin = require('html-webpack-plugin');

const configs = require('./configs/default')()
      , version = configs.version
      , getEntry = require('./build/entry')
      , alias = require('./build/webpack.alias')

const env = (process.env.NODE_ENV || 'development').toLowerCase();  // 'development' production

const DIST = path.join(__dirname, './dist/out', version, (env=='development' ? 'dev' : '') )
      , CSSSRC = './public/css'
      , JSSRC = './public/js'
      , HTMLSRC = './public/html'

const adapter = {
  html: function(data){
    let htmls = []
    for (var key in data) {
      htmls.push(new HtmlWebpackPlugin({
        filename: key+'.html',
        template: data[key],
        inject: false
      }))
    }
    return htmls
  }
}

let webpackConfig = {
  entry: {},

  output: {
    path: DIST,
    filename: "[name].js",
    publicPath: '/dist/out/js/',
    chunkFilename: '[name]_[id].js',
    libraryTarget:'var'
  },

  externals: {
    "react" : "React"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use:[{
          loader: "babel-loader",
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
  resolve:{
    alias: alias,
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
  plugins: [
    new ExtractTextPlugin({
      filename:  (getPath) => {
        return getPath('css/[name]_dy.css').replace('css/js', 'css');
      },
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}

// html
let srcs = []
let targets = []
const _htmlEntry = getEntry(HTMLSRC, {type: 'html'})
gulphtml.makeHtml(_htmlEntry, {
  src: HTMLSRC,
  dist: DIST+'/html'
})


// css
const _cssEntry = getEntry(CSSSRC, {type: 'css'})
gulpcss.makeCss(_cssEntry, {
  src: CSSSRC,
  dist: DIST
})


// js
const _jsEntry = getEntry(JSSRC, {type: 'js'})
webpackConfig.entry = _jsEntry


module.exports = webpackConfig


// 生产环境
// plugins: [
//   new webpack.optimize.OccurrenceOrderPlugin(),
//   new webpack.optimize.AggressiveMergingPlugin(),
//   new webpack.optimize.DedupePlugin(),
//   new webpack.optimize.UglifyJsPlugin({
//     compress: {
//       unused: true,
//       dead_code: true,
//       warnings: false,
//       screw_ie8: true
//     }
//   }),
//   new webpack.NoErrorsPlugin(),
//   new webpack.DefinePlugin({
//     'process.env.NODE_ENV': JSON.stringify('production'),
//     '__DEV__': false
//   }),
//   new webpack.optimize.CommonsChunkPlugin({
//     minChunks: 2,
//     name: 'vendor'
//   })
// ]