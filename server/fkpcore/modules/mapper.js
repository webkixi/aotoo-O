import fs from 'fs'
// 从map.json拿取获取静态资源 hash 名称
const getMapJson = () => {
  let mode = process.env.NODE_ENV
  let mapFilePath = CONFIG.mapDevJson
  if (mode === 'production'){
    mapFilePath = CONFIG.mapJson
  }
  if (fs.existsSync(mapFilePath)){
    return require(mapFilePath)
  }
}


//设置全局变脸_mapper
let getMapper = () => {
	let _mapper = getMapJson();
  if (_mapper) {
    _mapper.commonJs = _mapper.js.common
    _mapper.commonCss = _mapper.css.common
    _mapper.pageJs = _mapper.js
    _mapper.pageCss = _mapper.css
    _mapper.length = Object.keys(_mapper).length
  }
  CONFIG.mapper = _mapper
  return _mapper
}

module.exports = getMapper()
