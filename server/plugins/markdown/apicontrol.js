export default async function(ctx, next){
  const fkp = ctx.fkp
  const router = fkp.router
  const isAjax = fkp.isAjax()
  let route = router.makeRoute(ctx)
  route = route.replace('api/', '')

  if (ctx.method == 'GET') {
    if (isAjax) ctx.body = await Fetch.get(route, ctx.query)
  } else {
    ctx.body = await Fetch.post(route, ctx.request.body)
  }
}
