"use strict";

function index(oridata) {
  return {
    get: async function(ctx){
      console.log('========= 333334444');
      oridata.fkp = 'FKP2'
      return oridata;
    },

    post: async function(ctx){
      return {pdata: '我是post数据'}
    }
  }
}

export { index as getData }
