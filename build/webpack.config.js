const path = require('path')
  , margv = JSON.parse(process.env.margv)

const envConfig = (() => margv.config ? margv.config : undefined)()
  , appConfigs = require('../configs/index')(envConfig)
  , myPort = appConfigs.port


let G = {
  entry: '',
  env: {},
  production: false
}

// dll common.dll.js
function dllConfig(env) {
  return require('./webpackconfig/webpack.dll.config')(env, G, appConfigs)
}

// webpack config
function busyConfig(_entry, env) {
  return require('./webpackconfig/webpack.busy.config')(_entry, env, G, appConfigs)
}

// 输出webpack配置文件
function webpackConfig(_entry, env) {
  G.entry = _entry
  G.env = env
  G.production = false
  if (process.env.NODE_ENV == 'production') {
    G.production = true
  }
  return busyConfig(_entry, env)
}

module.exports = {
  dllConfig: dllConfig,
  webpackConfig: webpackConfig
}
