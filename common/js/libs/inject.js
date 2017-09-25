// import inject from 'aotoo-inject'

// const instance = inject()

// // mapper
// // instance.mappter = {}

// module.exports = instance

module.exports = function(ajax){
  const mapper = ajax.sync.get('/mapper')
  Aotoo.inject.mapper = mapper.responseJSON
  return Aotoo.inject.init()
}