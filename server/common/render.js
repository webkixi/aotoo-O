/**
 * Module dependencies.
 */
var path = require('path');
var views = require('koa-views')

function setRender(){
    const stat = process.env.NODE_ENV

    console.log('模板渲染')
    console.log('================='+__filename+' setRender');
    console.log('-');
    console.log('-');
    console.log('-');
    var _html  = CONFIG.static.dev.html;
    var __html = CONFIG.static.html;

    var _map = {
      map: {
        html: 'handlebars'
      }
    }
    var __map = {
      map: {
        html: 'ejs'
      }
    };

    if(stat==='development'){
      return views(_html, __map);
    }

    else if(stat==='production'){
      return views(__html, __map);
    }

    else {
      return views(__html, __map);
    }
}


module.exports = setRender
