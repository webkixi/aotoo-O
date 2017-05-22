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
  watchHtml()
}

function generateHtml(src, env){
  gulp.src(src, { base: env.src })
  .pipe($.fileInclude({
    prefix: '@@',
    basepath: '@file'
  }))
  // .pipe($.ejs())
  .pipe(gulp.dest(env.dist))
}

gulp.task('html:dev', function(){
  makeHtml(G.entry, G.env)
})

let watching = false
function watchHtml(){
  if (watching||G.production) return
  watching = true
  let entries = []
  for (let file in G.entry) {
    entries = entries.concat(G.entry[file])
  }
  gulp.watch(entries, ['html:dev'])
}
