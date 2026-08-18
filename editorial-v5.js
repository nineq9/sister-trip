/* Sister Trip v5 — photo-first editorial experience and map usability fixes. */
(() => {
  const v4 = window.SisterTripV4Data;
  if (!v4 || typeof demo === 'undefined') return;

  const escapeHtml = (value='') => String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

  function installCss() {
    if (document.querySelector('link[href="./editorial-v5.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './editorial-v5.css';
    document.head.appendChild(link);
  }

  function enhanceHome() {
    document.body.classList.add('editorial-v5');
    const chips = [...document.querySelectorAll('#cityRail .city-chip')];
    chips.forEach((chip, index) => {
      const city = demo.cities?.[index];
      if (!city) return;
      const image = city.image || window.SisterTripImages?.catalog?.[city.id]?.[0] || '';
      if (image) chip.style.setProperty('--city-image', `url("${image}")`);
      chip.dataset.editorialCity = city.id || String(index);
    });
  }

  function enhanceTripHero() {
    const screen = document.getElementById('screen-trip');
    const filters = screen?.querySelector('.trip-segments');
    if (!screen || !filters || screen.querySelector('.trip-editorial-hero')) return;
    const paris = demo.cities?.find(city => city.id === 'paris') || demo.cities?.[0];
    const hero = document.createElement('article');
    hero.className = 'trip-editorial-hero';
    hero.innerHTML = `
      <img src="${escapeHtml(paris?.image || '')}" alt="旅の予約と移動" data-city="paris" />
      <div class="trip-editorial-copy">
        <span>THE JOURNEY FILE</span>
        <h2>旅の全部を、ひとつの場所に。</h2>
        <p>ホテル、移動、予約、チケット。必要な瞬間だけ開けばいい。</p>
      </div>`;
    filters.insertAdjacentElement('beforebegin', hero);
    window.SisterTripImages?.protectImage(hero.querySelector('img'));
  }

  function keepMapVisible() {
    const sheet = document.querySelector('.map-screen .nearby-sheet');
    const wrap = document.querySelector('.map-screen .map-wrap');
    const controls = document.querySelector('.map-v4-discover-controls');
    if (controls) {
      controls.style.pointerEvents = 'auto';
      controls.querySelectorAll('button,select').forEach(el => {
        el.style.pointerEvents = 'auto';
        el.style.touchAction = 'manipulation';
      });
    }
    if (!sheet || !wrap || sheet.dataset.v5InitialState === '1') return;
    sheet.dataset.v5InitialState = '1';
    sheet.classList.add('collapsed');
    wrap.classList.add('sheet-collapsed');
    setTimeout(() => window.map?.invalidateSize?.(), 60);
  }

  function recommendationById(id) {
    return (v4.recommendations || []).find(rec => rec.id === id) || null;
  }

  function enhanceRecommendationCards(root=document) {
    root.querySelectorAll?.('.discover-card[data-rec-id]').forEach(card => {
      const rec = recommendationById(card.dataset.recId);
      if (!rec) return;

      const cost = card.querySelector('.discover-chip.cost');
      if (cost && rec.price) cost.textContent = rec.price;
      const meta = card.querySelector('.discover-card-meta');
      if (meta && rec.yen && !meta.querySelector('.v5-yen')) {
        const chip = document.createElement('span');
        chip.className = 'discover-chip v5-yen';
        chip.textContent = rec.yen;
        meta.appendChild(chip);
      }
      if (meta && rec.party && !meta.querySelector('.v5-party')) {
        const chip = document.createElement('span');
        chip.className = 'discover-chip v5-party';
        chip.textContent = rec.party;
        meta.appendChild(chip);
      }
      const freshness = card.querySelector('.discover-freshness');
      if (freshness && rec.checked) freshness.textContent = `${rec.tip || ''} · 確認 ${rec.checked}`;

      if (card.parentElement?.classList.contains('discover-card-wrap')) return;
      const parent = card.parentNode;
      if (!parent) return;
      const wrap = document.createElement('div');
      wrap.className = 'discover-card-wrap';
      parent.insertBefore(wrap, card);
      wrap.appendChild(card);

      const sourceRow = document.createElement('div');
      sourceRow.className = 'discover-source-row';
      sourceRow.innerHTML = `<span>価格は目安。現地で最終確認</span>${rec.sourceUrl ? `<a href="${escapeHtml(rec.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(rec.sourceLabel || '情報源')} ↗</a>` : '<span>出典確認中</span>'}`;
      wrap.appendChild(sourceRow);
    });
  }

  function repairReservationCopy() {
    const conflict = document.querySelector('.conflict-card');
    if (!conflict) return;
    const text = conflict.textContent || '';
    if (!text.includes('Paris stay') && !text.includes('人数条件')) return;
    conflict.innerHTML = `
      <div class="conflict-top"><span>!</span><strong>いま確認が必要なのは2つ</strong></div>
      <div class="compare-row"><span>AURA Invalides</span><b>未購入</b></div>
      <p>9/12 21:35の3名分を希望中。オンライン購入は未完了で、先方から電話決済の案内が届いています。</p>
      <div class="compare-row"><span>Roma stay / 帰宅</span><b>未登録</b></div>
      <p>ローマ宿と9/28の帰宅移動は、確定予約をまだ登録していません。</p>`;
  }

  function installObserver() {
    const observer = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          enhanceRecommendationCards(node.matches?.('.discover-card') ? node.parentElement || node : node);
        }
      }
      enhanceHome();
      enhanceTripHero();
      keepMapVisible();
      repairReservationCopy();
    });
    observer.observe(document.body, {childList:true, subtree:true});
  }

  function install() {
    installCss();
    document.body.classList.add('editorial-v5');
    enhanceHome();
    enhanceTripHero();
    keepMapVisible();
    enhanceRecommendationCards();
    repairReservationCopy();
    installObserver();

    document.querySelectorAll('[data-nav="map"],[data-open-screen="map"]').forEach(button => {
      button.addEventListener('click', () => setTimeout(() => {
        keepMapVisible();
        window.map?.invalidateSize?.();
      }, 120));
    });
  }

  window.SisterTripEditorialV5Install = install;
})();
