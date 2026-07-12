/*
 * Devoir Numerique - Service Worker
 * Robustesse offline/PWA
 */

const CACHE_NAME = 'dn-v4.13.0-content-quality-suggestions';
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
  './js/security.js',
  './js/validators.js',
  './js/data-bundle.js',
  './js/engines-core.js',
  './js/engines-documentary.js',
  './js/engines-math.js',
  './js/engines-french.js',
  './js/engines-board.js',
  './js/engines.js',
  './js/ui-keyboards.js',
  './js/ui-documentary.js',
  './js/ui-visuals.js',
  './js/ui-board.js',
  './js/ui.js',
  './js/bootstrap.js'
];

const DATA_ASSETS = [
  './data/index.json',
  './data/french/conjugation.json',
  './data/french/grammar.json',
  './data/french/homophones.json',
  './data/french/matching.json',
  './data/french/reading.json',
  './data/french/spelling.json',
  './data/board_geography_cm2.json',
  './data/board_geometry_cm1.json',
  './data/board_geometry_cm2.json',
  './data/board_map_locate_africa.json',
  './data/board_map_locate_asia.json',
  './data/board_map_locate_ce1.json',
  './data/board_map_locate_ce2.json',
  './data/board_map_locate_cm1.json',
  './data/board_map_locate_cp.json',
  './data/board_map_locate_europe.json',
  './data/board_map_locate_north_america.json',
  './data/board_map_locate_south_america.json',
  './data/board_map_locate_world.json',
  './data/maps/africa-countries.svg',
  './data/maps/asia-countries.svg',
  './data/maps/europe-countries.svg',
  './data/maps/france-regions.svg',
  './data/maps/north-america-countries.svg',
  './data/maps/south-america-countries.svg',
  './data/maps/world-continents.svg',
  './data/board_memory_match_ce1.json',
  './data/board_memory_match_ce2.json',
  './data/board_memory_match_cp.json',
  './data/board_point_on_grid_ce2.json',
  './data/board_point_on_grid_cm1.json',
  './data/board_shape_classify_cm1.json',
  './data/board_shape_classify_cm2.json',
  './data/board_symmetry_complete_ce2.json',
  './data/board_symmetry_complete_cm1.json',
  './data/board_symmetry_complete_cm2.json',
  './data/board_tap_features_ce2.json',
  './data/board_tap_features_cm1.json',
  './data/board_tap_features_science.json',
  './data/cp.json',
  './data/ce1.json',
  './data/ce2.json',
  './data/cm1.json',
  './data/cm2.json',
  './data/emc_cp.json',
  './data/emc_ce1.json',
  './data/emc_ce2.json',
  './data/emc_cm1.json',
  './data/emc_cm2.json',
  './data/emc_matching.json',
  './data/french_cp_grammar.json',
  './data/french_ce1_reading.json',
  './data/french_ce2_reading.json',
  './data/french_cm1_reading.json',
  './data/french_cm2_reading.json',
  './data/french_word_order.json',
  './data/geography_cp.json',
  './data/geography_ce1.json',
  './data/geography_ce2.json',
  './data/geography_cm1.json',
  './data/geography_cm2.json',
  './data/geography_capitals_cm1.json',
  './data/geography_matching.json',
  './data/history_cp.json',
  './data/history_ce1.json',
  './data/history_ce2.json',
  './data/history_cm1.json',
  './data/history_cm2.json',
  './data/history_chrono.json',
  './data/history_matching.json',
  './data/math_geometry_cp.json',
  './data/math_geometry_ce1.json',
  './data/math_geometry_ce2.json',
  './data/math_geometry_cm1.json',
  './data/math_geometry_cm2.json',
  './data/math_matching.json',
  './data/math_word_problems_cycle2.json',
  './data/math_word_problems_cycle3.json',
  './data/science_cp.json',
  './data/science_ce1.json',
  './data/science_ce2.json',
  './data/science_cm1.json',
  './data/science_cm2.json',
  './data/science_matching.json'
];

