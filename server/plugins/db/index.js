// const db = CONFIG.db
const db = {
  site_admin: { login: 'webkixi' },
  select: 'mongo',    //  false or 'mongo/mysql', mongo 采用 mongoose ORM
  requiredFolder: {   //  自动注册数据库时，会检测注册目录下是否包含control目录和model目录，目录名在此指定
    control: 'pages', //  control目录名/ control directory key
    model: 'models'   //  model目录名/   model directory key
  },
  mongo: {
    url: "mongodb://127.0.0.1:27017/fkp",
    options: {
      db: { native_parser: true },
      server: { poolSize: 3 },
      replset: { rs_name: 'myReplicaSetName' },
    },
    pageSize: 20
  },
}

function mdb(ctx, folder){
  try {
    if (db && db.select) {
      let id = 'database/'+folder
      return Cache.ifid(id, async ()=>{
        let _database = await require('./'+db.select).default(ctx.fkp, folder, db.requiredFolder)
        if (_database) Cache.set(id, _database)
        return _database
      })
    }
    throw 'CONFIG.db.select 没有开启默认数据库'
  } catch (e) {
    console.log(e)
    return false
  }
}

export default async function(fkp){
  return mdb
}
