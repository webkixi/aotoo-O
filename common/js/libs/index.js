require('./times')
const ajax = require('./ajax')
const inject = require('./inject')

ajax.get('/mapper')
.then( data=>{
  inject.mapper = data
})

module.exports = {
  ajax: ajax,
  inject: inject
}