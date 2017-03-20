var glob = require('glob')
var path = require('path')
var xxx = {}
var yyy = []

function getKey(item, obj){
  if (!obj.dir) {
    return '~root~'+item.replace(obj.ext, '')
  } else {
    if (obj.dir.indexOf(path.sep)>-1) {
      return obj.dir.replace(path.sep, '-')
    } else {
      return obj.dir
    }
  }
}
glob.sync('**/*').forEach(function(item){
  var obj = path.parse(item)
  if (item.indexOf('_')!=0 && obj.ext) {
    if (obj.name && obj.name.indexOf('_')!=0){
      const key = getKey(item, obj)
      xxx[key] = (xxx[key]||[]).concat(item)
    }
  }
})
console.log(xxx);