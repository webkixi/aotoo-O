module.exports = function(configs){
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
    historyApiFallback:{
      rewrites: [
        { from: /^\/$/, to: '/html/index.html' },
      ]
    },
    clientLogLevel: "info",
    contentBase: configs.output.path,
    publicPath: '/',
    staticOptions: {
      redirect: false
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
