import fs from 'fs'
import defaultConfig from './default'

function config(target){
  if (typeof target == 'string' && fs.existsSync('./'+target+'.js')) {
    return merge(defaultConfig, require('./configs/'+target+'.js'))
  }
  return defaultConfig;
}

module.exports = config