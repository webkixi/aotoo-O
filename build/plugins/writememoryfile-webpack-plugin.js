/**
 * writeMemoryfile.plugin.js
 * webpack-dev-server启动时，所有的文件均在内存中，这个插件将内存中的文件写入文本，但不会影响dev-server的运行
 * author: 天天修改
 * site: www.agzgz.com
 */

var fs = require('fs');

function WriteMemoryFilePlugin(_file, type) { }
WriteMemoryFilePlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', function(stats) {
    var assets = stats.compilation.assets
    Object.keys(assets).forEach(function(fileName) {
      if(process.env.NODE_ENV === 'development'){
        var file = assets[fileName]
        var contents = file.source()
        fs.writeFileSync(file.existsAt, contents, 'utf-8')
      }
    })
  })
}

module.exports = WriteMemoryFilePlugin;
