var fs = require('fs')
var path = require('path')
require('babel-core/register')
require("babel-polyfill")
require('app-module-path').addPath(path.join(__dirname, '../'))   // 强插root路径到require中，

var argv = process.argv.slice(2)
var margv = require('minimist')(argv);
global.Configs = require('../configs')(margv.config);

var NODEDEV = process.env.NODE_ENV ? process.env.NODE_ENV == 'development' : margv.d ? true : false
var _VERSIONPATH = Configs.static.dft
var _STATICSROOT = NODEDEV ? path.join(_VERSIONPATH, 'dev') : _VERSIONPATH
var _STATICLINKROOT = path.join(Configs.static.out, 'target')

var STATICSROOT = fs.existsSync(_STATICLINKROOT) 
? margv.version 
  ? _STATICSROOT : ( function(){
    var rootStat = fs.statSync(_STATICLINKROOT)
    return rootStat.isDirectory() ? _STATICLINKROOT : _STATICSROOT
  })() 
: _STATICSROOT

Configs.runtime = {
  mode: NODEDEV,
  margv: margv,
  port: margv.port||Configs.port,
  public: Configs.public,
  statics: {
    root: STATICSROOT,
    js: path.join(STATICSROOT, '/js'),
    css: path.join(STATICSROOT, '/css'),
    html: path.join(STATICSROOT, '/html'),
    img: path.join(__dirname, '../public/images')
  },
  refreshUrl: 'http://localhost:3000/__browser_sync__?method=reload'
}

require('./server')
