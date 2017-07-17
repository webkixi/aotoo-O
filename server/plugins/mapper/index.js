
async function mapper(ctx, next){
  let [pageCss, pageJs] = [ctx.fkp.staticMapper.css, ctx.fkp.staticMapper.js]
  ctx.body = {css: pageCss, js: pageJs}
}

// 返回静态mapper的映射表，前端注入静态文件
export default function(fkp){
  fkp.routepreset('/mapper', {
    customControl: mapper
  })
}
