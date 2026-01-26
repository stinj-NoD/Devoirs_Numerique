const CACHE_NAME = 'devoir-num-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './ui.js',
  './engines.js',
  './storage.js',
  './data/cp.json',
  './data/ce1.json',
  './data/ce2.json',
  './data/cm1.json',
  './data/cm2.json',
  './data/french_lib.json',
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap'
];

// Installation : Mise en cache des ressources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Stratégie : Cache d'abord, sinon Réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
