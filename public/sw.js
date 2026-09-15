/**
 * iShopp AI - Production Service Worker with Dual Caching Strategy:
 * 1. Static Assets & App Shell: Stale-While-Revalidate / Cache-First
 * 2. Store Specials & Catalog API (/api/feed): Network-First with Cache Fallback + Synthetic Offline Fallback
 * 3. Media & Product Images: Cache-First with Dynamic Expiration
 * 4. Offline resilience for IndexedDB local-first shopping
 */

const STATIC_CACHE_NAME = 'ishopp-static-v2';
const API_CACHE_NAME = 'ishopp-api-v2';
const IMAGE_CACHE_NAME = 'ishopp-images-v2';

const APP_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/apple-touch-icon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
];

// Retailer & category image hosts to cache for offline visual richness
const CACHEABLE_ORIGINS = [
  'images.unsplash.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// 1. INSTALL: Precache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(APP_SHELL_ASSETS);
      } catch (err) {
        console.warn('PWA Precache partial warning:', err);
      }
    })
  );
  self.skipWaiting();
});

// 2. ACTIVATE: Clean old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (![STATIC_CACHE_NAME, API_CACHE_NAME, IMAGE_CACHE_NAME].includes(key)) {
            console.log('SW: Purging deprecated cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. FETCH STRATEGIES
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // A. Non-GET requests (e.g. POST /api/scan, /api/verify-deal) pass through
  if (event.request.method !== 'GET') {
    return;
  }

  // B. API FEED & SPECIALS: Network-First with Cache Fallback
  // If user is offline (e.g. inside a basement grocery aisle), serve cached specials immediately!
  if (url.pathname.startsWith('/api/feed') || url.pathname.startsWith('/api/specials') || url.pathname.startsWith('/api/price-trends')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          console.log('SW: Network offline for API, serving cached response for', url.pathname);
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // If neither network nor cache matched, return an offline synthetic fallback JSON
          return new Response(
            JSON.stringify({
              specials: [],
              isOffline: true,
              message: 'Offline mode active: viewing local IndexedDB specials and shopping list.',
              timestamp: new Date().toISOString(),
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json', 'X-iShopp-Offline': 'true' },
            }
          );
        })
    );
    return;
  }

  // C. IMAGES & VISUAL ASSETS: Cache-First with Network Fallback
  const isImageRequest =
    event.request.destination === 'image' ||
    CACHEABLE_ORIGINS.some((origin) => url.hostname.includes(origin)) ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|ico)$/i);

  if (isImageRequest) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(IMAGE_CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Fallback for missing images when offline: return cached app logo if available
            return caches.match('/logo.svg');
          });
      })
    );
    return;
  }

  // D. NAVIGATION (HTML pages) & STATIC JS/CSS: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is an HTML navigation, return cached index.html
          if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html') || caches.match('/');
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. MESSAGE HANDLING: Client-SW communication
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CHECK_CACHE_STATUS') {
    caches.keys().then((keys) => {
      event.ports[0]?.postMessage({
        activeCaches: keys,
        version: 'v2',
        isOfflineReady: true,
      });
    });
  }
});
