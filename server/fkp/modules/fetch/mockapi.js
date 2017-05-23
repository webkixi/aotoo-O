import path from 'path'
import mocklist from 'apis/mocklist'
let debug = Debug('modules:fetch:mockapi')

module.exports = function(){
  return {
    mock: function(api, param){
      return mocklist(this.ctx, api, param)
    }
  }
}
