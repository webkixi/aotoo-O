const gulp = require('gulp')
      , $ = require('gulp-load-plugins')()

const G = {
  entry: '',
  env: {}
}

export function makeCss(entry, env){
  G.entry = entry
  G.env = env

  for (let file in entry) {
    let srcFiles = entry[file]
    let targetFileName = file+'.css'
    generateCss(srcFiles, targetFileName, env)
  }

}

function generateCss(src, target, env){
  gulp.src(src, { base: env.src }) 
  .pipe($.stylus())
  .pipe($.concatCss(target))
  .pipe(gulp.dest(env.dist))
}

gulp.task('dev.css', function(){
  makeCss(G.entry, G.env)
})

