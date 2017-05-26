let libs = require('libs')
let fs = require('fs')
let path = require('path')
let mongoose = require("mongoose")
let Schema = mongoose.Schema

// 用户自增id, seq为自增变量
// 如果其他文档需要自增id的字段，在u_seq后增加
var IncreaseSchema = new Schema({
  _id: {type: String, required: true},
  u_seq: { type: Number, default: 0 }
});

let connectState
async function connect(){
  try {
    if (connectState) return true
    connectState = await require('./common/connect').default()
    if (connectState) {
      var Increase = mongoose.model('Increase', IncreaseSchema);
      let _id = await Increase.findOne({_id: 'Increase'}).exec()
      if (!_id) {
        new Increase({_id: 'Increase', u_seq: 0}).save()
      }
      return connectState
    } else {
      throw '数据库没有连接'
    }
} catch (e) {
    console.log(e)
    return false
  }
}

export default async function(fkp, folder, requiredFolder){
  try {
    await connect()
    let $folder = await fkp.fileexist(folder)
    if ($folder.isDirectory()) {
      let dirs = (await fkp.readdir(folder) || []).filter((x) => Object.values(requiredFolder).includes(x))
      if (dirs.length>1) {
        return registerModel(fkp, {
          control: path.join(folder, requiredFolder.control),
          model: path.join(folder, requiredFolder.model)
        })
      }
      throw '请指定正确的control目录和model目录，参考config.db.requiredFolder'
    }
    throw '请指定正确的control目录和model目录, 参考config.db.requiredFolder'
  } catch (e) {
    console.log(e)
    return false
  }
}

function _db(fkp){
  this.fkp = fkp
}

// 注册model
async function registerModel(fkp, options){
  fs.readdirSync(options.model).forEach(function(file) {
    if (~file.indexOf(".js")) require(options.model + "/" + file)
  })
  return await registerControl(fkp, options)
}

// 注册control
async function registerControl(fkp, options){
  let ctrlfiles = (await fkp.readdir(options.control)||[]).map( ctrlfile => {
    if (~ctrlfile.indexOf(".js")) {
      let filename = ctrlfile.replace('.js', '')
      _db.prototype[filename] = require( path.join(options.control, ctrlfile) ).default
    }
  })
  if (ctrlfiles && ctrlfiles.length) return new _db(fkp)
}
