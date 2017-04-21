import _ from 'lodash'
import * as gulpcss from './gulpcss'
import * as gulphtml from './gulphtml'
import * as gulp3ds from './gulp3ds'
const env = (process.env.NODE_ENV).toLowerCase();  // 'development' production

const fs   = require('fs')
    , path = require('path')
    , webpack = require('webpack')
    , glob = require('glob')
    , gulp = require('gulp')
    , $    = require('gulp-load-plugins')()
    , del  = require('del')

const configs  = require('../configs/default')()
    , version  = configs.version
    , getEntry = require('./entry');

const DIST    = path.join( __dirname, '../dist/out', version, (env=='development' ? 'dev' : '') )
    , CSSSRC  = path.join( __dirname, '../public/css')
    , JSSRC   = path.join( __dirname, '../public/js')
    , HTMLSRC = path.join( __dirname, '../public/html')
    , SRC3DS  = path.join( __dirname, '../public/3ds')



del.sync([ DIST ], { force: true })

// css
let _cssEntry = getEntry(CSSSRC, {type: 'css'})
_cssEntry = _.merge(_cssEntry, {'css/common': path.join(__dirname, '../public/common/css/index.styl')})   // common.css
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
let webpackConfig = require('./webpack.config')(_jsEntry, {
  dist: DIST
})

module.exports = webpackConfig
