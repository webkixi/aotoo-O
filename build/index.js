import _ from 'lodash'
import * as gulpcss from './gulpcss'
import * as gulphtml from './gulphtml'
import * as gulp3ds from './gulp3ds'

import webbuild from "./generate/web";

const env = (process.env.NODE_ENV).toLowerCase();  // 'development' production
const margv = JSON.parse(process.env.margv)
const browserSync = require('browser-sync').create()
const reload  = browserSync.reload
const envConfig = (() => margv.config ? margv.config : undefined)()
const fs   = require('fs')
    , path = require('path')
    , webpack = require('webpack')
    , WebpackDevServer = require('webpack-dev-server')
    , glob = require('glob')
    , gulp = require('gulp')
    , gutil = require('gulp-util')
    , $    = require('gulp-load-plugins')()
    , del  = require('del')

const configs  = require('../configs')(envConfig)
    , version  = configs.version
    , getEntry = require('./entry')

const reIgnore = configs.build.ignoreKeys

const DIST    = path.join( __dirname, '../dist/out', version, (env=='development' ? 'dev' : '') )
    , DLLDIST = path.join( __dirname, '../dist/out/', 'dll' )
    , CSSSRC  = path.join( __dirname, '../public/css')
    , JSSRC   = path.join( __dirname, '../public/js')
    , HTMLSRC = path.join( __dirname, '../public/html')
    , IMAGESSRC = path.join( __dirname, '../public/images')
    , SRC3DS  = path.join( __dirname, '../public/3ds')

del.sync([ DIST ], { force: true })

// css
let _cssEntry = getEntry(CSSSRC, {type: 'css'})
_cssEntry = _.merge(_cssEntry, { 'css/common': path.join(__dirname, '../common/css/index.styl') })  // 加入 common.css
const _htmlEntry = getEntry(HTMLSRC, {type: 'html'})
const _jsEntry = getEntry(JSSRC, {type: 'js'})

// 生产环境剔除demo
if (env == 'production') {
  Object.keys(_cssEntry).forEach(key => {
    if (reIgnore.test(key)) delete _cssEntry[key]
  })

  Object.keys(_htmlEntry).forEach(key => {
    if (reIgnore.test(key)) delete _htmlEntry[key]
  })

  Object.keys(_jsEntry).forEach( key => {
    if (reIgnore.test(key)) delete _jsEntry[key]
  })
}

const compilationParameters = {
  env, 
  configs,
  DIST,
  DLLDIST,
  CSSSRC,
  JSSRC,
  HTMLSRC,
  IMAGESSRC,
  SRC3DS,
  _cssEntry,
  _jsEntry,
  _htmlEntry
}

module.exports = function(nm, cmd_args) {
  webbuild(nm, cmd_args, compilationParameters)
}
