import path from 'path'

export default function(fkp){
  fkp.routepreset('/api', {
    customControl: require('./apicontrol').default
  })
}
