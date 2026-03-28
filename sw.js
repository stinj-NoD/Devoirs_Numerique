/*
 * Devoir Numerique - Service Worker
 * Robustesse offline/PWA
 */

const CACHE_NAME = 'dn-v3.5.0-modular-french';
const OFFLINE_URL = './offline.html';

const APP_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './css/app.css',
  './icon-192.png',
  './icon-512.png',
  './js/app.js',
  './js/storage.js',
  './js/validators.js',
  './js/data-bundle.js',
  './js/engines-core.js',
  './js/engines-documentary.js',
  './js/engines-math.js',
  './js/engines-french.js',
  './js/engines.js',
  './js/ui-keyboards.js',
  './js/ui-documentary.js',
  './js/ui-visuals.js',
  './js/ui.js'
];

const DATA_ASSETS = [
  './data/index.json',
  './data/french/spelling.json',
  './data/french/conjugation.json',
  './data/french/homophones.json',
  './data/french/grammar.json',
  './data/french/reading.json',
  './data/cp.json',
  './data/ce1.json',
  './data/ce2.json',
  './data/cm1.json',
  './data/cm2.json',
  './data/history_cp.json',
  './data/history_ce1.json',
  './data/history_ce2.json',
  './data/history_cm1.json',
  './data/history_cm2.json',
  './data/history_chrono.json',
  './data/geography_cp.json',
  './data/geography_ce1.json',
  './data/geography_ce2.json',
  './data/geography_cm1.json',
  './data/geography_cm2.json',
  './data/science_cp.json',
  './data/science_ce1.json',
  './data/science_ce2.json',
  './data/science_cm1.json',
  './data/science_cm2.json',
  './data/emc_cp.json',
  './data/emc_ce1.json',
  './data/emc_ce2.json',
  './data/emc_cm1.json',
  './data/emc_cm2.json'
];

const ASSETS_TO_CACHE = [...new Set([...APP_ASSETS, ...DATA_ASSETS])];
const ALLOWED_ORIGINS = new Set([self.location.origin]);
const ALLOWED_FONT_HOSTS = new Set(['fonts.googleapis.com', 'fonts.gstatic.com']);

function isAllowedRequest(requestUrl) {
  const url = new URL(requestUrl);
  if (ALLOWED_ORIGINS.has(url.origin)) return true;
  return ALLOWED_FONT_HOSTS.has(url.hostname);
}

function isCacheableResponse(response) {
  if (!response || response.status !== 200) return false;
  if (!['basic', 'cors'].includes(response.type)) return false;

  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  return [
    'application/javascript',
    'text/javascript',
    'application/json',
    'text/html',
    'text/css',
    'image/png',
    'image/jpeg',
    'image/svg+xml',
    'font/woff2',
    'font/woff'
  ].some((type) => contentType.includes(type));
}

async function precacheAssets() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(ASSETS_TO_CACHE);
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheAssets());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => {
      if (key !== CACHE_NAME) return caches.delete(key);
      return Promise.resolve();
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;
  if (!isAllowedRequest(event.request.url)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request, { ignoreSearch: true });

    const networkPromise = fetch(event.request)
      .then(async (networkResponse) => {
        if (isCacheableResponse(networkResponse)) {
          await cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      })
      .catch(() => null);

    if (cachedResponse) {
      event.waitUntil(networkPromise);
      return cachedResponse;
    }

    const networkResponse = await networkPromise;
    if (networkResponse) return networkResponse;

    if (event.request.mode === 'navigate') {
      return cache.match(OFFLINE_URL);
    }

    return Response.error();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (event.data?.type === 'CLEAR_CACHE') {
    event.waitUntil((async () => {
      await caches.delete(CACHE_NAME);
      await precacheAssets();
    })());
  }
});
