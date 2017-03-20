var path = require('path')
var webpack = require('webpack')
var glob = require('glob')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var DIST = path.join(__dirname, '../dist/out')
var JSSRC = path.join(__dirname, '../public/js')
var CSSSRC = path.join(__dirname, '../public/css')
var HTMLSRC = '../public/html'

// function getKey(item, obj, dir){
//   if (!obj.dir) {
//     return '~root~'+item.replace(obj.ext, '')
//   } else {
//     const xxx = dir.replace(/\./g, '\\.').replace(/\//g, '\\/')
//     const partten = eval('/'+xxx+'[\\/]?/ig')
//     const _dir = obj.dir.replace(partten, '') 
//     if (_dir.indexOf(path.sep)>-1) {
//       return _dir.replace(/\//g, '-')
//     } else {
//       if (_dir) return _dir
//       else {
//         return obj.name
//       }
//     }
//   }
// }

// function getEntry(dir, opts) {
//   var entry = {}
//   var entryAry = []
//   glob.sync(dir+'/**/*').forEach(function(item){
//     var obj = path.parse(item)
//     if (item.indexOf('_')!=0 && obj.ext) {
//       if (obj.name && obj.name.indexOf('_')!=0){
//         const key = getKey(item, obj, dir)
//         if (opts.type && opts.type == 'html') {
//           entryAry.push(item)
//         } else {
//           entry[key] = (entry[key]||[]).concat(item)
//         }
//       }
//     }
//   })
//   if (opts.type == 'html') return entryAry
//   return entry
// };

// const htmlEntry = getEntry(HTMLSRC, {type: 'html'})
// console.log(htmlEntry);

module.exports = {
  entry: {
    index: [
      // 'webpack-dev-server/client?http://localhost:3000/',
      // 'webpack/hot/only-dev-server',
      "../public/js/index.js"
    ]
  },
  output: {
    path: DIST+'/js/',
    filename: "[name].js",
    publicPath: '/dist/out/'
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
      // {
      //   test: /(\.ejs|\.html)$/,
      //   use:[{
      //     loader: "ejs-loader",
      //     options: { variable: 'data'}
      //   }]
      // },
      // { 
      //   test: /\.styl$/,
      //   loader: ExtractTextPlugin.extract('style-loader!css-loader!stylus-loader'),
      // },
    ]
  },
  resolve:{
    extensions:['.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}