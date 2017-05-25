import path from 'path'
import mocklist from 'apis/mocklist'

module.exports = function(){
  return {
    mock: function(api, param){
      return mocklist(this.ctx, api, param)
    }
  }
}
