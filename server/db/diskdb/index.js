import fs from 'fs'
import diskdb from 'diskdb'
import Path from 'path'

// const dbpath = Path.join(__dirname, 'server/db/diskdb/collections')
const dbpath = Path.join(__dirname, 'collections')
if (!fs.existsSync(dbpath)) {
  fs.mkdirSync(dbpath, '0777')
}


function mkdirsSync(dirpath, mode) {
  mode='0777'
  if (!fs.existsSync(dirpath)) {
    var pathtmp;
    let dirs = dirpath.split(Path.sep).filter( dirname => !!dirname )
    dirs.map( dirname => {
      if (pathtmp) pathtmp = Path.join(pathtmp, dirname)
      else {
        pathtmp = dirname;
      }
      if (!fs.existsSync(pathtmp)) {
        if (!fs.mkdirSync(pathtmp, mode)) {
          return false;
        }
      }
    })
  }
  return true;
}

// function mkdir(directory){
//   const _path = Path.join(dbpath, directory)
//   if (!fs.existsSync(_path)) {
//     fs.mkdirSync(_path, '0777')
//   }
// }

function createDataBase(_path, collections){
  const db = diskdb.connect(_path);
  collections = [].concat(collections)
  db.loadCollections(collections)
  return db
}

class _localDB {
  constructor(collections, databasePath) {
    this.collections = collections
    const db = createDataBase(databasePath, collections)
    this.control = db[collections]
  }

  count(){
    return this.control.count()
  }

  find(query){
    if (!query) this.control.find()
    return this.control.find(query)
  }

  findOne(query){
    if (!query) return this.control.findOne()
    return this.control.findOne(query)
  }

  update(query, dataToBeUpdate, opts){
    const dft = Object.assign({}, {multi: false, upsert: false}, opts)
    return this.control.update(query, dataToBeUpdate, dft)
  }

  set(articls){
    const count = this.count()
    articls.id = count
    this.control.save(articls)
  }

  get(query){
    return this.control.findOne(query)
  }

  remove(query, delAll){
    if (query) {
      this.control.remove(query, delAll)
    } else {
      this.control.remove()
    }
  }

  removeAll(query){
    this.remove((query||{}), true)
  }

  clear(){
    this.remove()
  }
}

export default function localDB(collections) {
  let databasePath = dbpath
  const oldCollections = collections
  if (typeof collections == 'string') {
    if (collections.indexOf('/') > 0 ) {
      const parts = collections.split('/')
      collections = parts.pop()
      if (parts.length) {
        databasePath = Path.join(dbpath, parts.join('/') )
        if (!fs.existsSync(databasePath)){
          mkdirsSync(databasePath)
        }
      }
    }

    const $id = 'LocalDB_' + oldCollections
    return Cache.ifid($id, function(){
      try {
        const ldb = new _localDB(collections, databasePath)
        Cache.set($id, ldb)
        return ldb
      } catch (e) {
        console.log(e);
      }
    })
  }
}
