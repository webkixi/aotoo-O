var template
var fs = require('fs')
var path = require('path')
var glob = require('glob')

const gulp = require('gulp')
  , $ = require('gulp-load-plugins')()
  , workbox = require('workbox-build');

var TemplateEngine = function (html, options) {
  var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0, match;
  var add = function (line, js) {
    js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
      (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
    return add;
  }
  while (match = re.exec(html)) {
    add(html.slice(cursor, match.index))(match[1], true);
    cursor = match.index + match[0].length;
  }
  add(html.substr(cursor, html.length - cursor));
  code += 'return r.join("");';
  return new Function(code.replace(/[\r\t\n]/g, '/*--*/')).apply(options);
}

var installScriptTpl = `if (navigator.serviceWorker != null) {
  navigator.serviceWorker.register('sw.js', { scope: '/js' })
    .then(function (registration) {
      console.log('Registered events at scope: ', registration.scope);
    });
}`

function createEntryFile(params) {
  var reFormat = /\/\*\-\-\*\//g
  var pwaEntry = TemplateEngine(installScriptTpl, {})
  pwaEntry = pwaEntry.replace(reFormat, '\n')

  const regfile = path.join(params.dest, 'pwa.js')
  fs.writeFileSync(regfile, pwaResult)
}

function gulpServiceWorkJs(params) {
  gulp.task('generate-service-worker', () => {
    return workbox.generateSW({
    // return workbox.injectManifest({
      // swSrc: path.join(__dirname, 'pwa', 'sw.js') ,
      globDirectory: params.dist,
      globPatterns: ['**\/*.{html,js,css,jpeg,jpg,png,gif}'],
      swDest: `${params.dest}/sw.js`,
      clientsClaim: true,
      skipWaiting: true,
      // modifyUrlPrefix: {
      //   'css/' : '/css/',
      // },

      runtimeCaching: [
        {
          // Match any request ends with .png, .jpg, .jpeg or .svg.
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|md)$/,

          // Apply a cache-first strategy.
          handler: 'cacheFirst',

          options: {
            // Only cache 10 images.
            expiration: {
              maxEntries: 10,
            },
          },
        },
        {
          // Match any same-origin request that contains 'api'.
          urlPattern: /api/,
          // Apply a network-first strategy.
          handler: 'networkFirst',
          options: {
            // Fall back to the cache after 10 seconds.
            networkTimeoutSeconds: 10,
            // Use a custom cache name for this route.
            cacheName: 'my-api-cache',
            // Configure custom cache expiration.
            expiration: {
              maxEntries: 5,
              maxAgeSeconds: 60,
            },
            // Configure which responses are considered cacheable.
            cacheableResponse: {
              statuses: [0, 200],
              headers: { 'x-test': 'true' },
            },
            // Configure the broadcast cache update plugin.
            broadcastUpdate: {
              channelName: 'my-update-channel',
            },
            // Add in any additional plugin logic you need.
            plugins: [
              // { cacheDidUpdate: () => /* custom plugin code */}`
            ],
          },
        },
        // {
        //   // Match any request ends with .png, .jpg, .jpeg or .svg.
        //   urlPattern: function(params) {
        //     console.log('======== 8888');
        //     console.log(params);
        //     // return true
        //   },
        //   // Apply a cache-first strategy.
        //   handler: function (params) {
        //     console.log('======== 99999');
        //     console.log(params);
        //   }
        // },
      ],

      manifestTransforms: [
        (manifestEntries) => manifestEntries.map((entry) => {
          const obj = path.parse(entry.url)
          if(obj.ext && (obj.ext == '.js' || obj.ext == '.css')) {
            const rootPath = params.configs.public.js.replace(/(js|css)[\/]?$/, '')
            entry.url = path.join(rootPath, entry.url)
          }
          return entry
        })
      ],
    }).then(() => {
      console.info('Service worker generation completed.');
    }).catch((error) => {
      console.warn('Service worker generation failed: ' + error);
    });
  });

  gulp.start('generate-service-worker')

  return
}

function customServiceWorkJs(jsdir, colletion, configs) {
  const filename = path.join(jsdir, 'sw.js')
  const regfile = path.join(jsdir, '../html')

  const jsFiles = (function (params) {
    const __jsFiles = colletion.js
    return Object.keys(__jsFiles).map(function (item, ii) {
      return path.join(configs.public.js, __jsFiles[item])
    })
  })()

  const cssFiles = (function (params) {
    const __cssFiles = colletion.css
    return Object.keys(__cssFiles).map(function (item, ii) {
      return path.join(configs.public.css, __cssFiles[item])
    })
  })()

  const htmlFiles = (function (params) {
    const __htmlFiles = colletion.html
    return Object.keys(__htmlFiles).map(function (item, ii) {
      return path.join('/', __htmlFiles[item])
    })
  })()

  const imagesFiles = (function (params) {
    const __imagesFiles = colletion.images
    return Object.keys(__imagesFiles).map(function (item, ii) {
      return path.join('/images', __imagesFiles[item])
    })
  })()

  const cacheFiles = [...jsFiles, ...cssFiles, ...htmlFiles, ...imagesFiles]
  const cacheFilesStr = JSON.stringify(cacheFiles)

  const filepath = path.join(__dirname, 'pwatemplate.tpl')
  var content = fs.readFileSync(filepath, 'utf-8')
  var result = TemplateEngine(content, { myCacheList: cacheFilesStr })

  var reFormat = /\/\*\-\-\*\//g
  result = result.replace(reFormat, '\n')

  fs.writeFileSync(filename, result)

  return
}

module.exports = {
  gulpServiceWorkJs,
  customServiceWorkJs
}