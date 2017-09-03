import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import md5 from 'blueimp-md5'
import MarkdownDocs from './common/markdowndocs'
import MyRender from './common/render'

const MarkdownIns = new MarkdownDocs({})
const DOCS_ABS_ROOT = path.join(__dirname, './docs')
const DOCS_RLA_ROOT = './docs'

/**
 * 封面页
 * 1. 分析指定目录下的所有一级目录
 * 2. 获取一级目录的描述信息
 * @param {*} docsRoot 绝对路径
 * 
 * [ { title: '10aotoo',
    path: '/Users/yc/git/rezero/server/plugins/mds/docs/10aotoo',
    url: '10aotoo',
    idf: '10aotoo_1',
    parent: 'root',
    home: 
     { title: '',
       descript: '',
       path: '',
       url: '',
       img: '/Users/yc/git/rezero/server/plugins/mds/docs/10aotoo/index.jpg',
       config: '',
       exist: false },
    config: { names: [Object], descript: [Object] } } ......]
 */
function coversHome(docsRoot){
  const routePrefix = this.opts.prefix
  const did = md5(docsRoot)
  return Cache.ifid(did, ()=>{
    const covs = MarkdownIns.covers(docsRoot)
    const homeCoversConfig = covs.map( cov => {
      var covTitle = cov.title
      var covDescripts = cov.home&&cov.home.descript||'还没有描述内容'
      var imgurl = cov.home&&cov.home.img||'http://www.agzgz.com/docs/component/_home.jpg'
      if (imgurl.indexOf('/')==0) imgurl = imgurl.replace(DOCS_ABS_ROOT, '/mddocs')
      
      // 从配置文件读取该封面的属性信息
      if (cov.config) {
        // 将英文目录名映射为中文目录名
        if (cov.config.names) {
          const names = cov.config.names
          covTitle = names[covTitle] ? names[covTitle] : covTitle
        }

        if (cov.config.descript) {
          const covConfigDescripts = cov.config.descript
          covDescripts = covConfigDescripts[cov.title] ? covConfigDescripts[cov.title] : covDescripts
        }
      }
      return {
        title: <img src={imgurl}/>,
        url: path.join(routePrefix, cov.url),
        body: [
          <div className="cover-title"><a href={path.join(routePrefix, cov.url)}>{covTitle}</a></div>,
          <div className="cover-descript">{covDescripts}</div>,
        ]
      }
    })
    const homesJsx = Aotoo.list({ data: homeCoversConfig, listClass: 'covers-list' })
    const homesStr = Aotoo.render(<div className="covers">{homesJsx}</div>)
    const statics = asset.covers()  // js css 静态资源
    const _renderData = {
      title: '文档分类',
      mycss: statics.css,
      myjs: statics.js,
      covers: homesStr
    }
    Cache.set(did, _renderData, 1*60*60*1000)
    return _renderData
  })
}

/**
 * 分类页
 * 展示封面页的子项
 * @param {*} folderInfo 分类页数据
 * @param {*} _docurl 分类页相对路径
 * @param {*} renderView render方法
 */
function category(folderInfo, _docurl, renderView){
  const did = md5(_docurl)
  const renderData = Cache.ifid(did, ()=>{
    let home, homeJsx, homeStr
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
        item.url = path.join('/', _docurl, item.url)
      }
    }
    if (!home) homeStr = '该分类没有信息'
    else {
      if (home.descript) home.body = [ {title: home.descript} ] 
      if (home.img) home.img = home.img.replace(DOCS_ABS_ROOT, '/mddocs') 
      homeJsx = Aotoo.item({ data: home })
      homeStr = Aotoo.render(homeJsx)
    }
    
    const treeJsx = Aotoo.tree({ data: tree })
    const treeStr = Aotoo.render(treeJsx)
    const statics = asset.category()  // js css 静态资源
    const _renderData = {
      title: '分类页',
      mycss: statics.css,
      myjs: statics.js,
      tree: treeStr,
      home: homeStr
    }

    Cache.set(did, _renderData, 1*60*60*1000)
    return _renderData
  })

  renderView('category', renderData)
}

// 详情页
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

// 注入静态资源
const inject = Aotoo.inject.init()
const MD_DOCS_STATICS = {
  covers: {
    js: fs.readFileSync(  path.join(__dirname, './statics/covers/index.js'), 'utf-8' ),
    css: fs.readFileSync( path.join(__dirname, './statics/covers/index.css'), 'utf-8' )
  },

  category: {
    js: fs.readFileSync(  path.join(__dirname, './statics/category/index.js'), 'utf-8' ),
    css: fs.readFileSync( path.join(__dirname, './statics/category/index.css'), 'utf-8' )
  },

  detail: {
    js: fs.readFileSync(  path.join(__dirname, './statics/detail/index.js'), 'utf-8' ),
    css: fs.readFileSync( path.join(__dirname, './statics/detail/index.css'), 'utf-8' )
  }
}
const asset = {
  covers: function(){
    const cssContent = MD_DOCS_STATICS.covers.css
    const jsContent = MD_DOCS_STATICS.covers.js
    // const cssContent = fs.readFileSync( path.join(__dirname, './statics/covers/index.css'), 'utf-8' )
    // const jsContent = fs.readFileSync(  path.join(__dirname, './statics/covers/index.js'), 'utf-8' )

    inject
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
    const cssContent = MD_DOCS_STATICS.category.css
    const jsContent = MD_DOCS_STATICS.category.js

    inject
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
    const cssContent = MD_DOCS_STATICS.detail.css
    const jsContent = MD_DOCS_STATICS.detail.js

    inject
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
  const renderView = MyRender(ctx)
  const params = ctx.params
  const fkp = ctx.fkp
  let routePrefix = this.opts.prefix

  // 封面页 covers 首页
  if (!params.cat) {
    const renderData = coversHome.call(this, DOCS_ABS_ROOT)
    renderView('cover', renderData)
  } 
  else {
    const {p3, p2, p1, id, title, cat} = params
    let _docurl = DOCS_RLA_ROOT
    if (cat) _docurl = path.join(_docurl, cat)
    if (title) _docurl = path.join(_docurl, title)
    if (id) _docurl = path.join(_docurl, id)
    if (p1) _docurl = path.join(_docurl, p1)
    if (p2) _docurl = path.join(_docurl, p2)
    if (p3) _docurl = path.join(_docurl, p3)
    
    const docurl = path.join(__dirname, _docurl)

    if (fs.existsSync(docurl)) {
      const obj = path.parse(docurl)
      const stat = fs.statSync(docurl)
      let folderInfo, fileInfo
      if (stat.isFile()) {
        folderInfo = MarkdownIns.folder(obj.dir)
        fileInfo = MarkdownIns.file(docurl)
      } 
      else if (stat.isDirectory()) {
        folderInfo = MarkdownIns.folder(docurl)
      } else {
        const _docurl = docurl+'.md'
        const _stat = fs.statSync(_docurl)
        if (_stat.isFile()) {
          folderInfo = MarkdownIns.folder(obj.dir)
          fileInfo = MarkdownIns.file(docurl)
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



function pluginDocs(ctx, opts={}){
  return new MarkdownDocs(opts)
}

export default function(fkp){
  const mdDocs = path.join(__dirname, 'docs')
  fkp.statics(mdDocs, {
    dynamic: true,
    prefix: '/mddocs'
  })
  
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
