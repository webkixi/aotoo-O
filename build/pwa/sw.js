importScripts('workbox-sw.prod.v2.1.3.js');
const workboxSW = new self.WorkboxSW({
  "skipWaiting": true,
  "clientsClaim": true
});

workboxSW.router.registerRoute(/(.*)\.(?:js|css|png|gif|jpg|svg)/,
  workboxSW.strategies.cacheFirst()
);

workboxSW.precache([]);