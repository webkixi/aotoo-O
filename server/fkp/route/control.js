"use strict";

function Control(ctx, oridata){
  this.ctx = ctx || null
  this.get = undefined
  this.post = undefined
  this.data = oridata
  this.opts = {}
  this.store = {}
  this.initStat = false
}

Control.prototype = {
  init: function(options){
    try {
      var dft = {
        get: this.get,
        post: this.post,
        GET: this.get,
        POST: this.post
      }
      if (_.isPlainObject(options)) dft = _.extend(dft, options)
      this.initStat = true
      this.opts = dft

    } catch (e) {
      console.log(e);
    }
  },
  run: function(ctx, options){
    try {
      this.ctx = ctx
      if (!this.initStat) if (_.isPlainObject(options)) this.init(options)
      let opts = this.opts
      let mtd = ctx.method
      let _data = this.data

      const _get = opts.get || opts.GET
      const _post = opts.post || opts.POST

      if (mtd === 'GET' && _.isFunction(_get)) {
        _data = _get.call(this, ctx)
      }

      if (mtd === 'POST' && _.isFunction(_post)){
        _data = _post.call(this, ctx)
      }
      return _data
    } catch (e) {
      console.log(e);
    }
  },
  set: function(name, data){
    if (!name || !data) return
    this.store[name] = data
  }
}

function control(route, ctx, odata){
  let _id = route+'_controler'
  return Cache.ifid(_id, function(){
    let instance = new Control(ctx, odata)
    Cache.set(_id, instance)
    return instance
  })
}

export default control
