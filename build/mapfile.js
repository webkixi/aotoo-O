var fs = require('fs')
var path = require('path')
var glob = require('glob')

module.exports = function(opts, cb){
  const dir = opts.dist
  const jsEntry = opts.entry.js
  const configs = opts.configs
  const version = configs.version
  const env = (process.env.NODE_ENV).toLowerCase();  // 'development' production
  const envdir = env =='development' ? 'dev' : ''
  const production = env =='development' ? false : true


  const cssdir = path.join(dir, 'css')
  const jsdir = path.join(dir, 'js')
  const htmldir = path.join(dir, 'html')
  const mapdir = path.join(dir, 'map.json')


  // let colletion = {
  //   version: version,
  //   dev: {
  //     js: {},
  //     css: {}
  //   },
  //   pro: {
  //     js: {},
  //     css: {}
  //   }
  // }

  let colletion = {
    version: version,
    js: {},
    css: {},
    html: {}
  }

  function configCSSCollection(obj){
    let _name = obj.name.replace(/-/g,'/')
    if (_name.indexOf('__')>-1) {
      _name = _name.split('__')[0]
    }
    if (obj.dir.indexOf('/css/t')>-1) {
      const relpath = obj.dir.substring(obj.dir.indexOf('/t')+1)
      colletion.css[relpath+path.sep+_name] = path.join(relpath, obj.base)
    } else {
      colletion.css[_name] = obj.base
    }
  }

  function configJSCollection(obj){
    let _name = obj.name.replace(/-/g,'/')
    if (_name.indexOf('__')>-1) {
      _name = _name.split('__')[0]
    }
    if (obj.dir.indexOf('/js/t')>-1) {
      const relpath = obj.dir.substring(obj.dir.indexOf('/t')+1)
      colletion.js[relpath+path.sep+_name] = path.join(relpath, obj.base)
    } else {
      colletion.js[_name] = obj.base
    }
  }

  function configHTMLCollection(obj){
    let _name = obj.name.replace(/-/g,'/')
    if (_name.indexOf('__')>-1) {
      _name = _name.split('__')[0]
    }
    let relpath = obj.dir.substring(obj.dir.indexOf('/html')+1)
    relpath = relpath.replace('html/', '')
    relpath = relpath.replace('html', '')

    if (relpath) {
      colletion.html[relpath+path.sep+_name] = path.join(relpath, obj.base)
    } else {
      colletion.html[_name] = obj.base
    }
  }

  setTimeout(()=>{
    glob.sync(cssdir+'/**/*.css').forEach(function(item){
      const obj = path.parse(item)
      configCSSCollection(obj)
    })

    glob.sync(jsdir+'/**/*.js').forEach(function(item){
      const obj = path.parse(item)
      configJSCollection(obj)
    })

    glob.sync(htmldir+'/**/*.html').forEach(function(item){
      const obj = path.parse(item)
      configHTMLCollection(obj)
    })

    fs.writeFileSync(mapdir, JSON.stringify(colletion))
    if (typeof cb == 'function') cb()
  }, 4000)

}
