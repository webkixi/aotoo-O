require('babel-core/register')
require("babel-polyfill")

var argv = process.argv.slice(2)

// webpack -d 开发模式
// webpack -p 生产模式

var margv = require('minimist')(argv);
process.env.NODE_ENV = 'development'
if (argv.length) {
  if (margv.d) process.env.NODE_ENV = 'development'
  if (margv.p) process.env.NODE_ENV = 'production'
}

var WebpackDevServer = require('webpack-dev-server')
var webpack = require('webpack');
var configs = require('./webpack.config.babel');

var entry = configs.entry
var hotSverConfig = [
  'webpack-dev-server/client?http://localhost:3000/',
  'webpack/hot/only-dev-server',
]
for (var item in entry) {
  var _tmp = hotSverConfig.concat(entry[item])
  configs.entry[item] = _tmp
}

var compiler = webpack(configs)

new WebpackDevServer( compiler, {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  },
  historyApiFallback:{
    index:'/dist/out/html/index.html'
  },
  clientLogLevel: "info",
  contentBase: configs.output.path,
  hot: true,
  inline: true,
  host: '0.0.0.0',
  port: 3000,
  publicPath: '/',
  stats: { colors: true },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  }
}).listen(3000, 'localhost', function (err, result) {
  if (err) {
    return console.log(err);
  }
  console.log('Listening at http://localhost:3000/');
});
