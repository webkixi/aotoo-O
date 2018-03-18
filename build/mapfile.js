var fs = require('fs')
var os = require('os')
var path = require('path')
var glob = require('glob')
var pwa = require('./pwa')

const gulp = require('gulp')
  , $ = require('gulp-load-plugins')()
  , workbox = require('workbox-build')
  , del = require('del')
  

module.exports = function(opts, options, cb){
  if (typeof options == 'function') {
    cb = options
    options = undefined
  }
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
  const mapdir = path.join(dir, 'mapfile.json')
  const imagesdir = opts.imagessrc

  const VERSIONPATH = dir
  const OUTROOTPATH = configs.static.root
  

  let colletion = {
    version: version,
    js: {},
    css: {},
    html: {},
    images: {}
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

  function configImageCollection(obj){
    let _name = obj.name
    let relpath = obj.dir.substring(obj.dir.indexOf('/images')+1)
    relpath = relpath.replace('images/', '')
    relpath = relpath.replace('images', '')

    if (_name.indexOf('.')!=0 && obj.ext) {
      if (relpath) {
        colletion.images[relpath + path.sep + _name] = path.join(relpath, obj.base)
      } else {
        colletion.images[_name] = obj.base
      }
    }
  }

  let delay = options && (options.delay[0]-1000) || 6000

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

    glob.sync(imagesdir+'/**/*').forEach(function(item){
      const obj = path.parse(item)
      configImageCollection(obj)
    })

    fs.writeFileSync(mapdir, JSON.stringify(colletion))
    // pwa.customServiceWorkJs(jsdir, colletion, configs)
    pwa.gulpServiceWorkJs({
      dist: opts.dist,
      dest: htmldir,
      colletion,
      configs
    })


    // 创建软链接，指向正确版本的目标文件夹
    function creatStaticSoftLink(params) {
      const targetPath = path.join(OUTROOTPATH, 'target')
      if (fs.existsSync(targetPath)) {
        del.sync([targetPath], { force: true })
      }
      os.platform() == 'win32' 
        ? fs.symlinkSync(VERSIONPATH, targetPath, 'junction')
        : fs.symlinkSync(VERSIONPATH, targetPath)
    }
    creatStaticSoftLink()

    if (typeof cb == 'function') cb()

  }, delay)
}
