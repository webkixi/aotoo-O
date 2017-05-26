import myWXmenus from './common/wxmenu'
import path from 'path'
const jsSHA = require('jssha');


const WXCONFIG = {
  tokenVal: '_agzgz',
  appid: 'wxec91673b97ce1463',
  appsecret: '2c2c9312a61cd9aa0eca16e2e8939cfb',
  encodingAESKey: '',
  domain: 'cbk.sunywave.cn'
}

const APIS = {
    // token 组
    wx_token: 'https://api.weixin.qq.com/cgi-bin/token'
  , querymenu: 'https://api.weixin.qq.com/cgi-bin/menu/get' //?access_token=ACCESS_TOKEN
  , createmenu: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN' //?access_token=ACCESS_TOKEN

    // web token 组
  , wx_web_token: 'https://api.weixin.qq.com/sns/oauth2/access_token'  // ?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
  , wx_web_refresh_token: 'https://api.weixin.qq.com/sns/oauth2/refresh_token' // ?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN
  , valide_web_token: 'https://api.weixin.qq.com/sns/auth'  // ?access_token=ACCESS_TOKEN&openid=OPENID

    //oauth2方式的api会以 '_web' 方式结尾
  , userlist: 'https://api.weixin.qq.com/cgi-bin/user/get'
  , getticket: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket' //?access_token=ACCESS_TOKEN&type=jsapi
  , getuserinfo: 'https://api.weixin.qq.com/sns/userinfo' //?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN
}


async function getToken() {
  return Cache.ifid('WXTOKEN', async function() {
    try {
      let _token = await Fetch.get(APIS['wx_token'], {
        grant_type: 'client_credential',
        appid: WXCONFIG.appid,
        secret: WXCONFIG.appsecret
      })
      const token = JSON.parse(_token.data);
      Cache.set('WXTOKEN', token.access_token, (7000 * 1000)) // token.expires_in = 7200
      return token.access_token
    } catch (error) {
      console.log(error)
    }
  })
}

async function getWebToken(params) {
  if (!params || !params.code) return {}
  const USER_IDENTIFYING = 'WXWEBIDENTIFY'+params.code
  return Cache.ifid(USER_IDENTIFYING, async function() {
    try {
      //
      // 获取 web token，注意区别于token
      // 参考 http://mp.weixin.qq.com/wiki/4/9ac2e7b1f1d22e9e57260f6553822520.html#.E7.AC.AC.E4.B8.80.E6.AD.A5.EF.BC.9A.E7.94.A8.E6.88.B7.E5.90.8C.E6.84.8F.E6.8E.88.E6.9D.83.EF.BC.8C.E8.8E.B7.E5.8F.96code
      //
      const _token = await Fetch.get(APIS['wx_web_token'], {
        appid: WXCONFIG.appid,
        secret: WXCONFIG.appsecret,
        code: params.code,
        grant_type: 'authorization_code'
      })
      const token = JSON.parse(_token.data);
      let identification = {
        openid: token.openid,
        scope: token.scope,
        refresh_token: token.refresh_token,
        token: token.access_token,
        token_expire: token.expires_in
      }

      //
      // 根据 identification.refresh_token 重新授权token，拥有更长的过期时间，如7天等
      //
      // const _refresh_token = await Fetch.get(APIS['wx_web_refresh_token'], {
      //   appid: WXCONFIG.appid,
      //   grant_type: 'refresh_token',
      //   refresh_token: identification.refresh_token
      // })
      // const refresh_token = JSON.parse(_refresh_token.data);
      // identification = {
      //   openid: refresh_token.openid,
      //   scope: refresh_token.scope,
      //   refresh_token: refresh_token.refresh_token,
      //   token: refresh_token.access_token,
      //   token_expire: refresh_token.expires_in
      // }

      Cache.set(USER_IDENTIFYING, identification, (7000 * 1000))
      return identification
    } catch (error) {
      console.log(error)
    }
  })
}

