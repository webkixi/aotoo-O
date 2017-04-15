// var argv = process.argv.slice(2)
//
// // webpack -d 开发模式
// // webpack -p 生产模式
//
// var margv = require('minimist')(argv);
// if (argv.length) {
//   if (margv.d) {
//     process.env.NODE_ENV = 'development'
//   }
//   if (margv.p) {
//     process.env.NODE_ENV = 'production'
//   }
// } else {
//   process.env.NODE_ENV = 'development'
// }

import _ from 'lodash'
import * as gulpcss from './build/gulpcss'
import * as gulphtml from './build/gulphtml'
import * as gulp3ds from './build/gulp3ds'
const del = require('del')

const fs = require('fs')
      , path = require('path')
      , webpack = require('webpack')
      , glob = require('glob')
      , gulp = require('gulp')
      , $ = require('gulp-load-plugins')();


const configs = require('./configs/default')()
      , version = configs.version
      , getEntry = require('./build/entry');

const env = (process.env.NODE_ENV).toLowerCase();  // 'development' production

const DIST = path.join(__dirname, './dist/out', version, (env=='development' ? 'dev' : '') )
      , CSSSRC = './public/css'
      , JSSRC = './public/js'
      , HTMLSRC = './public/html'
      , SRC3DS = './public/3ds'

del.sync([ DIST ], { force: true })

// css
const _cssEntry = getEntry(CSSSRC, {type: 'css'})
gulpcss.makeCss(_cssEntry, {
  src: CSSSRC,
  dist: DIST
})


// 第三方库
const treedsEnv = {dist: DIST}
gulp3ds.js(SRC3DS, treedsEnv)
gulp3ds.css(SRC3DS, treedsEnv)



// html
const _htmlEntry = getEntry(HTMLSRC, {type: 'html'})
gulphtml.makeHtml(_htmlEntry, {
  src: HTMLSRC,
  dist: DIST+'/html'
})



// js
const _jsEntry = getEntry(JSSRC, {type: 'js'})
let webpackConfig = require('./build/webpack.config')(_jsEntry, {
  dist: DIST
})

module.exports = webpackConfig
