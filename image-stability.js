/* Sister Trip image stability layer.
   Photo priority is deliberately spot-first:
   spot candidates -> city candidates -> built-in visual fallback.
   This prevents different Paris stops from collapsing to the same Eiffel image. */

(() => {
  const CACHE_NAME = 'sister-trip-images-v2';
  const commonsFile = filename => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1400`;

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

  // Two independently hosted candidates for each Paris stop that appears in the 12 Sep plan.
  // Wikimedia Commons Special:FilePath keeps the application URL stable even when previews change.
  const spotCatalog = {
    'saint-sulpice': [
      commonsFile('Saint-Sulpice @ Paris (23900233582).jpg'),
      commonsFile('Saint-Sulpice, Nave, Paris 20140515 1.jpg')
    ],
    'saint-etienne-du-mont': [
      commonsFile('Exterior of Église Saint-Étienne-du-Mont.jpg'),
      commonsFile('Paris, Saint-Étienne-du-Mont, Außenansicht (2).jpg')
    ],
    'petit-palais': [
      commonsFile('Petit Palais (22483100021).jpg'),
      commonsFile('Petit Palais @ Paris (34892310275).jpg')
    ],
    'invalides': [
      commonsFile('Invalides paris.jpg'),
      commonsFile('Invalides paris dome.jpg')
    ],
    'pont-alexandre-iii': [
      commonsFile('Pont Alexandre III, Paris, France.jpg'),
      commonsFile('The Pont Alexandre III Paris.jpg')
    ],
    'eiffel-tower': [
      commonsFile('Eiffel Tower..jpg'),
      commonsFile('EiffelTowerParis.jpg')
    ]
  };

  const aliases = {
    paris: ['paris','eiffel','orsay','louvre','invalides','montmartre','versailles','notre-dame','garnier','madeleine','rodin','saint-sulpice','saint-etienne','petit-palais','alexandre'],
    zurich: ['zürich','zurich','uetliberg','lindt'],
    luzern: ['luzern','lucerne','pilatus'],
    milano: ['milano','milan','como'],
    venezia: ['venezia','venice','mestre'],
    firenze: ['firenze','florence'],
    roma: ['roma','rome','vatican','colosseum','colosseo']
  };

  const spotAliases = {
    'saint-sulpice': ['saint-sulpice','saint sulpice'],
    'saint-etienne-du-mont': ['saint-etienne-du-mont','saint-etienne','saint étienne du mont','saint-étienne-du-mont','saint etienne du mont'],
    'petit-palais': ['petit-palais','petit palais'],
    'invalides': ['invalides','aura-invalides','aura invalides'],
    'pont-alexandre-iii': ['pont-alexandre-iii','pont alexandre iii','alexandre'],
    'eiffel-tower': ['eiffel-tower','eiffel tower','eiffel']
  };

  function cityFromText(value='') {
    const text = String(value).toLowerCase();
    for (const [city, words] of Object.entries(aliases)) {
      if (words.some(word => text.includes(word))) return city;
    }
    return 'paris';
  }

  function spotFromText(value='') {
    const text = String(value).toLowerCase();
    for (const [spot, words] of Object.entries(spotAliases)) {
      if (words.some(word => text.includes(word))) return spot;
    }
    return null;
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
    const explicitSpot = img.dataset.spot || img.closest('[data-spot]')?.dataset.spot || '';
    const spot = spotFromText(`${explicitSpot} ${img.alt || ''}`);
    const city = cityFromText(`${img.dataset.city || ''} ${img.closest('[data-city]')?.dataset.city || ''} ${img.alt || ''} ${explicitSpot}`);
    const current = img.currentSrc || img.src;
    const candidates = [];

    // Important: if we know the spot, do NOT start with a generic current city image.
    // The spot's own two candidates always win.
    if (spot && spotCatalog[spot]) {
      for (const url of spotCatalog[spot]) if (!candidates.includes(url)) candidates.push(url);
    } else if (current && !current.startsWith('data:image/')) {
      candidates.push(current);
    }

    for (const url of catalog[city] || []) if (!candidates.includes(url)) candidates.push(url);
    candidates.push(builtInFallback(city, img.alt || explicitSpot || 'SISTER TRIP'));
    return {city, spot, candidates};
  }

  function protectImage(img) {
    if (!(img instanceof HTMLImageElement) || img.dataset.stImageProtected === '1') return;
    img.dataset.stImageProtected = '1';
    img.decoding = 'async';
    const {city, spot, candidates} = candidatesFor(img);
    img.dataset.fallbackCity = city;
    if (spot) img.dataset.fallbackSpot = spot;
    img.dataset.imageCandidates = JSON.stringify(candidates);

    const current = img.currentSrc || img.src;
    const currentIndex = candidates.indexOf(current);
    img.dataset.imageAttempt = String(Math.max(currentIndex, 0));

    // If a spot is known but the rendered src is still a city-generic image, replace it immediately.
    if (spot && spotCatalog[spot]?.[0] && current !== spotCatalog[spot][0] && !spotCatalog[spot].includes(current)) {
      img.dataset.imageAttempt = '0';
      img.src = spotCatalog[spot][0];
    }

    img.addEventListener('error', () => {
      const list = JSON.parse(img.dataset.imageCandidates || '[]');
      const attempt = Number(img.dataset.imageAttempt || 0) + 1;
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
      const city = place.city || cityFromText(place.name);
      const spot = place.imageKey || spotFromText(`${place.id || ''} ${place.name || ''}`);
      if (spot && spotCatalog[spot]) {
        place.imageKey = spot;
        place.image = spotCatalog[spot][0];
        place.fallbackImages = [...spotCatalog[spot].slice(1), ...(catalog[city] || [])];
      } else {
        if (!place.image || /1653343860295|1597982437463/.test(place.image)) place.image = catalog[city]?.[0] || place.image;
        place.fallbackImage = catalog[city]?.[0] || null;
      }
    }

    for (const day of Object.values(demo.dayPlans || {})) {
      const city = day.city || 'paris';
      for (const item of day.items || []) {
        const place = item.placeId ? demo.mapPlaces?.find(p => p.id === item.placeId) : null;
        const spot = item.imageKey || place?.imageKey || spotFromText(`${item.placeId || ''} ${item.title || ''}`);
        if (spot && spotCatalog[spot]) {
          item.imageKey = spot;
          item.image = spotCatalog[spot][0];
        } else if (!item.image) {
          item.image = catalog[city]?.[0] || null;
        }
      }
    }
  }

  function patchStaticVisuals() {
    const hero = document.querySelector('.hero-image');
    if (hero) { hero.dataset.city = 'paris'; hero.dataset.spot = 'eiffel-tower'; hero.src = spotCatalog['eiffel-tower'][0]; }
    const feature = document.querySelector('.feature-card img');
    if (feature) { feature.dataset.city = 'paris'; feature.dataset.spot = 'eiffel-tower'; feature.src = spotCatalog['eiffel-tower'][0]; }
    const storyCover = document.querySelector('.story-cover img');
    if (storyCover) { storyCover.dataset.city = 'paris'; storyCover.dataset.spot = 'eiffel-tower'; storyCover.src = spotCatalog['eiffel-tower'][1]; }
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
      const urls = [...new Set([...Object.values(catalog).flat(), ...Object.values(spotCatalog).flat()])];
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

  window.SisterTripImages = {catalog, spotCatalog, install, protectImage, patchTripData, warmCache, builtInFallback, spotFromText};
})();
