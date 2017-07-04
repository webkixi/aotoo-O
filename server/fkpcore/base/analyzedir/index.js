let path = require('path')
let bluebird = require('bluebird')
let fs = bluebird.promisifyAll(require('fs'))
import {analyzeDir} from './_readhtmldir'

async function index(fkp, url){
  try {
    let _id = 'analyzeDir_'+url
    return Cache.ifid(_id, ()=>{
      let dirdata = analyzeDir(url)
      Cache.set(_id, dirdata)
      return dirdata
    })
  } catch (e) {
    // debug('parsedir: ' + e.message)
    console.log(e);
    return false
  }
}

export default function(fkp){
  return index
}
