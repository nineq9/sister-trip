/* Sister Trip v7 — focused QA fixes for MAP and TRIP. */
(() => {
  let installed = false;

  function activeScreenName() {
    return document.querySelector('.screen.active')?.dataset.screen || 'home';
  }

  function syncViewportForScreen(name = activeScreenName()) {
    const isMap = name === 'map';
    document.body.classList.toggle('sister-map-active', isMap);
    if (name === 'map' || name === 'trip') {
      window.scrollTo({top:0,left:0,behavior:'auto'});
    }
    if (isMap) {
      setTimeout(() => {
        try {
          const liveMap = typeof map !== 'undefined' ? map : window.map;
          liveMap?.invalidateSize?.();
        } catch (_) {}
      }, 80);
    }
  }

  function toggleSheet(sheet) {
    const wrap = sheet?.closest('.map-wrap');
    if (!sheet || !wrap) return;
    const collapsed = sheet.classList.toggle('collapsed');
    wrap.classList.toggle('sheet-collapsed', collapsed);
    if (!collapsed) {
      setTimeout(() => sheet.querySelector('.discover-list')?.scrollTo({top:0,behavior:'auto'}), 20);
    }
  }

  function enhanceMapSheet(root = document) {
    const sheet = root.matches?.('.nearby-sheet') ? root : root.querySelector?.('.nearby-sheet') || document.querySelector('.nearby-sheet');
    if (!sheet) return;

    const heading = sheet.querySelector('.sheet-heading');
    if (heading && heading.dataset.v7Toggle !== '1') {
      heading.dataset.v7Toggle = '1';
      heading.setAttribute('role','button');
      heading.setAttribute('tabindex','0');
      heading.setAttribute('aria-label','おすすめ一覧を開閉');
      heading.addEventListener('click', event => {
        if (event.target.closest('a,button,select')) return;
        toggleSheet(sheet);
      });
      heading.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        toggleSheet(sheet);
      });
    }

    const list = sheet.querySelector('.discover-list');
    if (list) {
      list.setAttribute('tabindex','0');
      list.setAttribute('aria-label','おすすめ一覧');
    }
  }

  const titleReplacements = [
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
  ];

  function localizeTrip(root = document) {
    const screen = document.getElementById('screen-trip');
    if (!screen) return;
    screen.querySelectorAll('.verified').forEach(el => {
      const text = (el.textContent || '').trim();
      if (/VERIFIED/i.test(text)) el.textContent = '✓ 確認済み';
    });
    screen.querySelectorAll('.trip-item h3').forEach(title => {
      let text = (title.textContent || '').trim();
      for (const [from,to] of titleReplacements) {
        if (text === from) { text = to; break; }
      }
      title.textContent = text;
    });
  }

  function bindNavigation() {
    document.querySelectorAll('.nav-item,[data-open-screen]').forEach(button => {
      if (button.dataset.v7Viewport === '1') return;
      button.dataset.v7Viewport = '1';
      button.addEventListener('click', () => {
        const name = button.dataset.nav || button.dataset.openScreen;
        if (!name) return;
        setTimeout(() => {
          syncViewportForScreen(name);
          if (name === 'map') enhanceMapSheet();
          if (name === 'trip') localizeTrip();
        }, 0);
      });
    });
  }

  function installObserver() {
    const observer = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches?.('.nearby-sheet,.discover-list,.sheet-heading') || node.querySelector?.('.nearby-sheet,.discover-list,.sheet-heading')) enhanceMapSheet(node);
          if (node.closest?.('#screen-trip') || node.querySelector?.('#screen-trip,.trip-item,.verified')) localizeTrip(node);
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
    localizeTrip();
    syncViewportForScreen();
    installObserver();
  }

  window.SisterTripBugfixV7Install = install;
})();
