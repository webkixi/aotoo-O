import path from 'path'
import md5 from 'blueimp-md5'

/**
 * 主要用于markdown模板的变量替换，当然也可用于直接执行
 * @param  {[JSON]}  fkp fkp附带一些助手方法，由fkp核心模块传递过来
 * @param  {[String]}  cmd 选择执行commond的一种方法
 * @return {Promise}
 */

async function getContent(fkp, mapper, src, opts){
  let $src = ''
  if (src.indexOf('http')==0) return '<link rel="stylesheet" type="text/css" href="'+src+'">\n'
  if (src.indexOf('~')==0) {
    $src = src
    src = src.substring(1)
  }
  const did = md5(src).slice(22)
  if (src.indexOf('/')== 0) {
    if (!path.extname(src)) src +='.css'
    if (src.indexOf('/css/t/')>-1) return '<link id="'+did+'" rel="stylesheet" type="text/css" href="'+src+'">\n'
    src = src.replace('/css/', '').replace('.css', '')
  }
  if (mapper[src]) {
    let _src = mapper[src]
    if (opts.inline || $src) {
      let content = await fkp.readfile(path.join(fkp.root, '/dist/', fkp.config.version, (fkp.env=='dev'?'/dev':''), '/css/'+_src))
      if (content) return '<style>'+content.toString()+'</style>\n'
    } else {
      return '<link id="'+did+'" rel="stylesheet" type="text/css" href="/css/'+_src+'">\n'
    }
  }
}

async function index(fkp, src, opts={}){
  let key = opts.key||'attachCss'
  let content, contents, mapper = _.extend({}, fkp.staticMapper.pageCss, fkp.staticMapper.commonCss)
  if (_.isString(src)) src = [src]
  if (Array.isArray(src)) {
    let contents = []
    for (let item of src) {
      contents.push(await getContent(fkp, mapper, _.trim(item), opts))
    }
    content = contents.join('')
  }
  if (content) {
    // console.log('control pageData will attach css file, pageData.attachCss');
    let tmp = {}
    tmp[key] = content
    return tmp
  }
}

export default function(fkp){
  return index
}
