import path from 'path'

export default function(fkp){
  fkp.routepreset('/docs', {
    customControl: require('./apicontrol').default
  })
}
