require('./times')
const ajax = require('./ajax')
const mapper = ajax.sync.get('/mapper')

Aotoo.inject.mapper = mapper.responseJSON
const injectInstance = Aotoo.inject.init()

module.exports = {
  ajax: ajax,
  inject: injectInstance
}