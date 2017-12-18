const ENV = 'production';
let rootPrefix = '';
if (ENV === 'production') {
  rootPrefix = '/teatime';
}

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('teatime').then((cache) => {
      return cache.addAll([
        `${rootPrefix}/`,
        `${rootPrefix}/sw.js`,
        `${rootPrefix}/index.html`,
        `${rootPrefix}/teatime.css`,
        `${rootPrefix}/teatime.js`,
        `${rootPrefix}/audio/boiling_water_long.ogg`,
        `${rootPrefix}/audio/tim_tum.ogg`,
        `${rootPrefix}/images/cup_st.png`,
        `${rootPrefix}/images/cup_front.png`,
        `${rootPrefix}/images/cup_back.png`,
        `${rootPrefix}/images/arches.png`,
        `${rootPrefix}/images/arches_red.png`,
        `${rootPrefix}/images/uncheck.png`,
        `${rootPrefix}/images/check.png`,
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response === undefined) { console.log('could not find ', event.request.url); }
      return response || fetch(event.request);
    })
  );
});
