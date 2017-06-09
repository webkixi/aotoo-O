const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
function queryParams(uri){
  let [cat, title, id, ...other] = uri.substring(1).split('/')
  return {cat, title, id, other}
}

function valideExt(filename){
  const exts = ['.html']
  let accessExt = false
  const ext = path.extname( filename)
  if (exts.indexOf(ext)>-1) {
    accessExt = true
  }
  if (!ext) accessExt = true
  return accessExt
}
// server
function wpServer(configs){
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
    historyApiFallback:{
      rewrites: [
        // { from: /^\/$/, to: '/html/index.html' },
        // { from: /^\/hello$/, to: '/html/hello.html' },
      ]
    },
    clientLogLevel: "info",
    contentBase: configs.output.path+'/html/',
    publicPath: '/',
    staticOptions: {
      redirect: false
    },
    setup: function(app){
      app.engine('html', ejs.renderFile);
      app.set("view engine", "html");
      app.set('views', configs.output.path+'/html/')
      app.get(/\.css$/, function(req, res){
        const staticPath = path.join(configs.output.path, req._parsedUrl._raw)
        if (fs.existsSync(staticPath)) {
          res.sendFile(staticPath);
        } else {
          res.status(404).send('Sorry! file is not exist.');
        }
      })
      app.get(/\.js$/, function(req, res){
        const staticPath = path.join(configs.output.path, req._parsedUrl._raw)
        if (fs.existsSync(staticPath)) {
          res.sendFile(staticPath);
        } else {
          res.status(404).send('Sorry! file is not exist.');
        }
      })
      app.get(/\.(ico|jpg|jpeg|png|gif)$/, function(req, res){
        const staticPath = path.join(configs.output.path, req._parsedUrl._raw)
        if (fs.existsSync(staticPath)) {
          res.sendFile(staticPath);
        } else {
          res.status(404).send('Sorry! file is not exist.');
        }
      })
      app.get('/mapper', function(req, res){
        const staticPath = path.join(configs.output.path, 'mapfile.json')
        if (fs.existsSync(staticPath)) {
          res.sendFile(staticPath);
        } else {
          res.status(404).send('Sorry! file is not exist.');
        }
      })
      app.get(/.*/, function(req, res) {
        let url = queryParams(req._parsedUrl._raw)
        let router = 'index'
        if (url.cat) {
          if (valideExt(url.cat)) router = url.cat
        }
        if (url.title){
          if (valideExt(url.title)) router += '-'+url.title
        }

        const Pagecss = `<link rel="stylesheet" href="/css/${router}.css" />`
        const Pagejs = `<script type="text/javascript" src="/js/${router}.js" ></script>`
        const Commoncss = `<link rel="stylesheet" href="/css/common.css" />`
        const Commonjs = `<script type="text/javascript" src="/js/common.js" ></script>`
        res.render('index', {pagejs: Pagejs, pagecss: Pagecss, commoncss: Commoncss, commonjs: Commonjs})
      });
    },
    hot: true,
    inline: true,
    host: '0.0.0.0',
    port: 3000,
    stats: { colors: true },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
}

// proxy
function wpProxy(configs){
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
    historyApiFallback: true,
    clientLogLevel: "info",
    stats: { colors: true },
    hot: true,
    inline: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    host: '0.0.0.0',
    port: 8070,
    proxy: {
      '*': {
        target: 'http://localhost:8070',
        secure: false,
        changeOrigin: true
      }
    },
    // noInfo: true
  }
}

module.exports = function(cfgs, opts){
  if (opts && opts.serviceType) {
    const stype = opts.serviceType
    if (stype.f) {
      return wpServer(cfgs)
    } else {
      return wpProxy(cfgs)
    }
  }
}
