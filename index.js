require('babel-core/register')
require("babel-polyfill")

// webpack -d 开发模式
// webpack -p 生产模式
// webpack -n 只启动开发node端

var argv = process.argv.slice(2)
var margv = require('minimist')(argv);
var path = require('path')
var os = require('os')
var fs = require('fs')
var platform = os.platform()

process.env.NODE_ENV = 'development'
if (argv.length) {
  if (margv.d) process.env.NODE_ENV = 'development'
  if (margv.n) process.env.NODE_ENV = 'development'
  
  if (margv.p) process.env.NODE_ENV = 'production'
}

var buildConfig = require('./build')
var firstBuild = true
function activationServer(buildc){
  if (process.env.NODE_ENV == 'development') {
    var nodemon = require('nodemon');
    nodemon({
      "script": './server/index.js',
      "ext": 'js jsx css html',
      "restartable": "rs",
      "verbose": true,
      "ignore": [
        "public/*",
        "dist/*",
        ".git/*",
        "node_modules/*",
        "*.db"
      ],
      "watch": [
        "apis/*",
        "server/*"
      ],
    });

    nodemon.on('start', function () {
      console.log('App has started');
      if (firstBuild && buildc) {
        if (margv.n) {}
        else {
          buildc(nodemon)
        }
      }
    })
    
    .on('quit', function () {
      console.log('App has quit');
    })
    
    .on('restart', function (files) {
      firstBuild = false
      console.log('App restarted due to: ', files);
    });
  }
}

// activationServer()
activationServer(buildConfig)
