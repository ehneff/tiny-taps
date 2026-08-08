// Neffster service worker — network-first, cache-fallback, with
// proactive pre-caching of every game so offline support doesn't
// depend on having opened each game individually first.
//
// - On install: fetch games.json and cache every game's HTML,
//   manifest, and icons, plus the hub's own core assets.
// - On every hub visit (while online), the hub sends a REFRESH_ALL
//   message so every game's cache gets checked and updated in one
//   place — a game doesn't need to be individually opened again for
//   its update to reach a device that's already installed.
// - Each game folder has its own version.txt. Before re-fetching a
//   game's assets, its version.txt is fetched fresh and compared to
//   the cached copy — if unchanged, that game's HTML/manifest/icons
//   are left alone (saves bandwidth on every hub visit). If a game
//   has no version.txt, it's always refreshed, so this is opt-in
//   safe: forgetting to add one just means "always refresh."
//   IMPORTANT: bump a game's version.txt whenever its files change,
//   or already-installed offline devices won't pick up the change
//   via this background refresh (opening that game directly while
//   online still always fetches the latest version regardless).
// - Any other request (a game opened directly, an asset not in the
//   lists below) still falls back to normal network-first-then-cache
//   per-request caching.
//
// New games don't need anything added here — they're picked up
// automatically from games.json.

var CACHE_NAME = 'neffster-v1';

var CORE_ASSETS = [
  'index.html',
  'hub-manifest.json',
  'games.json',
  'parental-controls.html',
  'icon-192.png',
  'icon-512.png',
  'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700&display=swap'
];

function gameDir(game){
  return game.path.substring(0, game.path.lastIndexOf('/') + 1);
}
function gameAssetPaths(game){
  var dir = gameDir(game);
  return [ game.path, dir + 'manifest.json', dir + 'icon-192.png', dir + 'icon-512.png' ];
}

function cacheAll(urls, cache){
  return Promise.all(urls.map(function(url){
    return fetch(url, { cache: 'reload' }).then(function(resp){
      if(resp && resp.ok) return cache.put(url, resp);
    }).catch(function(){ /* offline, or a game's assets briefly unavailable — leave existing cache entry alone */ });
  }));
}

function refreshGameIfChanged(game, cache){
  var versionURL = gameDir(game) + 'version.txt';
  return Promise.all([
    fetch(versionURL, { cache: 'reload' }).then(function(r){ return r.ok ? r.text() : null; }).catch(function(){ return null; }),
    cache.match(versionURL).then(function(r){ return r ? r.text() : null; })
  ]).then(function(results){
    var freshVersion = results[0] === null ? null : results[0].trim();
    var cachedVersion = results[1] === null ? null : results[1].trim();
    if(freshVersion !== null && freshVersion === cachedVersion){
      return; // this game hasn't changed — skip re-fetching it
    }
    var urls = gameAssetPaths(game);
    if(freshVersion !== null) urls = urls.concat([versionURL]);
    return cacheAll(urls, cache);
  });
}

function refreshEverything(){
  return caches.open(CACHE_NAME).then(function(cache){
    return cacheAll(CORE_ASSETS, cache).then(function(){
      return fetch('games.json', { cache: 'reload' }).then(function(r){ return r.json(); }).then(function(games){
        return Promise.all(games.map(function(g){ return refreshGameIfChanged(g, cache); }));
      });
    });
  }).catch(function(){ /* fully offline — nothing to prefetch, per-request fallback still covers what's already cached */ });
}

self.addEventListener('install', function(event){
  self.skipWaiting();
  event.waitUntil(refreshEverything());
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

self.addEventListener('message', function(event){
  if(event.data && event.data.type === 'REFRESH_ALL'){
    event.waitUntil(refreshEverything());
  }
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
