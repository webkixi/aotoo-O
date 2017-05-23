import fs from 'fs'
import path from 'path'
import libs from 'libs'
import {shuffle, sampleSize} from 'lodash'
let src = CONFIG.apis.apiip + CONFIG.apis.port;

let fkp_descript = [
  "FKP-REST是一套前后端分离，基于javascript的全栈实现，适用于中小型项目，基于node的高性能，易部署性及",
  "javascript前后端语言的一致性，学习成本，时间成本及项目快速启动等等方面，FKP都是一种不错的解决方案。提升项目前期、中期的开发效率",
  "FED: 前端有完整的脚手架系统，支持代码的编译、压缩、模块化，及基于Reactjs的各种组件，有router，flux, 存储等全局公共库；",
  "BACK: 后端是基于KOAjs的完整mvc架构，通过中间层map有机的和前端高效结合，提供数据和渲染的支持。中间层map能够独立出来，用",
  "以实现传统基于后端的开发模式;",
  "API: API层支持'pass'及'proxy'两种数据传输模式，极大的方便前端的开发工作，且避免了常见的跨域问题。通过简单的配置apilist实",
  "现与后端数据层的交互",
  "全栈框架，包含压缩，编译，API，KOA(MVC), database(mongo)",
  "FKP-REST是基于前后端分离的模式开发而来，提供API模块与后端数据API接口对接，其他如渲染、简单逻辑、session，mv部分由前端统",
  "一处理. 当然，FKP-REST也同样支持传统开发模式，将map静态映射文件扔给后端就ok了",
  "* 前端模块化开发（基于CMD模式，兼容AMD）",
  "* 三套开发环境（demo/dev/pro）",
  "* 前端代码的 编译／合成 / hash",
  "* 服务端(基于node/koajs)数据处理及http服务",
  "* 服务端同构React"
]

function catchSomeStr(size) {
  let t = shuffle(fkp_descript)
  t = sampleSize(t, 10)
  let tStr = t.join('')
  return libs.grabString(tStr, size)
}

function randomNumber(isfloat) {
  if (!isfloat) return _.random(0, 100)
  return _.random(100, true)
}

function templateData(size){
  return {
    string: catchSomeStr(16),
    string6: catchSomeStr(6),
    string10: catchSomeStr(10),
    string20: catchSomeStr(20),
    string30: catchSomeStr(30),
    string40: catchSomeStr(40),
    string50: catchSomeStr(50),
    string60: catchSomeStr(60),
    string70: catchSomeStr(70),
    string80: catchSomeStr(80),
    string90: catchSomeStr(90),
    string100: catchSomeStr(100),
    string150: catchSomeStr(150),
    string200: catchSomeStr(200),

    number: randomNumber(),
    number_float: randomNumber(true)
  }
}


// libs.strLen
// libs.grabString
function getApiPath(ctx, api, param) {
  let fkp = ctx.fkp
  if (fs.existsSync( path.resolve(__dirname, './datas/'+api+'.js') )) {
    let moban = require('./datas/'+api)()
    , submoban

    if (moban.indexOf('[')==0) {
      submoban = moban.substring(1, moban.length-1)
      return _.times(CONFIG.apis.mock, ()=> JSON.parse(fkp.template(submoban, templateData(), 1)) )
    }
    return JSON.parse(fkp.template(moban, templateData(), 1))

  } else {
    console.error('======== mock api 文件不存在')
    return Errors('60003')
  }
}

module.exports = getApiPath
