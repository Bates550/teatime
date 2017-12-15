self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('teatime').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/teatime.css',
        '/teatime.js',
        '/audio/boiling_water_long.ogg',
        '/audio/tim_tum.ogg',
        '/images/cup_st.png',
        '/images/cup_front.png',
        '/images/cup_back.png',
        '/images/arches.png',
        '/images/arches_red.png',
        '/images/uncheck.png',
        '/images/check.png',
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response === undefined) { console.log('could not find ', event.request.url); }
      return response || fetch(event.request);
    })
  );
});
