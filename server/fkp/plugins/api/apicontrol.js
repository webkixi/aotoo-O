import router from '../../router'

export default async function(ctx, next){
  let route = router.makeRoute(ctx)
  const fkp = ctx.fkp
  const isAjax = fkp.isAjax()
  route = route.replace('api/', '')

  if (ctx.method == 'GET') {
    if (isAjax) ctx.body = await Fetch.get(route, ctx.query)
  } else {
    ctx.body = await Fetch.post(route, ctx.request.body)
  }
}
