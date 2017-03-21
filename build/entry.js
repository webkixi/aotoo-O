var fs = require('fs')
var path = require('path')
var glob = require('glob')

function getKey(item, obj, dir, opts){
  const _root = path.parse(dir)
  const root = path.sep + _root.name
  if (opts.type == 'html') dir = dir.replace(root, '')

  if (!obj.dir) {
    return '~root~'+item.replace(obj.ext, '')
  } else {

    const xxx = dir.replace(/\./g, '\\.').replace(/\//g, '\\/')  // windows不兼容
    const partten = eval('/'+xxx+'[\\/]?/ig')
    const _dir = obj.dir.replace(partten, '') 

    if (_dir.indexOf(path.sep)>-1) {
      return _dir.replace(/\//g, '-')
    } else {
      if (_dir) return _dir
      else {
        return ''
      }
    }
  }
}

function getEntry(dir, opts) {
  var entry = {}
  if (!fs.existsSync(dir)) return;
  const stat = fs.statSync(dir)
  if (!stat.isDirectory()) return

  const _partten = /\/[_](\w)+/;   // ?? 不兼容windows
  glob.sync(dir+'/**/*').forEach(function(item){
    const xxx = _partten.test(item)
    if (!xxx){
      var obj = path.parse(item)
      if (obj.ext) {
        if (obj.name){
          let _key
          let key = getKey(item, obj, dir, opts)
          if (opts.type && opts.type == 'html') {
            key = key.replace(/\-/g, path.sep)
            _key = key ? key+'/'+obj.name : obj.name 
            entry[_key] = item
          } else {
            _key = opts.type+'/'+ (key ? key : obj.name)
            entry[_key] = (entry[_key]||[]).concat(item)
          }
        }
      }
    }
  })
  return entry
};

module.exports = getEntry