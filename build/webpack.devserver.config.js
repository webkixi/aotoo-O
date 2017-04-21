module.exports = function(configs){
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
    historyApiFallback:{
      index:'/dist/out/html/index.html'
    },
    clientLogLevel: "info",
    contentBase: configs.output.path,
    staticOptions: {
      redirect: true
    },
    hot: true,
    inline: true,
    host: '0.0.0.0',
    port: 3000,
    publicPath: '/',
    stats: { colors: true },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
}