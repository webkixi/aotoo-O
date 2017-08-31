import fs from 'fs'
import _ from 'lodash'
import path from 'path'

export default function(ctx){
  return function(url, data){
    const fkp = ctx.fkp
    const tempPath = path.join(__dirname, `../views/${url}.html`)
    const temp = fs.readFileSync(tempPath, 'utf-8')
    ctx.body = fkp.template(temp, data)
  }
}