let fs = require('fs')
let path = require('path');
let publicConfig = require('build/src_config');

// 分析目录结构并格式化目录树为JSON
// md, html
function index(fkp, type){
  const component = fkp.component()
  async function sonsHomeFiles(dir){
    let _docsList = []
    let rootList = await fkp.readdir(dir)

    return new Promise(async (resolve, reject)=>{
      for (let i=0; i<rootList.length; i++){
        let filename = rootList[i]
        let path = dir + '/' + filename
        let _stat = await fkp.fileexist(path)
        if (_stat.isDirectory() && filename.indexOf('_')!==0 && filename.indexOf('.')!==0 && filename!=='images' ){
          let doc = {
            name: filename,
            path: path
          }
          let secondList = await fkp.readdir(path)
          if (secondList && secondList.length){
            if (_.includes(secondList, '_home.json')) doc['config'] = path + '/_home.json'
            if (_.includes(secondList, '_home.md')) {
              const _path = path + '/_home.md'
              let tmp = await loadmdFile(_path)
              doc['home'] = _.merge({path: _path}, tmp)
            }
            if (_.includes(secondList, '_home.jpg')) doc['img'] = '/docs/'+filename + '/_home.jpg'
            if (_.includes(secondList, '_home.png')) doc['img'] = '/docs/'+filename + '/_home.png'
            _docsList.push(doc)
          }
        }
      }
      resolve(_docsList)
    })
  }

  async function loadMDFile(url, opts){
    if (url && fs.existsSync(url)) {
       const md_raw = fs.readFileSync( url, 'utf8' );
       return await fkp.markdown(md_raw, opts);
    }
  }

  // 读取并解析 md 文件
  async function loadmdFile(url, whichdir, opts){
    try {
      if (typeof url != 'string') url = '/_home_start/index.md'
      let _id = 'loadmdFile_'+url
      if (opts) opts.mdurl = url
      else {
        opts = {mdurl: url}
      }
      return Cache.ifid(_id, async ()=>{
        if (whichdir){
          let _tmp = whichdir.replace(/\//g, '_')+'_'    // maybe problem
          if (url.indexOf('_')!=0 && url.indexOf('/')==-1) {
            url = url.replace(_tmp,'').replace(/_/g,"/")
          }
          if (url.indexOf('.md')===-1) url = url + '.md'
          url = path.join(fkp.root, whichdir, url);
        }
        const exist = await fkp.fileexist(url)
        if (exist && exist.isFile()){
          const mdcnt = {mdcontent:{}};
          const md_raw = fs.readFileSync( url, 'utf8' );
          if (!md_raw || !md_raw.length) return false
          return await fkp.markdown(md_raw, opts);
        }
        return false
      })
    } catch (e) {
      console.log(e);
    }
  }

  async function _getDocsData(doc_dir, options){
    if (fs.existsSync(doc_dir)) {
      let start = {},
        docs = {},
        defaults = {
          docs: false,
          start: false,
          sonlist: false,
          menutree: false
        }

      // 文档目录下的首页文件内容
      const opts = _.merge({}, defaults, options||{})

      if (opts.start){
        const tmp = await loadmdFile(opts.start, {sanitize: false})
        if (tmp) {
          start.home = _.assign({}, tmp, {params: tmp.params})
        } else {
          start.home = {cnt: '<h1>FKP-JS</h1><small>a full stack framwork</small>', title: 'FKP-JS', author: '天天修改'}
        }
      }

      let docsData = _.merge({}, start);

      if (opts.menutree){
        let _data = await fkp.analyzedir(doc_dir)
        let reactHtml = component.tree({data: _data})
        docsData.menutree = reactHtml[0]
      }
      if (opts.sonlist) docsData.sonlist = await sonsHomeFiles(doc_dir)
      return docsData
    }
  }

  async function getDocsData(url, opts){
    return await _getDocsData(url, opts)
  }

  return {
    file: loadmdFile,
    folder: getDocsData
  }
}

export default function(fkp){
  return index
}
