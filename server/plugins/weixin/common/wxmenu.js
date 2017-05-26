// 获取用户信息的url
// 我们通过微信获取用户信息，需要经过 oAuth认证
/* ============= 
  第一步，获取code
  url: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri=http%3A%2F%2F"+domain+"%2Fcode%2Fcard&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
  appid: 微信 appid
  domain: 微信认证的域名
  注意 redirect_uri：
      url为： http%3A%2F%2F"+domain+"%2Fweixin%2Fcode%2Fcard
      %2Fweixin%2Fcode: 必须，转换为 "/weixin/code"，实则为route路由地址，通过这个地址二次获取公众号的web token
      %2Fcard：card根据具体业务指定，正真用于跳转的业务页面
*/


export default function(appid, domain){
  return {
    "button":[
      {
        "name": "年卡购买",
        "type":"view",
        "url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri=http%3A%2F%2F"+domain+"%2Fcode%2Fcard&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
      },
      {
        "name": "河马车管家",
        "sub_button":[
          {
            "type":"view",
            "name":"关于我们",
            "url":"http://"+domain+"/about.html#about"
          },
          {
            "type":"view",
            "name":"服务项目",
            "url":"http://"+domain+"/about.html#about_service"
          },
          {
            "type":"view",
            "name":"服务区域",
            "url":"http://"+domain+"/about.html#about_area"
          },
          {
            "type":"view",
            "name":"服务流程",
            "url":"http://"+domain+"/about.html#about_com"
          }
        ]
      },
      {
        "name":"我",
        "sub_button":[
          {
            "type":"view",
            "name":"我的年卡",
            "url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri=http%3A%2F%2F"+domain+"%2Fcard%3Fhash%3DcardOrderList&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
          },
          {
            "type":"view",
            "name":"优惠买单",
            "url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri=http%3A%2F%2F"+domain+"%2Fuc.html%3Fhash%3Ddiscount_order&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
          },
          {
            "type":"view",
            "name":"我的订单",
            "url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri=http%3A%2F%2F"+domain+"%2Fuc.html&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
          },
          {
            "type":"view",
            "name":"我的车辆",
            "url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri=http%3A%2F%2F"+domain+"%2Fuc.html%3Fhash%3Dmycar&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
          }
        ]
      }
    ]
  }
}