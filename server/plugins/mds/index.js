import fs from 'fs'
const _ = require('lodash')
const glob = require('glob')
const md = require('./markdown')

class MarkdownDocs {
  constructor(opts={}){
    this.opts = opts
  }
  
  initFolderHome(){

  }

  category(){

  }

  getFolderInfo(_dir, opts){
    let tree = []
    let home = {
      title: '',
      desc: '',
      path: '',
      url: '',
      img: '',
      config: '',
      exist: false
    }

    function loopDir(dir, parent){
      glob.sync(dir).forEach( item => {
        const stat = fs.statSync(item) 
        const obj = path.parse(item)
        if (stat.isFile()) {
          const raw = fs.readFileSync(item)
          const fileInfo = md(raw, {})

          // 目录描述图
          if (obj.ext.indexOf(['jpg', 'jpeg', 'png', 'gif']) > -1) {
            if (obj.name == 'index') home.img = item
          }

          // 目录配置文件
          if (obj.name == 'config') {
            home.config = item
          }

          if (obj.ext == 'md') {
            // 目录首页
            if (obj.name == 'index') {
              home.title = obj.name
              home.desc = ''
              home.path = item
              home.url = obj.name
              home.exist = true
            } else {
              let feather = {
                title: obj.name,
                desc: '',
                path: item,
                url: obj.name
              }
              if (parent) {
                feather.parent = parent
              }
              tree.push(feather)
            }
          }
        }

        if (stat.isDirectory()) {
          let dirFeather = {
            title: obj.name,
            path: item,
            url: obj.name,
            idf: obj.name
          }
          if (parent) {
            dirFeather.parent = parent
          }
          tree.push(dirFeather)
          loopDir(item, obj.name)
        }
      })
    }

    if (dir && fs.existsSync(dir)) {
      loopDir(dir)
    }

    return {
      home: home,
      tree: tree
    }
  }

  folder(dir){
    let folder = {
      home: {
        path: '',
        img: '',
        config: '',
        url: ''
      },
      list: []
    }
    const opts = this.opts
    const home = this.getFolderInfo(dir, opts)
    
  }

  parse(){

  }
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

  return markdown
}
