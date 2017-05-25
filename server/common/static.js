/**
 * Module dependencies.
 */
var statics = require('koa-static-cache')   //npm包在windows上有问题，需要到github上拿最新的文件
import convert from 'koa-convert'

// setup views mapping .html
// to the handlebars template engine

function setStatic(app){
    let mode = process.env.NODE_ENV
    console.log('静态资源配置');
    console.log('==============='+__filename+' setStatic');
    console.log('-');
    console.log('-');
    console.log('-');

    app.use(convert(statics(CONFIG.upload.root, {
      dynamic: true,
      prefix: '/uploader'
    })))

    app.use(convert(statics(CONFIG.static.doc, {
      dynamic: true,
      prefix: '/docs'
    })))

    if(mode && mode==='development'){
        app.use(convert(statics(CONFIG.static.dev.dft,{
          dynamic: true,
          buffer: false,
          gzip: true
        })))
    }else{
        app.use( convert(statics(CONFIG.static.dft,{
          dynamic: true,
          buffer: true,
          gzip: true
        })))
    }
}

module.exports = setStatic
