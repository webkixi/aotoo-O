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

function Attachment2commonPlugin(_file, type) {
  this.attachFile = _file
  if (!type) type = 'prepend'
  this.attachType = type
}

module.exports = Attachment2commonPlugin;

Attachment2commonPlugin.prototype.apply = function(compiler) {
  var attachFile = this.attachFile
  var attachType = this.attachType
  var parseJson = path.parse(attachFile)

  compiler.plugin("compilation", function(compilation, params) {
    compilation.plugin("optimize-chunk-assets", function(chunks, callback) {
      chunks.forEach(function(chunk) {
        chunk.files.forEach(function(file) {
          if(!chunk.parents.length && chunk.filenameTemplate){  //commontrunk
            if(process.env.NODE_ENV === 'production'){
              // parseJson.dir
              // parseJson.ext
              // parseJson.name
              var _files = fs.readdirSync(parseJson.dir)
              _files.map(function(item){
                if( fs.statSync( path.join( parseJson.dir, item ) ).isFile() && item.indexOf(parseJson.name)>-1){
                  attachFile = path.join( parseJson.dir, item)
                }
              })
            }
            var _attachFileContent = fs.readFileSync(attachFile).toString()
            compilation.assets[file] = new ConcatSource(_attachFileContent, "\n", "\/**attachment2common**\/", "\n", compilation.assets[file]);
          }
        });
      });
      callback();
    });
  });

  // compiler.plugin('done', function(stats) {

    // var assets = stats.compilation.assets
    // var allContent = ''
    // attachFile = this.outputPath+'/'+attachFile
    //
    // if (!fs.existsSync(attachFile)){
    //   return false
    // }
    // else {
    //   Object.keys(assets).forEach(function(fileName) {
    //     if (fileName.indexOf('_common') === 0 ){
    //       var file = assets[fileName];
    //       var attachFileContent = fs.readFileSync(attachFile)
    //       if (attachType === 'prepend'){
    //         allContent = attachFileContent + file.source()
    //       }
    //       else {
    //         allContent = file.source() + attachFileContent
    //       }
    //     }
    //   })
    //
    //   fs.writeFile(attachFile, allContent, 'utf-8')
    // }

    // var htmlFiles = [];
    // var hashFiles = [];
    // var assets = stats.compilation.assets;

    // Object.keys(assets).forEach(function(fileName) {
    //   var file = assets[fileName];
    //   if (/\.(css|js)$/.test(fileName)) {
    //     var hash = md5(file.source());
    //     var newName = fileName.replace(/(.js|.css)$/, '.' + hash + '$1');
    //     hashFiles.push({
    //       originName: fileName,
    //       hashName: newName
    //     });
    //     fs.rename(file.existsAt, file.existsAt.replace(fileName, newName));
    //   }
    //   else if (/\.html$/) {
    //     htmlFiles.push(fileName);
    //   }
    // });
    //
    // htmlFiles.forEach(function(fileName) {
    //   var file = assets[fileName];
    //   var contents = file.source();
    //   hashFiles.forEach(function(item) {
    //     contents = contents.replace(item.originName, item.hashName);
    //   });
    //   fs.writeFile(file.existsAt, contents, 'utf-8');
    // });

  // });
};
