let co = require('co')
let path = require('path')
let bluebird = require('bluebird')
let fs = bluebird.promisifyAll(require('fs'))
import parseanyHtmlDirs from './_readhtmldir'

async function index(fkp, url){
  try {
    let _id = 'parsedir_'+url
    return Cache.ifid(_id, ()=>{
      let dirdata = parseanyHtmlDirs(url)
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
