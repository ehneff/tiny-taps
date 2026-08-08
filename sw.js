// Neffster service worker — network-first, cache-fallback.
//
// Whatever page/game is visited while online gets cached. If a later
// fetch fails (offline), the cached copy is served instead. New games
// and pages don't need anything added here — visiting them once while
// online is enough to make them available offline afterward.
//
// Bump CACHE_NAME if the caching strategy itself changes and old
// cached entries need to be cleared out.
var CACHE_NAME = 'neffster-v1';

self.addEventListener('install', function(event){
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(
        names
          .filter(function(name){ return name !== CACHE_NAME; })
          .map(function(name){ return caches.delete(name); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event){
  if(event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).then(function(response){
      var copy = response.clone();
      caches.open(CACHE_NAME).then(function(cache){
        cache.put(event.request, copy);
      });
      return response;
    }).catch(function(){
      return caches.match(event.request);
    })
  );
});
