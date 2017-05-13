import combx from 'react-combinex'

export default function(ComposedComponent, cb){
  return combx(ComposedComponent, {type: 'reactClass'}, cb);
}
