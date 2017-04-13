const gulp = require('gulp')
      , $ = require('gulp-load-plugins')()

let G = {
  entry: '',
  env: {},
  production: false
}

export function makeCss(entry, env){
  G.entry = entry
  G.env = env
  G.production = false
  if (process.env.NODE_ENV == 'production') {
    G.production = true
  }

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
  .pipe(
    $.autoprefixer({
      browsers: ['last 2 versions', 'not ie <= 8', 'Firefox > 20', 'iOS > 6', 'Android > 4'],
      cascade: true
    })
  )
  .pipe( $.if( G.production,  $.cleanCss({compatibility: 'ie8'})) )
  .pipe( $.if( G.production,  $.md5({size: 10, separator: '__'}) ) )
  .pipe( gulp.dest(env.dist) )
}

gulp.task('dev.css', function(){
  makeCss(G.entry, G.env)
})

// gulp.task('watch.css', function(){
//   gulp.watch(G.entry, )
//   makeCss(G.entry, G.env)
// })

