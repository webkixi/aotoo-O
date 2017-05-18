const db = CONFIG.db

export default async function(ctx, folder){
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
