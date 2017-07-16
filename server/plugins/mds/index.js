import fs from 'fs'
import md5 from 'blueimp-md5'
const _ = require('lodash')
const glob = require('glob')
const md = require('./markdown')
const path = require('path')


function getHomeStruct(){
  return {
    title: '',
    descript: '',
    path: '',
    url: '',
    img: '',
    config: '',
    exist: false
  }
}

class MarkdownDocs {
  constructor(opts={}){
    this.opts = opts
  }

  folderInfo(_dir){
    const opts = this.opts
    const that = this
    let tree = []

    const rootobj = path.parse(_dir)
    let rootFeather = {
      title: rootobj.name,
      path: _dir,
      url: rootobj.name,
      idf: 'root'
    }
    tree.push(rootFeather)

    function loopDir($dir, parent, parentObj){
      $dir = $dir+'/*'
      let home = getHomeStruct()
      glob.sync($dir).forEach( item => {
        const stat = fs.statSync(item) 
        const obj = path.parse(item)
        if (stat.isFile()) {
          const raw = fs.readFileSync(item, 'utf-8')
          // const mdInfo = md(raw, {})

          // 目录描述图
          if (['.jpg', '.jpeg', '.png', '.gif'].indexOf(obj.ext)>-1) {
            if (obj.name == 'index') home.img = item
          }

          // 目录配置文件
          if (obj.name == 'config') {
            // home.config = item
            home.config = require(item)
          }

          if (obj.ext == '.md') {
            const mdInfo = that.file(item)
            
            // 目录首页
            if (obj.name == 'index') {
              home.title = mdInfo.title
              home.descript = mdInfo.descript
              home.path = item
              home.url = obj.name
              home.img = home.img ? home.img : mdInfo.img
              home.imgs = mdInfo.imgs
              home.exist = true

              if (parent) {
                parentObj.home = home
              }
            } else {
              let feather = {
                title: mdInfo.title,
                descript: mdInfo.descript,
                path: item,
                url: obj.name,
                img: mdInfo.img,
                imgs: mdInfo.imgs
              }
              if (parent) {
                feather.parent = parent
              }
              tree.push(feather)
            }
          }
        }

        if (stat.isDirectory()) {
          const parentId = _.uniqueId(obj.name+'_')
          let dirFeather = {
            title: obj.name,
            path: item,
            url: obj.name,
            idf: parentId
          }
          if (parent) {
            dirFeather.parent = parent
          }
          tree.push(dirFeather)
          loopDir(item, parentId, dirFeather)
        }
      })
    }

    loopDir(_dir, 'root', rootFeather)
    return {tree}
    // return { home, tree }
  }

  parse(raw, opts){
    return md(raw, opts)
  }

  file(filename){
    const opts = this.opts
    if (fs.existsSync(filename)) {
      const fid = md5(filename)
      return Cache.ifid(fid, function(){
        const raw = fs.readFileSync(filename, 'utf-8')
        const mdInfo = md(raw, opts)
        Cache.set(fid, mdInfo, 1000*1*60*60)
        return mdInfo
      })
    }
  }

  folder(dir){
    if (dir && fs.existsSync(dir)) {
      const did = md5(dir)
      return Cache.ifid(did, ()=>{
        const dirObj = path.parse(dir)
        const info = this.folderInfo(dir)
        Cache.set(did, info, 1000*1*60*60)
        return info
      })
    }
  }

  covers(dir){
    let covers = []
    if (dir && fs.existsSync(dir)) {
      glob.sync(dir).forEach( item => {
        const stat = fs.statSync(item) 
        if (stat.isDirectory()) {
          const covs = this.folder(item).tree
          covs.forEach( $cov=>{
            if ($cov.parent == 'root' && $cov.idf) covers.push($cov)
          }) 
        }
      })
    }
    return covers
  }
}

const mdIns = new MarkdownDocs({})

