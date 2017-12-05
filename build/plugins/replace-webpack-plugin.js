/**
 * attachment2common.plugin.js
 * 为webpack的commontrunk添加外部的打包文件
 * author: 天天修改
 * site: www.agzgz.com
 */

var fs = require('fs');
var path = require('path');
var md5 = require('blueimp-md5');
var _ = require('lodash')
var ConcatSource = require("webpack-sources/lib/ConcatSource");

function replacePlugin(replaceOptions) {
  this.options = replaceOptions || []
}

module.exports = replacePlugin;

replacePlugin.prototype.apply = function (compiler) {
  var options = this.options

  compiler.plugin("compilation", function (compilation, params) {
    compilation.plugin("optimize-chunk-assets", function (chunks, callback) {
      chunks.forEach(function (chunk) {
        chunk.files.forEach(function (file) {
          var source = compilation.assets[file].source()
          // source = source.replace(/\/images\//, '/myimages/')
          options.forEach(function (item, ii) {
            if (Array.isArray(item)) {
              var patten = item[0]
              var newContent = item[1]
              source = source.replace(patten, newContent)
            }
          })
          compilation.assets[file] = new ConcatSource(source)
        })
      })
      callback()
    })
  })
}
