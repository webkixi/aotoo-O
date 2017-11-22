require('./times')
const ajax = require('./ajax')
ajax.sync.get('/mapper').then(function(data) {
  Aotoo.inject.mapper = data
  Aotoo.inject.init()
})

module.exports = {
  ajax: ajax,
  inject: Aotoo.inject
}