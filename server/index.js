var path = require('path')
require('babel-core/register')
require("babel-polyfill")
require('app-module-path').addPath(path.join(__dirname, '../'))   // 强插root路径到require中，
require('./server')
