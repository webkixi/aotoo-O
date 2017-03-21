var fs = require('fs')
var path = require('path')
var webpack = require('webpack')
var glob = require('glob')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin');

var DIST = path.join(__dirname, './dist/out')
var CSSSRC = path.join(__dirname, './public/css')
var JSSRC = './public/js'
var HTMLSRC = './public/html'


const adapter = {
  html: function(data){
    let htmls = []
    for (var key in data) {
      htmls.push(new HtmlWebpackPlugin({
        filename: key,
        template: data[key],
        // inject: false
      }))
    }
    return htmls
  }
}

function getKey(item, obj, dir, opts){
  const _root = path.parse(dir)
  const root = path.sep + _root.name
  if (opts.type == 'html') dir = dir.replace(root, '')

  if (!obj.dir) {
    return '~root~'+item.replace(obj.ext, '')
  } else {

    const xxx = dir.replace(/\./g, '\\.').replace(/\//g, '\\/')  // windows不兼容
    const partten = eval('/'+xxx+'[\\/]?/ig')
    const _dir = obj.dir.replace(partten, '') 

    if (_dir.indexOf(path.sep)>-1) {
      return _dir.replace(/\//g, '-')
    } else {
      if (_dir) return _dir
      else {
        return ''
      }
    }
  }
}

function getEntry(dir, opts) {
  var entry = {}
  var entryAry = []
  if (!fs.existsSync(dir)) return;
  const stat = fs.statSync(dir)
  if (!stat.isDirectory()) return

  const _partten = /\/[_](\w)+/g;   // ?? 不兼容windows
  glob.sync(dir+'/**/*').forEach(function(item){
    
    if (!_partten.test(item)){
    console.log(item);
    console.log(_partten.test(item));
      var obj = path.parse(item)
      if (obj.ext) {
        if (obj.name){
          let _key
          let key = getKey(item, obj, dir, opts)
          if (opts.type && opts.type == 'html') {
            key = key.replace(/\-/g, path.sep)
            if (key) _key = key+'/'+obj.name
            else { _key = obj.name }
            entry[_key] = item
          } else {
            _key = key
            if (!key) _key = obj.name
            entry[_key] = (entry[_key]||[]).concat(item)
          }
        }
      }

      // var obj = path.parse(item)
      // if (item.indexOf('_')!=0 && obj.ext) {
      //   if (obj.name && obj.name.indexOf('_')!=0){
      //     let _key
      //     let key = getKey(item, obj, dir, opts)
      //     if (opts.type && opts.type == 'html') {
      //       key = key.replace(/\-/g, path.sep)
      //       if (key) _key = key+'/'+obj.name
      //       else { _key = obj.name }
      //       entry[_key] = item
      //     } else {
      //       _key = key
      //       if (!key) _key = obj.name
      //       entry[_key] = (entry[_key]||[]).concat(item)
      //     }
      //   }
      // }

    }
  })
  return entry
};

// var webpackConfig = {
//   entry: {
//     index: [
//       // 'webpack-dev-server/client?http://localhost:3000/',
//       // 'webpack/hot/only-dev-server',
//       "./public/js/index.js"
//     ]
//   },

//   output: {
//     path: DIST,
//     filename: "[name].js",
//     publicPath: '/dist/out/js/'
//   },

//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         use:[{
//           loader: "babel-loader",
//           options: { 
//             presets:["react", "es2015", "stage-0", "stage-1", "stage-3"],
//             plugins: [
//               "transform-runtime",
//               "add-module-exports",
//               "transform-decorators-legacy",
//               "transform-react-display-name"
//             ]
//           }
//         }]
//       },
//       {
//         test: /(\.ejs|\.html)$/,
//         use:[{
//           loader: "ejs-loader",
//           options: { variable: 'data'}
//         }]
//       },
//       { 
//         test: /\.styl$/,
//         loader: ExtractTextPlugin.extract('style-loader!css-loader!stylus-loader'),
//       }
//     ]
//   },
//   resolve:{
//     extensions:['.js']
//   },
//   plugins: [
//     new webpack.HotModuleReplacementPlugin()
//   ]
// }

// const _htmlEntry = getEntry(HTMLSRC, {type: 'html'})
// console.log(_htmlEntry);

// const htmlEntry = adapter.html(_htmlEntry)
// webpackConfig.plugins = webpackConfig.plugins.concat(htmlEntry)
// console.log(webpackConfig.plugins);



const _jsEntry = getEntry(JSSRC, {type: 'js'})
console.log(_jsEntry);


// module.exports = webpackConfig