require('babel-core/register')
require("babel-polyfill")
var nodemon = require('nodemon');

// webpack -d 开发模式
// webpack -p 生产模式
// webpack -n 只启动开发node端

/**
 * yarn run dev
 * yarn run dev-clean
 * yarn run build
 * yarn run build-clean
 * yarn run fed
 * yarn run node
 * 
 * yarn run dev -- --port 8080
 * yarn run dev -- --eval    ==> 产出 cheap-eval-module-source-map
 */
var argv = process.argv.slice(2)
var margv = require('minimist')(argv);
var path = require('path')
var os = require('os')
var fs = require('fs')
var platform = os.platform()
var del = require('del')

process.env.NODE_ENV = 'production'
process.env.margv = JSON.stringify(margv)
if (argv.length) {
  if (margv.f) process.env.NODE_ENV = 'development'   // only FED precompilation with watch FED file, webpack-dev-server provides the service
  if (margv.d) process.env.NODE_ENV = 'development'   // FED precompilation and start node service with watch FED and node file
  if (margv.n) process.env.NODE_ENV = 'development'   // after the FED precompilation is complete, just start the node service with watch node file

  if (margv.p) process.env.NODE_ENV = 'production'
}

var buildConfig = require('./build')
var firstBuild = true
function activationServer(buildc) {
  if (margv.f) {
    buildc(false, {
      serviceType: margv
    })
    return
  }

  if (margv.p) {
    buildc(false, {
      serviceType: margv
    })
    return
  }
  
  // npm run node -- --port 8080
  const envConfigFile = margv.config
  const configs = require('./configs')(envConfigFile)

  // 创建软链接，指向正确版本的目标文件夹
  function creatStaticSoftLink() {
    const version = configs.version
    const VERSIONPATH = path.join(__dirname, './dist/out', version, (process.env.NODE_ENV == 'development' ? 'dev' : ''))
    const OUTROOTPATH = configs.static.root

    const targetPath = path.join(OUTROOTPATH, 'target')
    if (!fs.existsSync(VERSIONPATH)){
      return false
    }
    del.sync([targetPath], { force: true })
    os.platform() == 'win32'
      ? fs.symlinkSync(VERSIONPATH, targetPath, 'junction')
      : fs.symlinkSync(VERSIONPATH, targetPath)
  }
  // creatStaticSoftLink()

  if (process.env.NODE_ENV == 'development') {
    let serverIndex = 'node --harmony ./server/index.js';
    if (margv.n) {
      serverIndex += ' -n'
    }
    if (margv.port) {
      serverIndex += ' --port ' + margv.port
    }
    // let serverIndex = margv.port
    //   ? "node --harmony ./server/index.js --port " + margv.port
    //   : margv.n
    //     ? 'node --harmony ./server/index.js --port ' + configs.port
    //     : 'node --harmony ./server/index.js '

    if (envConfigFile) {
      serverIndex += ' --config ' + envConfigFile
    }

    if (margv.version) {
      serverIndex += ' --version ' + margv.version
    }

    nodemon({
      "execMap": {
        "js": serverIndex
      },
      "script": './server/index.js',
      "ext": 'js json jsx css html md',
      "restartable": "rs",
      "verbose": true,
      "ignore": [
        "public/*",
        "dist/*",
        ".git/*",
        // "node_modules/*",
        "*.db"
      ],
      "watch": [
        "apis/*",
        "server/*"
      ],
    });

    nodemon.on('start', function () {
      if (firstBuild && buildc) {
        console.log('App has started');
        if (margv.n) {
          /** only node support service */
        }
        else {
          buildc(nodemon, {
            serviceType: margv
          })
        }
      }
    })

      .on('quit', function () {
        console.log('App has quit');
        process.exit();
      })

      .on('restart', function (files) {
        firstBuild = false
        if (!files) {
          return false
        }
        console.log('App restarted due to: ', files);
      });
  }
  else {
    require('./server/index')
  }
}

// activationServer()
activationServer(buildConfig)
