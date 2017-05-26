import fs from 'fs'
import Path from 'path'
import request from 'request'
import _mapper from './modules/mapper'
import router from './router'
let fetch = require('./modules/fetch');     global.Fetch = fetch
let mapper = _mapper()

export default async function(app) {
  let innerData = {
    route: {
      prefix: []
    }
  }

  // 实例
  function _fkp(ctx, opts){
    this.ctx = ctx
    this.opts = opts

    this.isAjax = function() {
      return header('X-Requested-With') === 'XMLHttpRequest';
    }

    function header(name, value) {
      if (value != undefined) {
        ctx.request.set(name, value);
      } else {
        return ctx.request.get(name);
      }
    }
  }

  // 静态, fkp()返回实例
  function fkp(ctx, opts){
    let fkpInstanc = new _fkp(ctx, opts)
    for (let property of Object.entries(fkp)) {
      let [_name, _value] = property
      fkpInstanc[_name] = _value
    }
    return fkpInstanc
  }

  // manual set static property or fun or some resource
  fkp.env = process.env.NODE_ENV
  fkp.staticMapper = mapper
  fkp.router = router

  // Register utile function
  fkp.utileHand = function(name, fn){
    if (typeof fn == 'function') {
      fkp[name] = function() {
        if (fn && typeof fn=='function') { return fn.apply(null, [fkp, ...arguments]) }
      }
    }
  }

  // Register plugins function
  fkp.plugins = function(name, fn){
    if (typeof fn == 'function') {
      _fkp.prototype[name] = function() {
        if (fn && typeof fn=='function') { return fn.apply(this, [this.ctx, ...arguments]) }
      }
    }
  }

  // as plugins, it look nice
  fkp.use = function(name, fn){
    _fkp.prototype[name] = function() {
      if (fn && typeof fn=='function') return fn.apply(this, [this.ctx, ...arguments])
    }
  }


  /**
   * 预动态设置路由, 在plugins方法中使用
   * @param  {String}  prefix        koa-router's prefix
   * @param  {JSON}  routerOptions   koa-router's route
  */
  fkp.routepreset = async function(prefix, routerOptions) {
    if (!prefix) return
    if (prefix.indexOf('/')==-1) return
    let prefixs = innerData.route.prefix
    if (prefixs.indexOf(prefix)>-1) return
    prefixs.push(prefix)
    await router(app, prefix, routerOptions)
  }


  /*
  =============== 注册助手方法及plugins =============
  1、助手方法为一般的静态方法，第一个参数fkp，通过fkp.xxx调用，助手方法不能调用plugins方法
  2、插件方法为new fkp后的对象方法，带有this的上下文，第一个参数ctx，为koa环境对象，插件方法挂载在fkp上，调用方法同样为fkp.xxx
  =================================================*/

  try {
    // register utile
    const baseRoot = './base'
    let _utilesFiles = fs.readdirSync(Path.resolve(__dirname, baseRoot))
    if (_utilesFiles && _utilesFiles.length) {
      for (let utileFile of _utilesFiles) {
        if (utileFile.indexOf('_')!=0) {
          let utileFun = require( './base/'+utileFile ).default()
          fkp.utileHand(Path.parse(utileFile).name, utileFun)
        }
      }
    }

    // register plugins
    const pluginRoot = '../plugins'
    let _pluginFiles = fs.readdirSync(Path.resolve(__dirname, pluginRoot))
    if (_pluginFiles && _pluginFiles.length) {
      for (let pluginFile of _pluginFiles) {
        if (pluginFile.indexOf('_')!=0) {
          let plugin = require( Path.join(pluginRoot, pluginFile) ).default(fkp)
          fkp.plugins(Path.parse(pluginFile).name, plugin)
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

  // =========== 注册fkp中间件 =============
  app.fkp = fkp
  app.use(async (ctx, next)=>{
    await router(app)
    ctx.fkp = fkp(ctx)
    Fetch.init(ctx)
    await next()
  })
}
