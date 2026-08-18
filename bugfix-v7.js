/* Sister Trip v8 — focused QA fixes for MAP and TRIP. */
(() => {
  let installed = false;

  function activeScreenName() {
    return document.querySelector('.screen.active')?.dataset.screen || 'home';
  }

  function liveMap() {
    try { return typeof map !== 'undefined' ? map : window.map; } catch (_) { return window.map; }
  }

  function syncViewportForScreen(name = activeScreenName()) {
    document.body.classList.toggle('sister-map-active', name === 'map');
    if (name === 'trip') {
      // Safari can preserve the old page offset across tab-like screen switches.
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.getElementById('screen-trip')?.scrollIntoView({block:'start', inline:'nearest'});
        window.scrollTo(0, 0);
      });
      setTimeout(() => window.scrollTo(0, 0), 120);
    }
    if (name === 'map') {
      setTimeout(() => liveMap()?.invalidateSize?.(), 80);
    }
  }

  function setSheetCollapsed(sheet, collapsed) {
    const wrap = sheet?.closest('.map-wrap');
    if (!sheet || !wrap) return;
    sheet.classList.toggle('collapsed', collapsed);
    wrap.classList.toggle('sheet-collapsed', collapsed);
    if (!collapsed) sheet.scrollTo({top:0, behavior:'auto'});
  }

  function enhanceMapSheet(root = document) {
    const sheet = root.matches?.('.nearby-sheet') ? root : root.querySelector?.('.nearby-sheet') || document.querySelector('.nearby-sheet');
    if (!sheet) return;

    const handle = sheet.querySelector('.sheet-handle');
    if (handle && handle.dataset.v8Toggle !== '1') {
      handle.dataset.v8Toggle = '1';
      handle.setAttribute('role','button');
      handle.setAttribute('tabindex','0');
      handle.setAttribute('aria-label','おすすめ一覧を開閉');
      const toggle = event => {
        event?.preventDefault?.();
        event?.stopPropagation?.();
        setSheetCollapsed(sheet, !sheet.classList.contains('collapsed'));
      };
      handle.addEventListener('click', toggle);
      handle.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        toggle(event);
      });
    }

    // Recommendation sheets should be open enough to show the first card, then
    // the sheet itself becomes the single Safari scroll container.
    if (sheet.classList.contains('discover-mode') && !sheet.dataset.v8Initialised) {
      sheet.dataset.v8Initialised = '1';
      setSheetCollapsed(sheet, false);
    }
  }

  const titleReplacements = new Map([
    ['BEG → CDG · Air Serbia JU240','ベオグラード → パリ（CDG）・Air Serbia JU240'],
    ['Paris stay','パリの宿'],
    ['Paris → Zürich · FlixBus','パリ → チューリッヒ・FlixBus'],
    ['Paris → Zürich','パリ → チューリッヒ'],
    ['Viadukt Apartments · Zürich','Viadukt Apartments・チューリッヒ'],
    ['Zürich stay','チューリッヒの宿'],
    ['Luzern stay','ルツェルンの宿'],
    ['Luzern → Milano','ルツェルン → ミラノ'],
    ['Milano stay','ミラノの宿'],
    ['Venezia stay','ヴェネツィアの宿'],
    ['Firenze stay','フィレンツェの宿'],
    ['Roma stay','ローマの宿']
  ]);

  function localizeTrip() {
    const screen = document.getElementById('screen-trip');
    if (!screen) return;
    screen.querySelectorAll('.verified').forEach(el => {
      if (/VERIFIED/i.test(el.textContent || '')) el.textContent = '✓ 確認済み';
    });
    screen.querySelectorAll('.trip-item h3').forEach(title => {
      const raw = (title.textContent || '').trim();
      if (titleReplacements.has(raw)) title.textContent = titleReplacements.get(raw);
    });
  }

  function repairTripIfNeeded() {
    const screen = document.getElementById('screen-trip');
    if (!screen) return;
    const cards = [...screen.querySelectorAll('.trip-item')];
    const missingText = cards.length && cards.filter(card => !(card.querySelector('h3')?.textContent || '').trim()).length > cards.length / 2;
    if (missingText && typeof renderTrip === 'function') {
      try { renderTrip(typeof currentTripFilter !== 'undefined' ? currentTripFilter : 'all'); } catch (_) {}
    }
    localizeTrip();
  }

  function bindNavigation() {
    document.querySelectorAll('.nav-item,[data-open-screen]').forEach(button => {
      if (button.dataset.v8Viewport === '1') return;
      button.dataset.v8Viewport = '1';
      button.addEventListener('click', () => {
        const name = button.dataset.nav || button.dataset.openScreen;
        if (!name) return;
        setTimeout(() => {
          syncViewportForScreen(name);
          if (name === 'map') enhanceMapSheet();
          if (name === 'trip') repairTripIfNeeded();
        }, 20);
      });
    });
  }

  function installObserver() {
    const observer = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches?.('.nearby-sheet,.discover-list,.sheet-heading,.sheet-handle') || node.querySelector?.('.nearby-sheet,.discover-list,.sheet-heading,.sheet-handle')) enhanceMapSheet(node);
          if (node.closest?.('#screen-trip') || node.querySelector?.('#screen-trip,.trip-item,.verified')) localizeTrip();
        }
      }
      bindNavigation();
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }

  function install() {
    if (installed) return;
    installed = true;
    bindNavigation();
    enhanceMapSheet();
    repairTripIfNeeded();
    syncViewportForScreen();
    installObserver();
  }

  window.SisterTripBugfixV7Install = install;
})();
