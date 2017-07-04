import path from 'path'

export default function(fkp){
  Fetch.apilist = {
    list: {
      163: 'http://www.163.com'
    }
  }
  fkp.routepreset('/api', {
    customControl: require('./apicontrol').default
  })
}
