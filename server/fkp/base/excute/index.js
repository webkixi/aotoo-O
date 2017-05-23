import co from 'co'
import fs from 'fs'
import path from 'path'
import renderfdocsSon from './fdocsson'

/**
 * 主要用于markdown模板的变量替换，当然也可用于直接执行
 * @param  {[JSON]}  fkp fkp附带一些助手方法，由fkp核心模块传递过来
 * @param  {[String]}  cmd 选择执行commond的一种方法
 * @return {Promise}
 */
async function index(fkp, cmd){
  const markdownParse = fkp.parsedocs()
  let _data = await markdownParse.folder('fdocs', {sonlist: true})
  // for (let ii=0; ii<_data.sonlist.length; ii++) {
  //   const home = _data.sonlist[ii].home
  //   if (home) {
  //     // const tmp = markdownParse.file(home)
  //     // console.log(tmp);
  //   }
  // }
  // // awiat fkp.readfile('/fdocs/fkpdoc/_home.md')
  let _mdson = renderfdocsSon(_data.sonlist)
  let commond = {
    name: '你妹啊，真的可以吗',
    mdson: _mdson
  }

  if (!cmd) return commond
  if (!_.isArray(cmd) || !_.isString()) return false
  if (typeof cmd == 'string') cmd = [cmd]
  let cmds = _.pick(commond, cmd)
  if (_.isEmpty(cmds)) return false
  return cmds
}

export default function(fkp){
  return index
}
