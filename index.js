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

var fs = require('fs')
var webpack = require('webpack');
var buildConfig = require('./build/build.config')
buildConfig.start()
