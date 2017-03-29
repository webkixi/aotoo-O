const ExtractTextPlugin = require('extract-text-webpack-plugin')
      , HtmlWebpackPlugin = require('html-webpack-plugin')
      , alias = require('./webpack.alias')
      , webpack = require('webpack')

module.exports = function(DIST){
  return {
    // entry: {},
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
}