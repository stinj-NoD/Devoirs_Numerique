const CACHE_NAME = 'devoirs-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './js/app.js',
  './js/ui.js',
  './js/engines.js',
  './data/french_lib.json',
  './data/index.json',
  './manifest.json'
  './data/cp.json',
  './data/ce1.json',
  './data/ce2.json',
  './data/cm1.json',
  './data/cm2.json',
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap'
];

// 1. Installation : On met tout en cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Mise en cache des fichiers...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activation : On nettoie les vieux caches si on change de version
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// 3. Interception : On sert le cache si hors ligne
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si c'est dans le cache, on le rend, sinon on cherche sur internet
      return response || fetch(event.request);
    })
  );
});
