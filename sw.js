/*
 * Devoir Numérique - Service Worker Sécurisé (V3)
 * Copyright (C) 2026 [Stinj-NoD]
 * Licence : GNU GPL v3
 */

const CACHE_NAME = 'dn-v3.0.0-secure'; // Nouvelle version majeure
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 jours
const MAX_CACHE_ENTRIES = 60; // Augmenté légèrement pour couvrir tous tes assets

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json', // Assure-toi que ce fichier existe !
  './js/app.js',
  './js/ui.js',
  './js/engines.js',
  './js/storage.js',
  './data/index.json',
  './data/french_lib.json',
  './data/cp.json',
  './data/ce1.json',
  './data/ce2.json',
  './data/cm1.json',
  './data/cm2.json',
  './offline.html'
];

// Whitelist stricte
const ALLOWED_ORIGINS = [self.location.origin];

// Types MIME autorisés (Sécurité)
const ALLOWED_CONTENT_TYPES = [
  'application/javascript',
  'text/javascript',
  'application/json',
  'text/html',
  'text/css',
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'font/woff2' // Ajout pour les polices si besoin
];

// 1. Installation avec validation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] 🔒 Installation sécurisée du cache');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch((err) => {
      console.error('[SW] ❌ Échec installation (Fichier manquant ?):', err);
      // On ne jette pas l'erreur pour ne pas tuer le SW existant s'il y en a un,
      // mais l'installation échouera naturellement.
      throw err; 
    })
  );
  self.skipWaiting();
});

// 2. Activation avec audit sécurité
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Nettoyage caches
      caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] 🗑️ Suppression ancien cache:', key);
            return caches.delete(key);
          }
        }));
      }),
      // Audit du cache actif
      caches.open(CACHE_NAME).then(async (cache) => {
        const keys = await cache.keys();
        if (keys.length > MAX_CACHE_ENTRIES) {
          console.warn('[SW] ⚠️ Cache surchargé, nettoyage...');
          // On supprime ce qui n'est pas dans la liste critique
          const keysToDelete = keys.filter(req => 
            !ASSETS_TO_CACHE.some(asset => req.url.includes(asset.replace('./', '')))
          );
          await Promise.all(keysToDelete.map(req => cache.delete(req)));
        }
      })
    ])
  );
  return self.clients.claim();
});

// 3. Fetch sécurisé avec validation multicouche
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET et les extensions Chrome/Safari
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);

  // 🛡️ VALIDATION 1 : Origine (Protection contre fuites de données vers tiers)
  // On autorise l'origine propre ET les fonts google si utilisées
  if (!ALLOWED_ORIGINS.includes(url.origin) && !url.hostname.includes('fonts.')) {
    // Si c'est externe non whiteliste, on laisse le réseau gérer sans cache
    return; 
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);

      // 🛡️ VALIDATION 2 : TTL du cache
      if (cachedResponse) {
        const dateHeader = cachedResponse.headers.get('date');
        const cacheDate = dateHeader ? new Date(dateHeader).getTime() : Date.now();
        const age = Date.now() - cacheDate;

        if (age > MAX_CACHE_AGE) {
          console.log('[SW] ⏰ Cache expiré pour :', url.pathname);
          // On continuera vers le fetch réseau ci-dessous
        }
      }

      // Stratégie "Stale-While-Revalidate" modifiée pour la sécurité
      // 1. On lance le réseau pour mettre à jour
      const networkFetch = fetch(event.request).then((networkResponse) => {
        // Si réponse invalide, on retourne telle quelle
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // 🛡️ VALIDATION 3 : Content-Type
        const contentType = networkResponse.headers.get('content-type');
        const isAllowedType = ALLOWED_CONTENT_TYPES.some(type => 
          contentType && contentType.toLowerCase().includes(type)
        );

        // 🛡️ VALIDATION 4 : Taille (< 10 MB)
        const contentLength = networkResponse.headers.get('content-length');
        const isTooBig = contentLength && parseInt(contentLength) > 10 * 1024 * 1024;

        if (isAllowedType && !isTooBig) {
             cache.put(event.request, networkResponse.clone());
        }

        return networkResponse;
      }).catch(async () => {
        // En cas d'échec réseau, on retourne la page offline SI c'est une navigation HTML
        if (event.request.mode === 'navigate') {
            return await cache.match('./offline.html');
        }
        // Sinon rien (image manquante, etc)
      });

      // Si on a un cache valide (non expiré), on le sert tout de suite
      if (cachedResponse && (Date.now() - (new Date(cachedResponse.headers.get('date')).getTime() || 0)) < MAX_CACHE_AGE) {
          return cachedResponse;
      }

      // Sinon on attend le réseau
      return networkResponse || cachedResponse; 
    })
  );
});

// 4. Message handler
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] 🔄 Activation forcée par l\'application'); // Correction du guillemet
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[SW] 🗑️ Nettoyage du cache sur demande');
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        return caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE));
      })
    );
  }
});