function _renderView(ctx){
  return function(url,data){
    const fkp = ctx.fkp
    const tempPath = path.join(__dirname, `./views/${url}.html`)
    const temp = fs.readFileSync(tempPath, 'utf-8')
    ctx.body = fkp.template(temp, data)
  }
}

// 封面页结构
function coversHome(covs){
  const routePrefix = this.opts.prefix
  const homes = covs.map( cov => {
    const imgurl = cov.home&&cov.home.img||'/'
    return {
      title: <img src={imgurl}/>,
      url: path.join(routePrefix, cov.url),
      body: [
        <div className="cover-title"><a href={path.join(routePrefix, cov.url)}>{cov.title}</a></div>,
        <div className="cover-descript">{cov.home&&cov.home.descript||'还没有描述内容'}</div>,
      ]
    }
  })
  const homesJsx = Aotoo.list({ data: homes, listClass: 'covers-list' })
  const homesStr = Aotoo.render(<div className="covers">{homesJsx}</div>)

  return homesStr
}

// 封面页的静态文件
function coversStatic(){
  const myScript = `
    console.log('======1111')
    console.log('======1111')
    console.log($)
  `
  const inject = Aotoo.inject
  .css(['common'])
  .js(['common', myScript])
  const cssAry = Object.keys(inject.staticList.css).map( item => inject.staticList.css[item] )
  const jsAry = Object.keys(inject.staticList.js).map( item => inject.staticList.js[item] )

  const cssStr = cssAry.join('\n')
  const jsStr = jsAry.join('\n')

  return {
    css: cssStr,
    js: jsStr
  }
}

function docs(ctx, next){
  const renderView = _renderView(ctx)
  const params = ctx.params
  const fkp = ctx.fkp
  let routePrefix = this.opts.prefix

  if (!params.cat) {
    const defaultDocsPath = path.join(__dirname, 'docs')
    const homesStr = coversHome.call(this, mdIns.covers(defaultDocsPath))
    const statics = coversStatic()  // js css 静态资源
    const renderData = {
      title: 'abc',
      mycss: statics.css,
      myjs: statics.js,
      covers: homesStr
    }
    renderView('cover', renderData)
  } 
  else {
    const {p3, p2, p1, id, title, cat} = params
    let docurl = path.join(__dirname, 'docs')
    if (cat) docurl = path.join(docurl, cat)
    if (title) docurl = path.join(docurl, title)
    if (id) docurl = path.join(docurl, id)
    if (p1) docurl = path.join(docurl, p1)
    if (p2) docurl = path.join(docurl, p2)
    if (p3) docurl = path.join(docurl, p3)

    if (fs.existsSync(docurl)) {
      const obj = path.parse(docurl)
      const stat = fs.statSync(docurl)
      let folderInfo, fileInfo
      if (stat.isFile()) {
        folderInfo = mdIns.folder(obj.dir)
        fileInfo = mdIns.file(docurl)
      } 
      else if (stat.isDirectory()) {
        folderInfo = mdIns.folder(docurl)
      } else {
        const _docurl = docurl+'.md'
        const _stat = fs.statSync(_docurl)
        if (_stat.isFile()) {
          folderInfo = mdIns.folder(obj.dir)
          fileInfo = mdIns.file(docurl)
        }
      }

      if (fileInfo && folderInfo) {

      }

      if (folderInfo && !fileInfo) {
        const tree = folderInfo.tree
        const home = folderInfo.home
      }
    }
  }
}

function pluginDocs(ctx, opts={}){
  return new MarkdownDocs(opts)
}

export default function(fkp){
  fkp.routepreset('/docs', {
    get: [
      '/',
      '/:cat',
      '/:cat/:title',
      '/:cat/:title/:id',
      '/:cat/:title/:id/:p1',
      '/:cat/:title/:id/:p1/:p2',
      '/:cat/:title/:id/:p1/:p2/:p3'
    ],
    post: [ '/', '/:cat', '/:cat/:title', '/:cat/:title/:id' ],
    customControl: docs
  })

  return pluginDocs
}
