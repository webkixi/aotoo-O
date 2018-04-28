const gulp = require('gulp')
      , $ = require('gulp-load-plugins')()

const G = {
  css: {
    src: {},
    dist: {}
  },
  js: {
    src: {},
    dist: {}
  },
  production: false
}

// 第三方CSS
export function css(src, env){
  G.css.env = env
  G.css.src = src+'/css/**/*'
  G.css.dist = env.dist+'/css/t'
  G.production = process.env.NODE_ENV == 'production'
  _css()
  watchCss()
}

function _css(){
  gulp.src(G.css.src)
  .pipe($.if('*.less', $.less()))
  .pipe($.if('*.styl', $.stylus()))
  .pipe($.autoprefixer('last 2 version', 'ie 8', 'ie 9', 'ios 8', 'android 4'))
  .pipe($.rename({'extname': '.css'}))
  .pipe(gulp.dest(G.css.dist))
}

gulp.task('3ds.css', function(){
  _css()
})

let cssWatching = false
function watchCss(){
  if (cssWatching || G.production) return
  cssWatching = true
  gulp.watch(G.css.src, ['3ds.css'])
}


// 第三方JS
export function js(src, env) {
  G.js.env = env
  G.js.src = src + '/js/**/*'
  G.js.dist = env.dist + '/js/t'
  G.js.cssdist = env.dist + '/css/t'
  G.production = process.env.NODE_ENV == 'production'
  _js()
  watchJs()
}

function _js() {
  gulp.src(G.js.src)
  .pipe($.if('*.css', gulp.dest(G.js.cssdist), gulp.dest(G.js.dist)))
}

gulp.task('3ds.js', function(){
  _js()
})

let jsWatching = false
function watchJs(){
  if (jsWatching || G.production) return 
  jsWatching = true
  gulp.watch(G.js.src, ['3ds.js'])
}



