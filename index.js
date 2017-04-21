require('babel-core/register')
require("babel-polyfill")

// webpack -d 开发模式
// webpack -p 生产模式
var argv = process.argv.slice(2)
var margv = require('minimist')(argv);
process.env.NODE_ENV = 'development'
if (argv.length) {
  if (margv.d) process.env.NODE_ENV = 'development'
  if (margv.p) process.env.NODE_ENV = 'production'
}

var WebpackDevServer = require('webpack-dev-server')
var webpack = require('webpack');
var gutil = require('gulp-util');
var wpkconfigs = require('./build/build.config');

var compiler = webpack(wpkconfigs)
if (margv.p) {
  compiler.run( (err, stats) => {
    if (err) throw new gutil.PluginError('[webpack]', err)
    process.exit()
  })
} else {
  new WebpackDevServer( compiler, require('./build/webpack.devserver.config')(wpkconfigs))
  .listen(3000, 'localhost', function (err, result) {
    if (err) console.log(err);
    console.log('Listening at http://localhost:3000/');
  });
}

