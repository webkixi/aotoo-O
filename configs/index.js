import fs from 'fs'
import defaultConfig from './default'
const merge = require('lodash').merge

function setGlobalConfig(cfg){
  global.CONFIG = cfg
}

function setConfig(target){
  let _configs = defaultConfig
  if (typeof target == 'string' && fs.existsSync('./'+target+'.js')) {
    _configs =  merge(_configs, require('./'+target+'.js'))
  }
  if (typeof window == 'undefined') {
    setGlobalConfig(_configs)
  }
  return _configs;
}

module.exports = setConfig