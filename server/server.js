var request = require('request')
var app = require('./app').default
var path = require('path')
require('app-module-path').addPath(path.join(__dirname, '../'))

const refreshUrl = 'http://localhost:3000/__browser_sync__?method=reload'
const configs = require('../configs/default')(/*配置名字符串*/);  global.CONFIG = configs

async function startServer(){
  try {
    const server = await app()
    server.listen(configs.port, function(){
      // if (process.env.whichMode!='pro') {
      //   request(refreshUrl, function (error, response, body) {
      //     if (error) console.log('server will be start');
      //   })
      // }
    })
  } catch (e) {
    console.error(e.stack)
  }
}

startServer()