// 第一步：确认url有效
// 对应微信公众号的《接口配置信息》
function verifyUrl(query) {
  const TOKEN = WXCONFIG.tokenVal
  const signature = query['signature']
  const timestamp = query['timestamp']
  const nonce = query['nonce']
  const echostr = query['echostr']
  const ary = [TOKEN, timestamp, nonce].sort()
  const aryStr = ary.join('')
  const shaObj = new jsSHA(aryStr, 'TEXT');
  const signaturex = shaObj.getHash('SHA-1', 'HEX');
  return signature == signaturex ? echostr : ''
}

function weixinBehavior(ctx) {
  return {

    // 构建菜单
    createMenu: async() => {
      const token = await getToken()
      const menus = myWXmenus(WXCONFIG.appid, WXCONFIG.appsecret)
      const url = APIS['createmenu'].replace('ACCESS_TOKEN', token)
      const xxx = await Fetch.post(url, menus)
      console.log(xxx);
    },

    // 查询菜单
    queryMenu: async() => {
      // 不存在 { data: '{"errcode":46003,"errmsg":"menu no exist hint: [s1Zlla0137vr20]"}' }
      // 存在 {"errcode":0,"errmsg":"ok"}
      const token = await getToken()
      const xxx = await Fetch.get(APIS['querymenu'], { access_token: token })
      console.log(xxx)
    },

    // 用户列表信息
    userList: async(nxtopenid) => {
      const token = await getToken()
      const xxx = await Fetch.get(APIS['userlist'], { access_token: token, next_openid: (nxtopenid || '') })
      console.log(xxx)
    },

    identifying: async() => {
      if ($Weixin.getWebToken) return $Weixin.getWebToken()
    },

    // 用户详细
    userInfo: async(nxtopenid) => {
      if ($Weixin.getWebToken) {
        const token = $Weixin.getWebToken()
        const openid = token.openid
        const xxx = await Fetch.get(APIS['getuserinfo'], {
          access_token: token.token,
          openid: openid,
          lang: 'zh_CN'
        })
        console.log(xxx)
      }
    }
  }
}

async function weixin(ctx, next) {
  const [cat, title, id] = Object.values(ctx.params)
  const isAjax = ctx.fkp.isAjax()
  if (ctx.method == 'GET') {
    if (cat) {
      // 公众号跳转到该页面时的url为： redirect_uri/?code=CODE&state=STATE
      if (cat == 'code') {
        ctx.session.wxcode = cat

        // 挂载 getWebToken 方法到全局微信上
        // 其他业务页面就可以获取有效期的web token及openid
        $Weixin.getWebToken = function(){
          return getWebToken({code: ctx.session.wxcode})
        }

        let redirect_uri = title
        const code = ctx.query.code
        const state = ctx.query.state
        const webToken = getWebToken({code: code})  //identification 用户公众号标识，包含用户的openid

        if (redirect_uri) {
          if (id) {
            redirect_uri = redirect_uri + path.sep + id
          }
          ctx.redirect(redirect_uri)
        }
      }

    } else {
      ctx.body = verifyUrl(ctx.query)
    }
  }
}

async function wxBehavior(ctx, next) {
  const abc = weixinBehavior(ctx)
  await abc.userList()
}

async function identifying(ctx, next){
  if ($Weixin.getWebToken) return $Weixin.getWebToken()
}

export default function(fkp) {
  global.$Weixin = {}

  // 微信公众号设置的网站url
  // /weixin/code 用于获取用户的openid
  fkp.routepreset('/weixin/identifying', {
    customControl: weixin
  })

  // 微信公众号设置的网站url
  // /weixin/code 用于获取用户的openid
  fkp.routepreset('/weixin', {
    customControl: weixin
  })

  fkp.routepreset('/wx', {
    customControl: wxBehavior
  })
    // return weixinBehavior
}
