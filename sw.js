const CACHE = 'sister-trip-v7';
const CORE = [
  './','./index.html','./styles.css','./map-v2.css','./map-v3.css','./sync.css',
  './app.js','./trip-data.js','./image-stability.js','./map-v3.js','./shared-v2.js','./sync.js','./supabase-config.js',
  './manifest.webmanifest','./icon.svg'
];
const REMOTE = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=86',
  'https://images.unsplash.com/photo-1763191804533-1974643192e7?auto=format&fit=crop&w=1600&q=82',
  'https://images.unsplash.com/photo-1599082323832-2676eca28e86?auto=format&fit=crop&w=1600&q=86',
  'https://images.unsplash.com/photo-1747136789067-b9113e6a9ce9?auto=format&fit=crop&w=1600&q=86',
  'https://images.unsplash.com/photo-1566662961381-8ff13ac24766?auto=format&fit=crop&w=1600&q=86',
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1600&q=86',
  'https://images.unsplash.com/photo-1578262634053-eead874052be?auto=format&fit=crop&w=1600&q=86',
  'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1600&q=86',
  'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=700&q=84',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=700&q=84'
];

const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#18332f"/><stop offset="1" stop-color="#6f9691"/></linearGradient></defs><rect width="1200" height="800" fill="url(#g)"/><circle cx="820" cy="250" r="150" fill="#f4e8c9" opacity=".14"/><path d="M0 610 C250 520 430 690 690 570 S1010 510 1200 420 V800 H0Z" fill="#f6f1e8" opacity=".12"/></svg>`;
const fallbackImage = () => new Response(fallbackSvg, {headers:{'Content-Type':'image/svg+xml','Cache-Control':'public, max-age=86400'}});

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    await Promise.allSettled(REMOTE.map(async url => {
      try {
        const response = await fetch(url, {mode:'cors'});
        if (response.ok || response.type === 'opaque') await cache.put(url, response.clone());
      } catch (_) {}
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE && k !== 'sister-trip-images-v1').map(k => caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isTile = url.hostname.includes('tile.openstreetmap.org');
  const isImage = event.request.destination === 'image' || /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(url.pathname);

  if (isTile) {
    event.respondWith(fetch(event.request).catch(() => new Response('', {status:503})));
    return;
  }

  if (isImage) {
    event.respondWith((async () => {
      const cached = await caches.match(event.request);
      if (cached) {
        event.waitUntil((async () => {
          try {
            const fresh = await fetch(event.request);
            if (fresh.ok || fresh.type === 'opaque') {
              const cache = await caches.open(CACHE);
              await cache.put(event.request, fresh.clone());
            }
          } catch (_) {}
        })());
        return cached;
      }
      try {
        const response = await fetch(event.request);
        if (response.ok || response.type === 'opaque') {
          const cache = await caches.open(CACHE);
          await cache.put(event.request, response.clone());
          return response;
        }
        return fallbackImage();
      } catch (_) {
        return fallbackImage();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok || response.type === 'opaque') {
        const cache = await caches.open(CACHE);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch (err) {
      if (event.request.mode === 'navigate') return caches.match('./index.html');
      throw err;
    }
  })());
});
