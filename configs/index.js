import fs from 'fs'
import path from 'path'
import defaultConfig from './default'
const merge = require('lodash').merge

function setGlobalConfig(cfg){
  global.CONFIG = cfg
}

function setConfig(target){
  let _configs = defaultConfig
  if (typeof target == 'string') {
    const cfgfile = path.join(__dirname, (target+'.js'))
    if (fs.existsSync(cfgfile)) {
      const nCfg = require(cfgfile)
      _configs = merge(_configs, nCfg)
    }
  }
  if (typeof window == 'undefined') {
    setGlobalConfig(_configs)
  }
  return _configs;
}

module.exports = setConfig