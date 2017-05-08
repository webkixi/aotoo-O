import combx from '../mixins/combinex'

export default function(ComposedComponent, cb){
  return combx(ComposedComponent, {type: 'reactClass'}, cb);
}