const CARD_ASSETS = [
  './data/cards.json',
  './data/cards/a-1.webp',
  './data/cards/a-2.webp',
  './data/cards/a-3.webp',
  './data/cards/a-4.webp',
  './data/cards/a-5.webp',
  './data/cards/b-1.webp',
  './data/cards/b-2.webp',
  './data/cards/b-3.webp',
  './data/cards/c-1.webp',
  './data/cards/c-2.webp',
  './data/cards/c-3.webp',
  './data/cards/capy-bebe.webp',
  './data/cards/capy-dore.webp',
  './data/cards/capy-fleur.webp',
  './data/cards/capy-foret.webp',
  './data/cards/capy-jardin.webp',
  './data/cards/capy-oeuf.webp',
  './data/cards/capy-roi.webp',
  './data/cards/capy-sage.webp',
  './data/cards/d-1.webp',
  './data/cards/d-2.webp',
  './data/cards/d-3.webp',
  './data/cards/d-4.webp',
  './data/cards/dauphin-abysse.webp',
  './data/cards/dauphin-acier.webp',
  './data/cards/dauphin-bebe.webp',
  './data/cards/dauphin-fee.webp',
  './data/cards/dauphin-foudre.webp',
  './data/cards/dauphin-glace.webp',
  './data/cards/dauphin-jeune.webp',
  './data/cards/dauphin-nuit.webp',
  './data/cards/dauphin-oeuf.webp',
  './data/cards/dauphin-plante.webp',
  './data/cards/dauphin-poison.webp',
  './data/cards/dragon-aido-hwedo.webp',
  './data/cards/dragon-astral.webp',
  './data/cards/dragon-bahamut.webp',
  './data/cards/dragon-fafnir.webp',
  './data/cards/dragon-hydre.webp',
  './data/cards/dragon-jormungandr.webp',
  './data/cards/dragon-kukulkan.webp',
  './data/cards/dragon-ladon.webp',
  './data/cards/dragon-leviathan.webp',
  './data/cards/dragon-long.webp',
  './data/cards/dragon-naga.webp',
  './data/cards/dragon-nidhoggr.webp',
  './data/cards/dragon-orochi.webp',
  './data/cards/dragon-quetzalcoatl.webp',
  './data/cards/dragon-ryu.webp',
  './data/cards/dragon-serpent-cornu.webp',
  './data/cards/dragon-shenlong.webp',
  './data/cards/dragon-tarasque.webp',
  './data/cards/dragon-tiamat.webp',
  './data/cards/dragon-vritra.webp',
  './data/cards/dragon-wyverne.webp',
  './data/cards/e-1.webp',
  './data/cards/e-2.webp',
  './data/cards/e-3.webp',
  './data/cards/f-1.webp',
  './data/cards/f-2.webp',
  './data/cards/f-3.webp',
  './data/cards/f-4.webp',
  './data/cards/fennec-astral.webp',
  './data/cards/fennec-bebe.webp',
  './data/cards/fennec-braise.webp',
  './data/cards/fennec-jeune.webp',
  './data/cards/fennec-liane.webp',
  './data/cards/fennec-perle.webp',
  './data/cards/fennec-pharaon.webp',
  './data/cards/g-1.webp',
  './data/cards/g-2.webp',
  './data/cards/g-3.webp',
  './data/cards/hibou-bebe.webp',
  './data/cards/hibou-esprit.webp',
  './data/cards/hibou-foret.webp',
  './data/cards/hibou-glace.webp',
  './data/cards/hibou-lumiere.webp',
  './data/cards/hibou-nuit.webp',
  './data/cards/hibou-oeuf.webp',
  './data/cards/hibou-phenix.webp',
  './data/cards/loup-abysses.webp',
  './data/cards/loup-amarok.webp',
  './data/cards/loup-aurore.webp',
  './data/cards/loup-bebe.webp',
  './data/cards/loup-braise.webp',
  './data/cards/loup-cosmos.webp',
  './data/cards/loup-cusith.webp',
  './data/cards/loup-eclipse.webp',
  './data/cards/loup-fenrir.webp',
  './data/cards/loup-foudre.webp',
  './data/cards/loup-givre.webp',
  './data/cards/loup-glacier.webp',
  './data/cards/loup-jeune.webp',
  './data/cards/loup-louveteau.webp',
  './data/cards/loup-mononoke.webp',
  './data/cards/loup-neant.webp',
  './data/cards/loup-nebuleuse.webp',
  './data/cards/loup-prismawing.webp',
  './data/cards/loup-sylve.webp',
  './data/cards/loup-tonnerre.webp',
  './data/cards/loup-vague.webp',
  './data/cards/mytho-alicorne-cosmique.webp',
  './data/cards/mytho-anzu.webp',
  './data/cards/mytho-baku.webp',
  './data/cards/mytho-basilik.webp',
  './data/cards/mytho-byakko.webp',
  './data/cards/mytho-cait-sith.webp',
  './data/cards/mytho-caladrius.webp',
  './data/cards/mytho-camahueto.webp',
  './data/cards/mytho-enfield.webp',
  './data/cards/mytho-garuda.webp',
  './data/cards/mytho-genbu.webp',
  './data/cards/mytho-griffon.webp',
  './data/cards/mytho-hippocampe.webp',
  './data/cards/mytho-jackalope.webp',
  './data/cards/mytho-kirin.webp',
  './data/cards/mytho-komainu.webp',
  './data/cards/mytho-licorne.webp',
  './data/cards/mytho-manticore.webp',
  './data/cards/mytho-pegase.webp',
  './data/cards/mytho-peryton.webp',
  './data/cards/mytho-phoenix.webp',
  './data/cards/mytho-raiju.webp',
  './data/cards/mytho-simurgh.webp',
  './data/cards/mytho-suzaku.webp',
  './data/cards/mytho-thunderbird.webp',
  './data/cards/mytho-wolpertinger.webp',
  './data/cards/z-1.webp',
  './data/cards/z-2.webp',
  './data/cards/z-3.webp',
  './data/cards/z-acier-spectre.webp',
  './data/cards/z-acier.webp',
  './data/cards/z-dragon.webp',
  './data/cards/z-eau-fee.webp',
  './data/cards/z-eau.webp',
  './data/cards/z-fee.webp',
  './data/cards/z-feu-poison.webp',
  './data/cards/z-feu.webp',
  './data/cards/z-glace-psy.webp',
  './data/cards/z-glace.webp',
  './data/cards/z-plante-spectre.webp',
  './data/cards/z-plante-tenebre.webp',
  './data/cards/z-plante.webp',
  './data/cards/z-poison-dragon.webp',
  './data/cards/z-poison.webp',
  './data/cards/z-psy.webp',
  './data/cards/z-spectre.webp',
  './data/cards/z-ultime.webp',
  './data/cards/z-vol.webp'
];

const ASSETS_TO_CACHE = [...new Set([...APP_ASSETS, ...DATA_ASSETS, ...CARD_ASSETS])];
const ALLOWED_ORIGINS = new Set([self.location.origin]);

function isAllowedRequest(requestUrl) {
  const url = new URL(requestUrl);
  return ALLOWED_ORIGINS.has(url.origin);
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
    'image/webp',
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
