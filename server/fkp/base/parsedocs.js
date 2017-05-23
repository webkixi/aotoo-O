let fs = require('fs')
let co = require('co');
let path = require('path');
let publicConfig = require('build/src_config');

// 分析目录结构并格式化目录树为JSON
// md, html
function index(fkp, type){
  // a markdown directory's homefile
  // this directory maybe has some sub directory
  // every directory maybe has homefile like _home.md/_home.json/_home.jpg/_home.png
  // support 2 level

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

  // 所有public/html下的文件
  async function getSiteMap(url){
    try {
      url = path.join(publicConfig.dirs.src, 'html')
      let _id = 'sitemap_' + url
      return Cache.ifid(_id, async ()=>{
        let _htmlImages = [];
        let _imgstat = await fkp.fileexist(path.join(publicConfig.dirs.src, 'images/html'))
        if (_imgstat) {
          let htmlImages = await fkp.readdir( path.join(publicConfig.dirs.src, 'images/html') )
          _htmlImages = htmlImages.map((item, i)=>{
            return path.parse(htmlImages[i]).name;
          })
        }

        // let _sitemap = _readdirs(path.join(publicConfig.dirs.src, 'html'));
        let _sitemap = fkp.parsedir(path.join(publicConfig.dirs.src, 'html'));
        let htmlFiles = _sitemap.demoindex.root.list;
        htmlFiles.map( (item, i)=>{
          let fileName = path.parse(item.fileName).name
          let index = _htmlImages.indexOf(fileName);
          htmlFiles[i].img = index>-1 ? '/images/html/'+htmlImages[index] : ''
        })

        Cache.set(_id, _sitemap)
        return _sitemap
      })
    } catch (e) {
      console.log(e);
    }
  }

  async function _getDocsData(doc_dir, options){
    try {
      if (!doc_dir) return false
      let exist = await fkp.fileexist(doc_dir);
      if (!exist) return false

      let sitemap = {},
      start = {},
      docs = {},
      defaults = {
        docs: false,
        sitemap: false,
        start: false,
        sonlist: false,
        menutree: false,
        append: {}
      }
      let opts = _.merge({}, defaults, options||{})

      // 所有public/html下的文件
      if (opts.sitemap) sitemap = await getSiteMap()

      // 文档目录下的首页文件内容
      if (opts.start){
        if (typeof opts.start == 'boolean') {
          opts.start = '/_home_start/index.md'
        }
        let tmp = await loadmdFile(opts.start, doc_dir, {sanitize: false})
        if (tmp) start.home = _.assign({}, tmp.mdcontent, {params: tmp.params})

        else start.home = {cnt: '<h1>FKP-JS</h1><small>a full stack framwork</small>', title: 'FKP-JS', author: '天天修改'}
      }

      docs = {docs: '_docs'}
      let docsData = _.extend({}, opts.append, sitemap, docs, start);

      if (opts.menutree){
        let _data = await fkp.analyzedir(doc_dir)
        let reactHtml = component.tree({data: _data})
        docsData.menutree = reactHtml[0]
      }
      if (opts.sonlist) docsData.sonlist = await sonsHomeFiles(doc_dir)
      if (!opts.docs) delete docsData.docs
      if (!opts.sitemap) delete docsData.demoindex
      if (!opts.start) delete docsData.home
      return docsData
    } catch (e) {
      console.log(e);
    }
  }

  async function getDocsData(url, opts){
    return await _getDocsData(url, opts)
  }

  return {
    file: loadmdFile,
    folder: getDocsData
  }
  //
  // switch (type) {
  //   case 'folder':
  //     return getDocsData
  //   case 'file':
  //     return loadmdFile
  // }
}

export default function(fkp){
  return index
}
