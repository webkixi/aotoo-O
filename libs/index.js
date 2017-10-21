import base from './common/base'
import time from './common/time'

const isClent = typeof window != 'undefined'

function libs(){
  if (!isClent) {
    return {
      ...base,
      ...time
    }
  } else {
    const app = require('./common/app')
    const docs = require('./common/docs')
    const url = require('./common/url')
    return {
      ...base,
      ...time,
      ...app,
      ...docs,
      ...url
    }
  }
}

export default libs()