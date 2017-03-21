var fs = require('fs')
var path = require('path')
var webpack = require('webpack')
var glob = require('glob')
var gulp = require('gulp')
$ = require('gulp-load-plugins')()
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin');

var getEntry = require('./build/entry')

var DIST = path.join(__dirname, './dist/out')
var CSSSRC = './public/css'
var JSSRC = './public/js'
var HTMLSRC = './public/html'

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

var webpackConfig = {
  entry: {
    // index: [
    //   // 'webpack-dev-server/client?http://localhost:3000/',
    //   // 'webpack/hot/only-dev-server',
    //   "./public/js/index.js"
    // ]
  },

  output: {
    path: DIST,
    filename: "[name].js",
    publicPath: '/dist/out/js/'
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
        loader: ExtractTextPlugin.extract('style-loader!css-loader!stylus-loader'),
      }
    ]
  },
  resolve:{
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
    new webpack.HotModuleReplacementPlugin()
  ]
}

// html
var srcs = []
var targets = []
const _htmlEntry = getEntry(HTMLSRC, {type: 'html'})
for (var file in _htmlEntry) {
  srcs.push(_htmlEntry[file])
  targets.push(file+'.html')
}
gulp.src(srcs, { base: HTMLSRC }) .pipe($.ejs()) .pipe(gulp.dest(DIST+'/html'))


// css
const _cssEntry = getEntry(CSSSRC, {type: 'css'})
for (var file in _cssEntry) {
  var srcFiles = _cssEntry[file]
  var targetFileName = file+'.css'
  productCss(srcFiles, targetFileName)
}

function productCss(src, target){
  gulp.src(src, { base: CSSSRC }) 
  .pipe($.stylus())
  .pipe($.concatCss(target))
  .pipe(gulp.dest(DIST))
}


// // js
// const _jsEntry = getEntry(JSSRC, {type: 'js'})
// webpackConfig.entry = _jsEntry


module.exports = webpackConfig