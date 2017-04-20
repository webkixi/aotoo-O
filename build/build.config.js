import _ from 'lodash'
import * as gulpcss from './gulpcss'
import * as gulphtml from './gulphtml'
import * as gulp3ds from './gulp3ds'
import fs from 'fs'
import path from 'path'

const del = require('del')

const PUBLICPATH = path.resolve('../public/')
   ,  DISTPATH = path.resolve('../dist/')
   ,  CONFIGSPATH = path.resolve('../configs')
   ,  env = (process.env.NODE_ENV).toLowerCase();  // 'development' production

const webpack = require('webpack')
    , glob = require('glob')
    , gulp = require('gulp')
    , $ = require('gulp-load-plugins')();


const configs  = require('../configs/default')()
    , version  = configs.version
    , getEntry = require('./entry');


const DIST         = path.join(__dirname, DISTPATH, 'out', version, (env=='development' ? 'dev' : '') )
    , CSSSRC       = path.join(PUBLICPATH, 'css')
    , COMMONCSSSRC = path.join(PUBLICPATH, 'common/css')
    , JSSRC        = path.join(PUBLICPATH, 'js')
    , HTMLSRC      = path.join(PUBLICPATH, 'html')
    , SRC3DS       = path.join(PUBLICPATH, '3ds')


del.sync([ DIST ], { force: true })

// css
const _cssEntry = getEntry(CSSSRC, {type: 'css'})
gulpcss.makeCss(_cssEntry, {
  src: CSSSRC,
  dist: DIST
})

// commoncss
// const _cssEntry = getEntry(CSSSRC, {type: 'css'})
// gulpcss.makeCss(_cssEntry, {
//   src: CSSSRC,
//   dist: DIST
// })


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
