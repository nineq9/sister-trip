/* Sister Trip image stability layer.
   Keeps the visual experience photo-first while preventing broken-image gaps.
   Primary photos are cached after first successful load; city-level fallbacks are used before
   the final built-in visual fallback. */

(() => {
  const CACHE_NAME = 'sister-trip-images-v1';

  const catalog = {
    paris: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=86',
      'https://images.unsplash.com/photo-1763191804533-1974643192e7?auto=format&fit=crop&w=1600&q=82'
    ],
    zurich: [
      'https://images.unsplash.com/photo-1599082323832-2676eca28e86?auto=format&fit=crop&w=1600&q=86',
      'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1600&q=82'
    ],
    luzern: [
      'https://images.unsplash.com/photo-1747136789067-b9113e6a9ce9?auto=format&fit=crop&w=1600&q=86',
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=82'
    ],
    milano: [
      'https://images.unsplash.com/photo-1566662961381-8ff13ac24766?auto=format&fit=crop&w=1600&q=86',
      'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?auto=format&fit=crop&w=1600&q=82'
    ],
    venezia: [
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1600&q=86',
      'https://images.unsplash.com/photo-1770099825366-a0f4b8b2f713?auto=format&fit=crop&w=1600&q=82'
    ],
    firenze: [
      'https://images.unsplash.com/photo-1578262634053-eead874052be?auto=format&fit=crop&w=1600&q=86',
      'https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?auto=format&fit=crop&w=1600&q=82'
    ],
    roma: [
      'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1600&q=86',
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=82'
    ]
  };

  const aliases = {
    paris: ['paris','eiffel','orsay','louvre','invalides','montmartre','versailles','notre-dame','garnier','madeleine','rodin'],
    zurich: ['zürich','zurich','uetliberg','lindt'],
    luzern: ['luzern','lucerne','pilatus'],
    milano: ['milano','milan','como'],
    venezia: ['venezia','venice','mestre'],
    firenze: ['firenze','florence'],
    roma: ['roma','rome','vatican','colosseum','colosseo']
  };

  function cityFromText(value='') {
    const text = String(value).toLowerCase();
    for (const [city, words] of Object.entries(aliases)) {
      if (words.some(word => text.includes(word))) return city;
    }
    return 'paris';
  }

  function escapeXml(value='') {
    return String(value).replace(/[<>&'\"]/g, ch => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','\"':'&quot;'}[ch]));
  }

  function builtInFallback(city='paris', label='SISTER TRIP') {
    const names = {paris:'PARIS',zurich:'ZÜRICH',luzern:'LUZERN',milano:'MILANO',venezia:'VENEZIA',firenze:'FIRENZE',roma:'ROMA'};
    const title = names[city] || 'EUROPE';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#102421"/><stop offset=".58" stop-color="#426b68"/><stop offset="1" stop-color="#d9d2bd"/></linearGradient>
        <radialGradient id="r"><stop stop-color="#f1d69b" stop-opacity=".5"/><stop offset="1" stop-color="#f1d69b" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <circle cx="920" cy="190" r="260" fill="url(#r)"/>
      <path d="M0 580 C190 500 360 680 585 570 S930 500 1200 390 V800 H0Z" fill="#f7f2e8" opacity=".13"/>
      <path d="M90 520 C270 430 365 620 530 535 S825 440 1090 330" fill="none" stroke="#f7f2e8" stroke-opacity=".25" stroke-width="3"/>
      <text x="72" y="650" fill="#f7f2e8" font-family="Georgia,serif" font-size="92">${escapeXml(title)}</text>
      <text x="78" y="708" fill="#f7f2e8" opacity=".72" font-family="Arial,sans-serif" font-size="24" letter-spacing="8">${escapeXml(label).slice(0,40)}</text>
    </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function candidatesFor(img) {
    const city = cityFromText(`${img.alt || ''} ${img.dataset.city || ''} ${img.closest('[data-city]')?.dataset.city || ''}`);
    const current = img.currentSrc || img.src;
    const candidates = [];
    if (current && !current.startsWith('data:image/')) candidates.push(current);
    for (const url of catalog[city] || []) if (!candidates.includes(url)) candidates.push(url);
    candidates.push(builtInFallback(city, img.alt || 'SISTER TRIP'));
    return {city, candidates};
  }

  function protectImage(img) {
    if (!(img instanceof HTMLImageElement) || img.dataset.stImageProtected === '1') return;
    img.dataset.stImageProtected = '1';
    img.decoding = 'async';
    const {city, candidates} = candidatesFor(img);
    img.dataset.fallbackCity = city;
    img.dataset.imageCandidates = JSON.stringify(candidates);
    img.dataset.imageAttempt = '0';

    img.addEventListener('error', () => {
      const list = JSON.parse(img.dataset.imageCandidates || '[]');
      let attempt = Number(img.dataset.imageAttempt || 0) + 1;
      img.dataset.imageAttempt = String(attempt);
      if (attempt < list.length) img.src = list[attempt];
    });
  }

  function protectAll(root=document) {
    root.querySelectorAll?.('img').forEach(protectImage);
  }

  function patchTripData() {
    if (typeof demo === 'undefined') return;
    for (const city of demo.cities || []) {
      const key = city.id || cityFromText(city.name);
      if (catalog[key]?.[0]) city.image = catalog[key][0];
    }
    for (const place of demo.mapPlaces || []) {
      const key = place.city || cityFromText(place.name);
      if (!place.image || /1653343860295|1597982437463/.test(place.image)) place.image = catalog[key]?.[0] || place.image;
      place.fallbackImage = catalog[key]?.[0] || null;
    }
    for (const day of Object.values(demo.dayPlans || {})) {
      const city = day.city || 'paris';
      for (const item of day.items || []) {
        if (!item.image) item.image = catalog[city]?.[0] || null;
      }
    }
  }

  function patchStaticVisuals() {
    const hero = document.querySelector('.hero-image');
    if (hero) { hero.dataset.city = 'paris'; hero.src = catalog.paris[0]; }
    const feature = document.querySelector('.feature-card img');
    if (feature) { feature.dataset.city = 'paris'; feature.src = catalog.paris[1]; }
    const storyCover = document.querySelector('.story-cover img');
    if (storyCover) { storyCover.dataset.city = 'paris'; storyCover.src = catalog.paris[1]; }
    const cityStory = document.querySelector('.city-story-photo');
    if (cityStory) {
      cityStory.style.backgroundImage = `linear-gradient(180deg,rgba(8,20,18,.08),rgba(8,20,18,.5)),url("${catalog.paris[0]}")`;
      cityStory.style.backgroundSize = 'cover';
      cityStory.style.backgroundPosition = 'center';
      cityStory.style.backgroundColor = '#17312e';
    }
  }

  async function warmCache() {
    if (!('caches' in window) || !navigator.onLine) return;
    try {
      const cache = await caches.open(CACHE_NAME);
      const urls = [...new Set(Object.values(catalog).flat())];
      await Promise.allSettled(urls.map(async url => {
        if (await cache.match(url)) return;
        const response = await fetch(url, {mode:'cors', cache:'force-cache'});
        if (response.ok || response.type === 'opaque') await cache.put(url, response.clone());
      }));
    } catch (_) {}
  }

  function install() {
    patchTripData();
    patchStaticVisuals();
    protectAll();
    const observer = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches?.('img')) protectImage(node);
          protectAll(node);
        }
      }
    });
    observer.observe(document.documentElement, {childList:true, subtree:true});
    warmCache();
  }

  window.SisterTripImages = {catalog, install, protectImage, patchTripData, warmCache, builtInFallback};
})();
