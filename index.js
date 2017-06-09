require('babel-core/register')
require("babel-polyfill")
var nodemon = require('nodemon');


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
  if (margv.f) process.env.NODE_ENV = 'development'   // only FED precompilation with watch FED file, webpack-dev-server provides the service
  if (margv.d) process.env.NODE_ENV = 'development'   // FED precompilation and start node service with watch FED and node file
  if (margv.n) process.env.NODE_ENV = 'development'   // after the FED precompilation is complete, just start the node service with watch node file
  
  if (margv.p) process.env.NODE_ENV = 'production'
}

var buildConfig = require('./build')
var firstBuild = true
function activationServer(buildc){
  if (margv.f) {
    buildc(false, {
      serviceType: margv
    })
    return 
  }

  if (process.env.NODE_ENV == 'development') {
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
          buildc(nodemon, {
            serviceType: margv
          })
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
