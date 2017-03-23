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
  }
}

export function css(src, dist){
  G.css.src = src+'/css/**/*'
  G.css.dist = dist+'/css/t'
  return _css()
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




export function js(src, dist){
  G.js.src = src+'/js/**/*'
  G.js.dist = dist+'/js/t'
  return _js()
}

function _js(){
  gulp.src(G.js.src)
  .pipe(gulp.dest(G.js.dist))
}

gulp.task('3ds.js', function(){
  _js()
})



