var cacheStorageKey = 'minimal-pwa-1';
var cacheList = <% this.myCacheList %>;
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheStorageKey)
    .then( function(cache) { return cache.addAll(cacheList)})
    .then(function() {self.skipWaiting()})
  )
})

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      /* console.log(self.controller); */
      if (response != null) {
        return response;
      }
      return fetch(e.request.url);
    })
  )
})