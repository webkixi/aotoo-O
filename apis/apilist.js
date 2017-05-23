let src = CONFIG.apis.apiip + CONFIG.apis.port;
function getApiPath() {
  return {
    base: src,
    dirs: { },
    list: {
      163: 'http://www.163.com'
    }
  }
}

module.exports = getApiPath
