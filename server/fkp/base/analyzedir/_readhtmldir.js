import fs from 'fs'
import {parse, extname, join as $join} from 'path'


// const _data = [
//   {title: '典型页面', content: '123', idf: 'aaa'},
//   {title: '典型页面1', content: 'aaa', idf: 'bbb', parent: 'aaa'},
//   {title: '典型页面2', content: 'bbb', parent: 'aaa', attr: {"href":'http://www.163.com'}},
//   {title: '典型页面3', content: 'ccc', parent: 'aaa'},
//   {title: '典型页面4', content: 'ddd', parent: 'bbb'},
//   {title: '典型页面5', content: 'eee', parent: 'bbb'},
//   {title: '导航', content: '111'},
//   {title: '表单', content: '333'},
//   {title: '列表', content: '444'},
//   {title: '高级搜索', content: '5555'}
// ]

function chkType(type) {
  if (type.indexOf('.')===0) type = type.replace('.', '')
  var all = {
    style: ['css', 'less', 'stylus', 'styl'],
    templet: ['hbs', 'ejs', 'jade', 'pug', 'htm', 'html', 'php', 'jsp'],
    script: ['js', 'jsx', 'coffee', 'cjsx', 'ts', 'tsx']
  }
  let  staticType = 'script'
  for (var item in all) {
    var arys = all[item];
    if (_.indexOf(arys, type) > -1) staticType = item;
  }
  return staticType
}


function getTempTitle(content) {
  let title = content.match(/<title>([\s\S]*?)<\/title>/ig)
  if (title && title[0].indexOf("{{title}}")>-1 ) {
    title = [/<meta name="subtitle" content=(.*?)\/>/.exec(content)[1].replace(/["|']/g, '')]
  }
  return title
}

function getMdTitle(cnt) {
  let title = cnt.match(/#([\s\S]*?)\n/)||''
  if (title) title = _.trim(title[1].replace(/ \{(.*)\}/g, ''))  // 清除自定义属性，如{"id":"xxx"}
  if (title.indexOf('@')==0) {
    title = title.substring(1)
    fileStat = 'recommend'
  }
  return title
}


let collection = []
let dirs = { root: '' }
let tmp = {}
let docsConfig
function analyzeDirMehtod(directory){
  let htmlDir = fs.readdirSync( directory )
  const parent = directory == dirs.root ? '' : directory
  // const parent = directory
  htmlDir.map(function(filename, ii){
    const subItem = $join(directory, filename)
    const itemState = fs.statSync(subItem)
    const ext = extname(filename)
    let profile = {}
    if (itemState.isFile() && filename.indexOf('_') !=0 && filename.indexOf('.') !=0 ) {
      if (chkType(ext) == 'templet') {
        let content = fs.readFileSync(subItem, 'utf8')
        let title = getTempTitle(content)
        if(title && title[0]){
          profile ={
            title: title[0].replace(/\<(\/?)title\>/g,'').replace(/ \{(.*)\}/g, ''),
            url: parent + '/' + filename,
            attr: {"href": _url},
            content: '',
            parent: parent,
            fileName: filename.replace(ext,'.html'),
            fullpath: subItem,
            des: '',
            ctime: itemState.ctime,
            birthtime: itemState.birthtime
          }

          // html同名的md说明文件
          // .....
        }
      }

      if (ext == '.md') {
        function getMdUrl(){
          const root = dirs.root.indexOf('/') > -1 ? dirs.root.substring(0, dirs.root.indexOf('/')) : _path
          return '/docs'+subItem.replace(root, '').replace('.md', '')
        }

        let content = fs.readFileSync(subItem, 'utf8')
        let descript = 'getDescript(content)'
        let title = getMdTitle(content)
        let _url = getMdUrl()
        if(directory && subItem.indexOf(directory) == -1) filename = filename.replace(ext,'_md.html')

        if (title) {
          profile = {
            title: title,
            url: _url,
            attr: {"href": _url},
            content: '',
            parent: parent,
            stat: '',    // 文件title在列表中的状态，如推荐，热门等等，通过title的头字符描述
            fileName: filename,
            fullpath: subItem,
            des: descript,
            ctime: itemState.ctime,
            birthtime: itemState.birthtime
          }
        }
        collection.push(profile)
      }
    }

    if (itemState.isDirectory() && filename.indexOf('_') !=0 && filename.indexOf('.') !=0 ) {
      let cn_filename
      if (docsConfig) {
        if (docsConfig.directory[filename]) {
          cn_filename = docsConfig.directory[filename]
        }
      }
      profile = {
        title: cn_filename || filename,
        content: '',
        idf: subItem,
        parent: parent
      }
      collection.push(profile)
      analyzeDirMehtod(subItem)
    }
  })
}

export function analyzeDir(_path){
  if (!_path) return false
  collection = []
  dirs.root = _path
  _path = _path.indexOf('/') == 0 ? _path.substring(1) : _path
  let configPath = _path + '/config.js'
  if (fs.existsSync(configPath)) {
    const _config = require(configPath)
    docsConfig = _config
  }

  analyzeDirMehtod(_path)
  return collection
}
