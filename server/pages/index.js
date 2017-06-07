"use strict";

function index(oridata) {
  return {
    get: async function(ctx){
      oridata.fkp = 'FKP2'
      console.log(oridata);
      return oridata;
    },

    post: async function(ctx){
      return {pdata: '我是post数据'}
    }
  }
}

export { index as getData }
