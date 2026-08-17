const CACHE = 'sister-trip-v2';
const CORE = [
  './','./index.html','./styles.css','./sync.css','./app.js','./sync.js','./supabase-config.js',
  './manifest.webmanifest','./icon.svg'
];
const REMOTE = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
  'https://images.unsplash.com/photo-1637851058613-95f0d41c3c2f?auto=format&fit=crop&w=1600&q=88',
  'https://images.unsplash.com/photo-1653343860295-2b07f992b7b2f?auto=format&fit=crop&w=1200&q=88'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    await Promise.allSettled(REMOTE.map(async url => {
      const response = await fetch(url, {mode:'cors'});
      if (response.ok) await cache.put(url, response);
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isTile = url.hostname.includes('tile.openstreetmap.org');
  if (isTile) {
    event.respondWith(fetch(event.request).catch(() => new Response('', {status:503})));
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
