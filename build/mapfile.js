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


  let colletion = {
    dev: {
      js: {},
      css: {}
    },
    pro: {
      js: {},
      css: {}
    }
  }

  function configCSSCollection(obj){
    if (obj.dir.indexOf('/css/t')>-1) {
      if (production) {}
      else {
        colletion.dev.css['t/'+obj.name] = path.join('t', obj.base)
      }
    } else {
      if (production) {}
      else {
        colletion.dev.css[obj.name] = obj.base
      }
    }
  }

  function configJSCollection(obj){
    if (obj.dir.indexOf('/js/t')>-1) {
      if (production) {}
      else {
        colletion.dev.js['t/'+obj.name] = path.join('t', obj.base)
      }
    } else {
      if (production) {}
      else {
        colletion.dev.js[obj.name] = obj.base
      }
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

    console.log('========= 111');
    console.log('========= 111');
    console.log('========= 111');
    console.log(colletion);
  }, 3000)

}
