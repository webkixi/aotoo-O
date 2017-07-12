import fs from 'fs'
import md5 from 'blueimp-md5'
const _ = require('lodash')
const glob = require('glob')
const md = require('./markdown')
const path = require('path')

class MarkdownDocs {
  constructor(opts={}){
    this.opts = opts
  }

  folderInfo(_dir){
    let tree = []
    let home = {
      title: '',
      descript: '',
      path: '',
      url: '',
      img: '',
      config: '',
      exist: false
    }

    const opts = this.opts
    const that = this

    function loopDir($dir, parent){
      const dir = $dir+'/*'
      glob.sync(dir).forEach( item => {
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
          loopDir(item, parentId)
        }
      })
    }

    loopDir(_dir)
    return { home, tree }
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
          covers.push(this.folder(item))
        }
      })
    }
    return covers
  }
}

const mdIns = new MarkdownDocs({

})


function docs(ctx, next){
  const params = ctx.params
  let routePrefix = this.opts.prefix

  if (!params.cat) {
    const defaultDocsPath = path.join(__dirname, 'docs')
    const covers = mdIns.covers(defaultDocsPath)
    
    const homes = []
    covers.forEach( cov => {
      let leaf;
      if (!cov.home.exist) {
        for (let ii=0; ii<cov.tree.length; ii++) {
          leaf = cov.tree[ii]
          if (!leaf.idf) {
            break;
          }
        }
      } else {
        leaf = cov.home
      }
      delete leaf.parent
      console.log(leaf);
      homes.push(leaf)
    })

    const homesJsx = Aotoo.list({ data: homes, listClass: 'covers-list' })
    const homesCover = (
      <div className="covers">
        {homesJsx}
      </div>
    )
    const homesStr = Aotoo.render(homesCover)
    const renderData = {
      title: 'abc',
      commoncss: '1111',
      commonjs: '2222',
      pagejs: 'xxxx',
      covers: homesStr
    }

    const tempPath = path.join(__dirname, './views/cover.html')
    const temp = fs.readFileSync(tempPath, 'utf-8')
    const compiled = _.template(temp)
    ctx.body = compiled(renderData)
  } else {
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
