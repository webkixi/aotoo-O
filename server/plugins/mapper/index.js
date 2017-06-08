
async function mapper(ctx, next){
  let [pageCss, pageJs] = [ctx.fkp.staticMapper.pageCss, ctx.fkp.staticMapper.pageJs]
  ctx.body = {css: pageCss, js: pageJs}
}

// 返回静态mapper的映射表，前端注入静态文件
export default function(fkp){
  fkp.routepreset('/mapper', {
    customControl: mapper
  })
}
