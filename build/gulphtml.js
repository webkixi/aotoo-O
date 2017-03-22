const gulp = require('gulp')
      , $ = require('gulp-load-plugins')()

const G = {
  entry: '',
  env: {}
}

export function makeHtml(entry, env){
  G.entry = entry
  G.env = env

  let srcs = []
  for (let file in entry) {
    srcs.push(entry[file])
  }
  generateHtml(srcs, env)
}

function generateHtml(src, env){
  gulp.src(src, { base: env.src }) 
  .pipe($.ejs()) 
  .pipe(gulp.dest(env.dist))
}

gulp.task('html', function(){
  makeHtml(G.entry, G.env)
})