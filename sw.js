const CACHE = 'sister-trip-v5';
const CORE = [
  './','./index.html','./styles.css','./map-v2.css','./map-v3.css','./sync.css',
  './app.js','./trip-data.js','./map-v3.js','./sync.js','./supabase-config.js',
  './manifest.webmanifest','./icon.svg'
];
const REMOTE = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
  'https://images.unsplash.com/photo-1637851058613-95f0d41c3c2f?auto=format&fit=crop&w=1600&q=88',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=86',
  'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=900&q=86',
  'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=86',
  'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?auto=format&fit=crop&w=900&q=86',
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=86',
  'https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?auto=format&fit=crop&w=900&q=86',
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=86',
  'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=700&q=84',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=700&q=84'
];

// Some external photos can disappear. Replace known unstable URLs and always keep a visual fallback.
const IMAGE_REPLACEMENTS = new Map([
  ['https://images.unsplash.com/photo-1653343860295-2b07f992b7b2f?auto=format&fit=crop&w=1200&q=88', 'https://commons.wikimedia.org/wiki/Special:FilePath/Eiffel%20Tower%20sunset.jpg?width=1400'],
  ['https://images.unsplash.com/photo-1653343860295-2b07f992b7b2f?auto=format&fit=crop&w=700&q=88', 'https://commons.wikimedia.org/wiki/Special:FilePath/Eiffel%20Tower%20sunset.jpg?width=900'],
  ['https://images.unsplash.com/photo-1597982437463-93095fbfbb6c?auto=format&fit=crop&w=400&q=80', 'https://commons.wikimedia.org/wiki/Special:FilePath/Rodin%20TheThinker.jpg?width=700']
]);

const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#18332f"/><stop offset="1" stop-color="#6f9691"/></linearGradient></defs><rect width="1200" height="800" fill="url(#g)"/><circle cx="820" cy="250" r="150" fill="#f4e8c9" opacity=".14"/><path d="M0 610 C250 520 430 690 690 570 S1010 510 1200 420 V800 H0Z" fill="#f6f1e8" opacity=".12"/></svg>`;
const fallbackImage = () => new Response(fallbackSvg, {headers:{'Content-Type':'image/svg+xml','Cache-Control':'public, max-age=86400'}});

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    await Promise.allSettled(REMOTE.map(async url => {
      try {
        const response = await fetch(url, {mode:'cors'});
        if (response.ok) await cache.put(url, response);
      } catch (_) {}
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
    const replacement = IMAGE_REPLACEMENTS.get(event.request.url);
    if (replacement) {
      try {
        const cachedReplacement = await caches.match(replacement);
        if (cachedReplacement) return cachedReplacement;
        const replacementResponse = await fetch(replacement, {mode:'cors'});
        if (replacementResponse.ok || replacementResponse.type === 'opaque') {
          const cache = await caches.open(CACHE);
          cache.put(replacement, replacementResponse.clone());
          return replacementResponse;
        }
      } catch (_) {}
      return fallbackImage();
    }

    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (!response.ok && event.request.destination === 'image') return fallbackImage();
      if (response.ok || response.type === 'opaque') {
        const cache = await caches.open(CACHE);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch (err) {
      if (event.request.mode === 'navigate') return caches.match('./index.html');
      if (event.request.destination === 'image') return fallbackImage();
      throw err;
    }
  })());
});
