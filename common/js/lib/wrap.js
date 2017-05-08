const combx = require('../mixins/combinex')

export default function(ComposedComponent, cb){
  return combx(ComposedComponent, {type: 'reactClass'}, cb);
}