import path from 'path'
import markdown from 'libs/markdown'


async function index(fkp, md_raw, opts){
  let mdcnt = {
    mdcontent:{}
  }
  let dft = {
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  }
  if (_.isPlainObject(opts)) dft = _.extend(opts)

  // let data = await fkp.excute()
  // let compiled = await fkp.template((md_raw||this.data||''))
  // md_raw = compiled(data)

  let  archive = await markdown(md_raw, mdcnt, dft)
  return archive
}

export default function(fkp){
  return index
}
