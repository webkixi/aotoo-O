function passaccess(oridata) {
  return {
    get: async function(ctx){
      let passdata = await Fetch.get(ctx.fkproute, ctx.query)
      return passdata
    },

    post: async function(ctx){
      let passdata = await Fetch.post(ctx.fkproute, ctx.body)
      if (passdata && passdata[1]) {
        if (passdata[0].headers.login){
          ctx.response.set('login', passdata[0].headers.login); //设置response的header
        }
        return passdata[1]
      } else {
        if (passdata && passdata[1]==='') return Errors['1010']
      }
      debug('java/php后端返回数据出错')
      return Errors['60002']
    }
  }
}

export { passaccess as getData }
