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


let collection = []
let dirs = { root: '' }
let tmp = {}

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

function analyzeDirMehtod(directory){
  let htmlDir = fs.readdirSync( directory )
  const parent = directory == dirs.root ? '' : directory
  htmlDir.map(function(filename, ii){
    const subItem = $join(directory, filename)
    const itemState = fs.statSync(subItem)
    const ext = extname(filename)
    let profile = {}
    if (itemState.isFile() && filename.indexOf('_') !=0 ) {
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
          // let _filenameMd = filename.replace(ext, '_md.html')
          // let _url = parent ? depthFile.replace('.html','_md.html') : ( (parent || '') + '/' + _filenameMd )
          // if (subItem.indexOf(dirs.root) > -1) {
          //   // let mdpath = subItem.replace(dirs.root, '').replace(/\//g,'__').replace('.md', '')
          //   // return '/docs/'+mdpath
          //   return '/docs/'+subItem.replace(dirs.root, '').replace('.md', '')
          // }
          return ''
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

    if (itemState.isDirectory() && filename.indexOf('_') !=0 ) {
      profile = {
        title: filename,
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
  dirs.root = _path
  _path = _path.indexOf('/') == 0 ? _path.substring(1) : _path
  _path = _path.indexOf('/') > -1 ? _path.substring(0, _path.indexOf('/')+1) : _path
  analyzeDirMehtod(_path)
  return collection
}

export default function readHtmldir(_path, _capt) {
  if (!_path) return false
  let docDir = _path || ''
  let rootdir = docDir
  if (docDir.indexOf('/')>-1) rootdir = docDir.substring(0, docDir.indexOf('/')+1)
  let list = {}
  let tmp = {}
  let depth = 1

  function makeListData(htmlDirPath, caption, parent) {
    depth++
    if (depth==3){
    }
    let htmlDir = fs.readdirSync( htmlDirPath )
    let _caption = caption || 'root'
    list[ _caption ] = list[ _caption ] || {}
    list[ _caption ].group = list[ _caption ].group || _caption
    list[ _caption ].caption = _caption
    list[ _caption ].list = list[ _caption ].list || []
    list[ _caption ]['parent'] = parent||'root'
    list[ _caption ]['children'] =[]

    let dirJson = parse(htmlDirPath)
    if (dirJson.dir != _path) list[ _caption ].subtree = true

    htmlDir.map ((filename)=>{
      let firstPath = htmlDirPath + '/' + filename
      let firstStat = fs.statSync(firstPath)

      if (firstStat.isFile() && filename.indexOf('_')!=0 && filename!='demoindex') {
        function getTitle(content) {
          let title = content.match(/<title>([\s\S]*?)<\/title>/ig)
          if (title && title[0].indexOf("{{title}}")>-1 ) {
            title = [/<meta name="subtitle" content=(.*?)\/>/.exec(content)[1].replace(/["|']/g, '')]
          }
          return title
        }

        function getUrl(filename, caption) {
          let _url = '/'
          _url = filename.replace(ext, '.html')
          if (caption) _url = caption + '/' + _url
          return '/'+_url
        }

        let ext = extname(filename)
        let depthFile = filename.replace(ext, '.html')


        if (chkType(ext) == 'templet') {
          let content = fs.readFileSync(firstPath,'utf8')
          let title = getTitle(content)
          if (!title) console.log('hbs 没有标题')

          if(title && title[0]){
            fileprofile ={
              url: getUrl('/', caption),
              ipurl: '',
              group: _caption,
              title: title[0].replace(/\<(\/?)title\>/g,'').replace(/ \{(.*)\}/g, ''),
              stat: '',
              fileName: filename.replace(ext,'.html'),
              fullpath: firstPath,
              des: '',
              mdname: '',
              ctime: firstStat.ctime,
              birthtime: firstStat.birthtime
            }

            // html同名的md说明文件
            let firstMd = firstPath.replace(ext,'.md')
            let filenameMd = filename.replace(ext, '.md')
            if(fs.existsSync(firstMd)) {
              tmp[filenameMd] = true
              let desContent = fs.readFileSync(firstMd,'utf8')
              fileprofile.des = grabString(desContent,200, true)
              fileprofile.mdname = filename.replace(ext, '_md.html')
            }
          }
        }

        if (ext == '.md') {
          let fileStat = ''  // 文件title在列表中的状态，如推荐，热门等等，通过title的头字符描述
          function getTitle(cnt) {
            let title = cnt.match(/#([\s\S]*?)\n/)||''
            if (title) title = _.trim(title[1].replace(/ \{(.*)\}/g, ''))  // 清除自定义属性，如{"id":"xxx"}
            if (title.indexOf('@')==0) {
              title = title.substring(1)
              fileStat = 'recommend'
            }
            return title
          }

          function getDescript(cnt) {
            // return cnt.match(/^> ([\s\S]+?)\n$/)
            return ''
          }

          function getUrl(){
            let _filenameMd = filename.replace(ext, '_md.html')
            let _url = caption ? depthFile.replace('.html','_md.html') : ( (caption || '') + '/' + _filenameMd )
            if (docDir && firstPath.indexOf(docDir) > -1) {
              // let mdpath = firstPath.replace(rootdir, '').replace(/\//g,'__').replace('.md', '')
              // return '/docs/'+mdpath
              return '/docs/'+firstPath.replace(rootdir, '').replace('.md', '')
            }
          }

          if (!tmp[filename]) {
            let content = fs.readFileSync(firstPath,'utf8')
            let descript = getDescript(content)
            let title = getTitle(content)
            let _url = getUrl()

            if(docDir && firstPath.indexOf(docDir) == -1) filename = filename.replace(ext,'_md.html')

            if (title) {
              let fileprofile = {
                url: _url,
                ipurl: '',
                group: _caption,
                title: title,
                stat: fileStat,
                fileName: filename,
                fullpath: firstPath,
                des: descript,
                mdname: '',
                ctime: firstStat.ctime,
                birthtime: firstStat.birthtime
              }
              list[ _caption ].list.push(fileprofile)
            }
          }
        }
      }

      if (firstStat.isDirectory() && filename.indexOf('_') != 0) {
        list[ _caption ]['children'].push(filename)
        list[ _caption ].subtree = firstPath
        makeListData(firstPath, filename, _caption)
      }
    })
  }

  makeListData(_path, _capt)
  return list
}
