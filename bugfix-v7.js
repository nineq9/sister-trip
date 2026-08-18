/* Sister Trip v9 — unified MAP control + full recommendation cards + TRIP root-cause repair. */
(() => {
  let installed = false;

  function activeScreenName() {
    return document.querySelector('.screen.active')?.dataset.screen || 'home';
  }

  function liveMap() {
    try { return typeof map !== 'undefined' ? map : window.map; } catch (_) { return window.map; }
  }

  function currentCityId() {
    try { return typeof currentMapCityId !== 'undefined' ? currentMapCityId : 'paris'; } catch (_) { return 'paris'; }
  }

  function currentFilterValue() {
    try { return typeof currentMapFilter !== 'undefined' ? currentMapFilter : 'all'; } catch (_) { return 'all'; }
  }

  function syncViewportForScreen(name = activeScreenName()) {
    document.body.classList.toggle('sister-map-active', name === 'map');
    if (name === 'trip') {
      requestAnimationFrame(() => window.scrollTo({top:0,left:0,behavior:'auto'}));
      setTimeout(() => window.scrollTo({top:0,left:0,behavior:'auto'}), 80);
    }
    if (name === 'map') {
      setTimeout(() => liveMap()?.invalidateSize?.(), 80);
    }
  }

  function contextOptions() {
    const days = Object.entries(typeof demo !== 'undefined' ? (demo.dayPlans || {}) : {});
    return [
      '<option value="current">現在地</option>',
      ...days.map(([key, day]) => `<option value="${key}">予定地・${day.date}</option>`)
    ].join('');
  }

  function cityOptions() {
    const cities = typeof demo !== 'undefined' ? (demo.cities || []) : [];
    return [
      '<option value="journey">EUROPE</option>',
      ...cities.map(city => `<option value="${city.id}">${city.name}</option>`)
    ].join('');
  }

  function ensureUnifiedMapBar() {
    const header = document.querySelector('.map-screen .map-header-panel');
    const originalCity = document.getElementById('mapCitySelect');
    const originalDay = document.getElementById('mapDiscoverDay');
    if (!header || !originalCity || !originalDay) return;

    let bar = header.querySelector('.map-unified-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'map-unified-bar';
      bar.setAttribute('aria-label','地図の表示条件');
      bar.innerHTML = `
        <label class="map-unified-field city">
          <span class="sr-only">街</span>
          <select id="mapUnifiedCity" aria-label="街を選ぶ">${cityOptions()}</select>
        </label>
        <label class="map-unified-field context">
          <span class="sr-only">現在地または予定日</span>
          <select id="mapUnifiedContext" aria-label="現在地または予定日を選ぶ">${contextOptions()}</select>
        </label>
        <label class="map-unified-field filter">
          <span class="sr-only">表示する場所</span>
          <select id="mapUnifiedFilter" aria-label="表示する場所を選ぶ">
            <option value="all">すべて</option>
            <option value="today">今日</option>
            <option value="wish">行きたい</option>
          </select>
        </label>`;
      header.appendChild(bar);

      const city = bar.querySelector('#mapUnifiedCity');
      const context = bar.querySelector('#mapUnifiedContext');
      const filter = bar.querySelector('#mapUnifiedFilter');

      city.addEventListener('change', () => {
        const target = document.getElementById('mapCitySelect');
        if (!target) return;
        target.value = city.value;
        target.dispatchEvent(new Event('change',{bubbles:true}));
        setTimeout(syncUnifiedMapBar, 30);
      });

      context.addEventListener('change', () => {
        if (context.value === 'current') {
          const currentButton = document.querySelector('[data-discover-mode="current"]');
          if (currentButton) currentButton.click();
          else window.SisterTripFeaturesV4?.requestCurrentLocation?.();
          setTimeout(syncUnifiedMapBar, 30);
          return;
        }
        const daySelect = document.getElementById('mapDiscoverDay');
        if (!daySelect) return;
        daySelect.value = context.value;
        daySelect.dispatchEvent(new Event('change',{bubbles:true}));
        setTimeout(syncUnifiedMapBar, 30);
      });

      filter.addEventListener('change', () => {
        document.querySelector(`#mapFilters [data-filter="${filter.value}"]`)?.click();
        setTimeout(syncUnifiedMapBar, 30);
      });
    }

    document.body.classList.add('map-unified-ready');
    syncUnifiedMapBar();
  }

  function syncUnifiedMapBar() {
    const bar = document.querySelector('.map-unified-bar');
    if (!bar) return;
    const city = bar.querySelector('#mapUnifiedCity');
    const context = bar.querySelector('#mapUnifiedContext');
    const filter = bar.querySelector('#mapUnifiedFilter');
    if (city) city.value = currentCityId();

    const featureState = window.SisterTripFeaturesV4?.state;
    if (context) {
      if (featureState?.discoverMode === 'current') context.value = 'current';
      else context.value = featureState?.discoverDay || document.getElementById('mapDiscoverDay')?.value || '09-12';
    }
    if (filter) filter.value = currentFilterValue();
  }

  function openRecommendationSheet() {
    const sheet = document.querySelector('.map-screen .nearby-sheet');
    const wrap = sheet?.closest('.map-wrap');
    if (!sheet || !wrap || !sheet.classList.contains('discover-mode')) return;
    sheet.classList.remove('collapsed');
    wrap.classList.remove('sheet-collapsed');
  }

  const titleReplacements = new Map([
    ['BEG → CDG · Air Serbia JU240','ベオグラード → パリ（CDG）・Air Serbia JU240'],
    ['Paris stay','パリの宿'],
    ['Paris → Zürich · FlixBus','パリ → チューリッヒ・FlixBus'],
    ['Paris → Zürich','パリ → チューリッヒ'],
    ['Viadukt Apartments · Zürich','Viadukt Apartments・チューリッヒ'],
    ['Lindt Home of Chocolate','Lindt Home of Chocolate'],
    ['Luzern Youth Hostel','ルツェルン Youth Hostel'],
    ['SBB nature day','SBB 1日乗車券'],
    ['Luzern → Milano · FlixBus','ルツェルン → ミラノ・FlixBus'],
    ['Star Hostel San Siro Fiera','Star Hostel San Siro Fiera・ミラノ'],
    ['Milano → Venezia Mestre · FlixBus','ミラノ → ヴェネツィア・メストレ・FlixBus'],
    ['S Marco Apartments · Mestre','S Marco Apartments・メストレ'],
    ['Venezia → Firenze · train','ヴェネツィア → フィレンツェ・列車'],
    ['hu Firenze Camping in Town','hu Firenze Camping in Town・フィレンツェ'],
    ['Firenze → Roma · train','フィレンツェ → ローマ・列車'],
    ['Roma stay','ローマの宿'],
    ['Return home','帰宅移動']
  ]);

  function localizeTrip() {
    const screen = document.getElementById('screen-trip');
    if (!screen) return;

    // IMPORTANT: `.verified` is also a status class on the whole article.
    // Only touch the direct badge child, otherwise textContent would erase the card.
    screen.querySelectorAll('.trip-item > .verified').forEach(badge => {
      const text = (badge.textContent || '').trim();
      if (/VERIFIED/i.test(text)) badge.textContent = '✓ 確認済み';
      else if (/CHECK/i.test(text)) badge.textContent = '! 要確認';
      else if (/PLANNED/i.test(text)) badge.textContent = '◌ 計画中';
    });

    screen.querySelectorAll('.trip-item h3').forEach(title => {
      const raw = (title.textContent || '').trim();
      if (titleReplacements.has(raw)) title.textContent = titleReplacements.get(raw);
    });
  }

  function restoreTripCards() {
    // Previous v8 accidentally replaced the textContent of verified rows.
    // Re-render from demo data once, then localize only the badge child.
    try {
      if (typeof renderTrip === 'function') {
        const filter = typeof currentTripFilter !== 'undefined' ? currentTripFilter : 'all';
        renderTrip(filter);
      }
    } catch (_) {}
    localizeTrip();
  }

  function bindNavigation() {
    document.querySelectorAll('.nav-item,[data-open-screen]').forEach(button => {
      if (button.dataset.v9Viewport === '1') return;
      button.dataset.v9Viewport = '1';
      button.addEventListener('click', () => {
        const name = button.dataset.nav || button.dataset.openScreen;
        if (!name) return;
        setTimeout(() => {
          syncViewportForScreen(name);
          if (name === 'map') {
            ensureUnifiedMapBar();
            openRecommendationSheet();
            liveMap()?.invalidateSize?.();
          }
          if (name === 'trip') restoreTripCards();
        }, 30);
      });
    });
  }

  function bindOriginalControlSync() {
    ['mapCitySelect','mapDiscoverDay'].forEach(id => {
      const el = document.getElementById(id);
      if (!el || el.dataset.v9Sync === '1') return;
      el.dataset.v9Sync = '1';
      el.addEventListener('change', () => setTimeout(syncUnifiedMapBar, 20));
    });
    document.querySelectorAll('#mapFilters [data-filter],[data-discover-mode]').forEach(el => {
      if (el.dataset.v9Sync === '1') return;
      el.dataset.v9Sync = '1';
      el.addEventListener('click', () => setTimeout(syncUnifiedMapBar, 20));
    });
  }

  function installObserver() {
    const observer = new MutationObserver(records => {
      let mapChanged = false;
      let tripChanged = false;
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches?.('.map-header-panel,.nearby-sheet,.discover-card,.map-v4-discover-controls') || node.querySelector?.('.map-header-panel,.nearby-sheet,.discover-card,.map-v4-discover-controls')) mapChanged = true;
          if (node.closest?.('#screen-trip') || node.querySelector?.('#screen-trip,.trip-item')) tripChanged = true;
        }
      }
      if (mapChanged) {
        ensureUnifiedMapBar();
        bindOriginalControlSync();
      }
      if (tripChanged) localizeTrip();
      bindNavigation();
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }

  function install() {
    if (installed) return;
    installed = true;
    bindNavigation();
    ensureUnifiedMapBar();
    bindOriginalControlSync();
    restoreTripCards();
    syncViewportForScreen();
    if (activeScreenName() === 'map') openRecommendationSheet();
    installObserver();
  }

  window.SisterTripBugfixV7Install = install;
})();
