const ejs = require('ejs')
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
      // setTimeout(function() {
      //   const mapper = require(configs.output.path+'/mapfile.json')
      //   console.log(mapper);
      // }, 20000);
      
      app.engine('html', ejs.renderFile);
      app.set("view engine", "html");
      app.set('views', configs.output.path+'/html/')
      app.get(/.*/, function(req, res) {
        // console.log(req._parsedUrl);
        console.log(req.query);
        console.log(req.params);
        res.render('index', {pagejs: 'abc123', commoncss: '', commonjs: ''})
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
