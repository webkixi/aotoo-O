let fs = require('fs')
let path = require('path')
let libs = require('libs')
let config = CONFIG.db
let mongoose = require("mongoose");

export default async function(){
  return new Promise((res, rej)=>{
    let mg = config.mongo
    mongoose.Promise = require('bluebird')
    mongoose.connect(mg.url, mg.options, function(err) {
      if (err) return res(false)
      return res(true)
    })
  })
}
