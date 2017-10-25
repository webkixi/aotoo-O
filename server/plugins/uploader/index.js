import fs from 'fs'
import path from 'path'
import asyncBusboy from 'async-busboy';
import request from 'request'

function checkFiles(fields){
  let filterPicture = ['.jpg','.jpeg','.png','.gif']
  if (fields) {
    let ext = path.extname(fields.name)
    if (filterPicture.indexOf(ext)>-1) {
      return true
    }
  }
}

const up_root = CONFIG.plugins.upload.root
const up_prefix = CONFIG.plugins.upload.urlPrefix

// async function javaUploader(ctx, next){
//   if (!ctx.request.is('multipart/*')) return next()
//   const bodys = await getNewSignBody('uploader', {method: ' /fastdfs/upload.do'})
//   ctx.body = await ctx.req.pipe( request.post( src+'fastdfs/upload.do', bodys) )
// }

// node 本地上传
async function uploader(ctx, next){
  let fkp = ctx.fkp
  const {files, fields} = await asyncBusboy(ctx.req)

  // fields
  // {
  //   id: 'WU_FILE_0',
  // name: 'logo32.png',
  // type: 'image/png',
  // lastModifiedDate: 'Tue Nov 22 2016 23:31:02 GMT+0800 (CST)',
  // size: '2661'
  // }

  let filename
  , o_filename
  , path2save = up_root
  // , path2save = CONFIG.plugins.upload.root

  if (checkFiles(fields)) {
    filename = o_filename = fields.name
    filename = path.join(path2save, filename)
    let stream = fs.createWriteStream(filename)
    files[0].pipe(stream)
    ctx.body = {
      "state": "success",
      "url": path.join(up_prefix, o_filename),
      "original": o_filename,
      "message": o_filename
    }
  }
}

let defineMyupConfig = false
export default function(fkp){
  if (!defineMyupConfig) {

    fkp.statics(up_root, {
      dynamic: true,
      prefix: up_prefix
    })
    
    fkp.routepreset('/upup', {
      customControl: uploader
    })
    
    defineMyupConfig = true
  }

}
