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
          if (obj.name == 'config' && parent) {
            parentObj.config = require(item)
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
                url: obj.name+obj.ext,
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
        Cache.set(fid, mdInfo, 144*60*60*1000)
        return mdInfo
      })
    }
  }

  folder(dir){
    if (dir && fs.existsSync(dir)) {
      return this.folderInfo(dir)
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
  return function(url, data){
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
    const imgurl = cov.home&&cov.home.img||'http://www.agzgz.com/docs/component/_home.jpg'
    let title = cov.title

    // 根据配置文件输出 
    if (cov.config) {

      // 输出title
      // 由于不支持中文目录，我们需要在配置文件中映射英文目录的中文描述
      if (cov.config.names) {
        const names = cov.config.names
        title = names[cov.title] ? names[cov.title] : title
      }
    }
    return {
      title: <img src={imgurl}/>,
      url: path.join(routePrefix, cov.url),
      body: [
        <div className="cover-title"><a href={path.join(routePrefix, cov.url)}>{title}</a></div>,
        <div className="cover-descript">{cov.home&&cov.home.descript||'还没有描述内容'}</div>,
      ]
    }
  })
  const homesJsx = Aotoo.list({ data: homes, listClass: 'covers-list' })
  const homesStr = Aotoo.render(<div className="covers">{homesJsx}</div>)

  return homesStr
}

const asset = {
  covers: function(){
    const cssContent = fs.readFileSync( path.join(__dirname, './statics/covers/index.css'), 'utf-8' )
    const jsContent = fs.readFileSync(  path.join(__dirname, './statics/covers/index.js'), 'utf-8' )

    const inject = Aotoo.inject
    .init()
    .css(['common', cssContent])
    .js(['common', jsContent])

    const cssAry = Object.keys(inject.staticList.css).map( item => inject.staticList.css[item] )
    const jsAry = Object.keys(inject.staticList.js).map( item => inject.staticList.js[item] )

    const cssStr = cssAry.join('\n')
    const jsStr = jsAry.join('\n')

    return {
      css: cssStr,
      js: jsStr
    }
  },

  category: function(){
    const cssContent = fs.readFileSync( path.join(__dirname, './statics/category/index.css'), 'utf-8' )
    const jsContent = fs.readFileSync(  path.join(__dirname, './statics/category/index.js'), 'utf-8' )

    const inject = Aotoo.inject
    .init()
    .css(['common', cssContent])
    .js(['common', jsContent])


    const cssAry = Object.keys(inject.staticList.css).map( item => inject.staticList.css[item] )
    const jsAry = Object.keys(inject.staticList.js).map( item => inject.staticList.js[item] )

    const cssStr = cssAry.join('\n')
    const jsStr = jsAry.join('\n')

    return {
      css: cssStr,
      js: jsStr
    }
  },

  detail: function(){
    const cssContent = fs.readFileSync( path.join(__dirname, './statics/detail/index.css'), 'utf-8' )
    const jsContent = fs.readFileSync(  path.join(__dirname, './statics/detail/index.js'), 'utf-8' )

    const inject = Aotoo.inject
    .init()
    .css(['common', cssContent])
    .js(['common', 't/prettfy', jsContent])

    const cssAry = Object.keys(inject.staticList.css).map( item => inject.staticList.css[item] )
    const jsAry = Object.keys(inject.staticList.js).map( item => inject.staticList.js[item] )

    const cssStr = cssAry.join('\n')
    const jsStr = jsAry.join('\n')

    return {
      css: cssStr,
      js: jsStr
    }
  }
}

function docs(ctx, next){
  const renderView = _renderView(ctx)
  const params = ctx.params
  const fkp = ctx.fkp
  let routePrefix = this.opts.prefix

  // 封面页 covers
  if (!params.cat) {
    const defaultDocsPath = path.join(__dirname, 'docs')
    const did = md5(defaultDocsPath)
    const renderData = Cache.ifid(did, ()=>{
      const homesStr = coversHome.call(this, mdIns.covers(defaultDocsPath))
      const statics = asset.covers()  // js css 静态资源
      const _renderData = {
        title: '封面页',
        mycss: statics.css,
        myjs: statics.js,
        covers: homesStr
      }
      Cache.set(did, _renderData, 1*60*60*1000)
      return _renderData
    })
    renderView('cover', renderData)
  } 
  else {
    const {p3, p2, p1, id, title, cat} = params
    let _docurl = '/docs'
    let docurl
    if (cat) _docurl = path.join(_docurl, cat)
    if (title) _docurl = path.join(_docurl, title)
    if (id) _docurl = path.join(_docurl, id)
    if (p1) _docurl = path.join(_docurl, p1)
    if (p2) _docurl = path.join(_docurl, p2)
    if (p3) _docurl = path.join(_docurl, p3)
    docurl = path.join(__dirname, _docurl)

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
        detail(fileInfo, folderInfo, _docurl, renderView)
      }

      if (folderInfo && !fileInfo) {
        category(folderInfo, _docurl, renderView)
      }
    }
  }
}

// 分类目录
function category(folderInfo, _docurl, renderView){
  const did = md5(_docurl)
  const renderData = Cache.ifid(did, ()=>{
    let home
    const tree = folderInfo.tree
    for (let ii=0;ii<tree.length;ii++) {
      const item = tree[ii]
      if (item.idf == 'root') {
        if (item.home) home = item.home
        if (item.config) {
          if (item.config.names) {
            const names = item.config.names
            item.title = names[item.title] ? names[item.title] : item.title
          }
        }
      } else {
        item.url = path.join(_docurl, item.url)
      }
    }
    if (!home) home = '该分类没有信息'
    const treeJsx = Aotoo.tree({ data: tree })
    const treeStr = Aotoo.render(treeJsx)
    const statics = asset.category()  // js css 静态资源
    const _renderData = {
      title: '分类页',
      mycss: statics.css,
      myjs: statics.js,
      tree: treeStr,
      home: home
    }

    Cache.set(did, _renderData, 1*60*60*1000)
    return _renderData
  })
  renderView('category', renderData)
}

function detail(fileInfo, folderInfo, _docurl, renderView){
  const did = md5(_docurl)
  const renderData = Cache.ifid(did, ()=>{
    /**
     * fileInfo
     * {
     *  title: '',
     *  descript: '',
     *  content: <>,
     *  imgs: [],
     *  img: '',
     *  menu: <>,
     *  params: {desc: ''}
     * }
     */
    const tree = folderInfo.tree
    for (let ii=0;ii<tree.length;ii++) {
      const item = tree[ii]
      if (item.idf == 'root') {
        if (item.config) {
          if (item.config.names) {
            const names = item.config.names
            item.title = names[item.title] ? names[item.title] : item.title
          }
        }
      }
    }
    const treeJsx = Aotoo.tree({ data: tree })
    const treeStr = Aotoo.render(treeJsx)
    // const statics = detailStatic()  // js css 静态资源
    const statics = asset.detail()  // js css 静态资源
    const _renderData = {
      title: fileInfo.title,
      descript: fileInfo.descript||'',
      mycss: statics.css,
      myjs: statics.js,
      tree: treeStr,
      menu: fileInfo.menu,
      content: fileInfo.content
    }

    Cache.set(did, _renderData, 1000*1*60*60)
    return _renderData
  })
  renderView('detail', renderData)
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
