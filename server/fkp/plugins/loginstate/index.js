
async function loginstate(ctx, next){
  ctx.body = ctx.session.login || {error: '12345'}
}

async function logout(ctx, next){
  ctx.session.login = null;
  Cache.del('LOGINTOKEN');
  ctx.body = {state:'logout'};
}

export default function(fkp){
  fkp.routepreset('/loginstate', {
    customControl: loginstate
  })

  fkp.routepreset('/logout', {
    customControl: logout
  })
}
