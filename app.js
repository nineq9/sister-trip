const TRIP_START = new Date('2026-09-11T00:00:00+02:00');
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const demo = {
  cities: [
    {name:'Paris', country:'France', dates:'11–18 SEP'},
    {name:'Zürich', country:'Switzerland', dates:'18 SEP'},
    {name:'Luzern', country:'Switzerland', dates:'19–20 SEP'},
    {name:'Milano', country:'Italy', dates:'21–22 SEP'},
    {name:'Venezia', country:'Italy', dates:'23 SEP'},
    {name:'Firenze', country:'Italy', dates:'24 SEP'},
    {name:'Roma', country:'Italy', dates:'25–28 SEP'},
  ],
  schedule: [
    {time:'09:00', title:'Notre-Dame', meta:'島の朝 · FLEX', status:'flex', image:'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?auto=format&fit=crop&w=400&q=80'},
    {time:'10:15', title:"Musée d’Orsay", meta:'予約あり · LOCKED', status:'locked', image:'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=400&q=80'},
    {time:'17:00', title:'Invalides', meta:'ナポレオンの物語 · FLEX', status:'flex', image:'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=400&q=80'},
    {time:'18:00', title:'Rodin Museum', meta:'「考える人」だけ · WISH', status:'wish', image:'https://images.unsplash.com/photo-1597982437463-93095fbfbb6c?auto=format&fit=crop&w=400&q=80'},
    {time:'20:10', title:'AURA Invalides', meta:'有料・時間指定 · LOCKED', status:'locked', image:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80'},
  ],
  mapPlaces: [
    {
      id:'eiffel', name:'Eiffel Tower', lat:48.85837, lng:2.29448, tag:'today', code:'E',
      eyebrow:'TODAY · NIGHT', badge:'今夜', meta:'夜のパリ · FLEX',
      description:'見る時間で印象が変わる場所。夜のルートと物語をここから確認できます。',
      image:'https://images.unsplash.com/photo-1653343860295-2b07f992b7b2f?auto=format&fit=crop&w=700&q=88', action:'story'
    },
    {
      id:'orsay', name:"Musée d’Orsay", lat:48.85996, lng:2.32656, tag:'today', code:'O',
      eyebrow:'TODAY · LOCKED', badge:'10:15', meta:'予約あり · 時間固定',
      description:'ここは動かさない予定。前後のFLEXだけを組み替える基準点になります。',
      image:'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=700&q=88', action:'today'
    },
    {
      id:'invalides', name:'Invalides', lat:48.8566, lng:2.3126, tag:'today', code:'I',
      eyebrow:'TODAY · FLEX', badge:'17:00', meta:'ナポレオンの物語 · FLEX',
      description:'AURAまでの流れを壊さず調整できる場所。疲れた日は滞在時間を短くできます。',
      image:'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=700&q=88', action:'today'
    },
    {
      id:'montmartre', name:'Montmartre', lat:48.8867, lng:2.3431, tag:'wish', code:'M',
      eyebrow:'WISH · SUNSET', badge:'行きたい', meta:'夕暮れ候補 · WISH',
      description:'時間と天気が合えば入れたい候補。固定予定のすき間に入るかをアプリ側で判断します。',
      image:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=88', action:'wish'
    },
    {
      id:'opera', name:'Palais Garnier', lat:48.87197, lng:2.3316, tag:'wish', code:'G',
      eyebrow:'WISH · RIGHT BANK', badge:'行きたい', meta:'右岸ルート · WISH',
      description:'周辺の保存スポットとまとめやすい候補。近くへ来たときに優先表示します。',
      image:'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=700&q=88', action:'wish'
    },
    {
      id:'louvre', name:'Louvre', lat:48.8606, lng:2.3376, tag:'today', code:'L',
      eyebrow:'16 SEP · LOCKED', badge:'17:00', meta:'予約枠 · LOCKED',
      description:'予約時間を動かさず、その前後のルートを組み替える基準にします。',
      image:'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=700&q=88', action:'today'
    },
    {
      id:'stay', name:'Paris stay', lat:48.8687, lng:2.4178, tag:'stay', code:'⌂',
      eyebrow:'BASE · STAY', badge:'HOME', meta:'旅の拠点',
      description:'毎日の出発点と帰着点。正確な住所などの非公開情報は認証後だけ表示します。',
      image:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=88', action:'trip'
    },
  ],
  nearbyWish: {
    name:'妹1の保存スポット',
    meta:'カフェ · FLEXに追加可能',
    walk:'徒歩 7分',
    wishers:['1','A'],
    image:'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=500&q=80'
  },
  tripItems: [
    {type:'stay', icon:'⌂', title:'Paris stay', meta:'7 nights · 詳細は非公開データから表示', verified:true},
    {type:'move', icon:'↗', title:'Paris → Zürich', meta:'Night bus · LOCKED', verified:true},
    {type:'stay', icon:'⌂', title:'Zürich stay', meta:'Gmail予約確認を正として照合', verified:true},
    {type:'stay', icon:'⌂', title:'Luzern stay', meta:'Gmail予約確認を正として照合', verified:true},
    {type:'move', icon:'↗', title:'Luzern → Milano', meta:'Night bus · LOCKED', verified:true},
    {type:'stay', icon:'⌂', title:'Milano stay', meta:'Calendar差分を検知できる設計', verified:true},
    {type:'ticket', icon:'◇', title:'Timed tickets', meta:'有料・時間指定は自動でLOCKED', verified:true},
  ],
  quests: [
    {title:'王冠を失った王妃の最後の場所を探す', hint:'革命の後、彼女は宮殿ではなく「ある牢獄」にいました。', done:false},
    {title:'パリで「嫌われていた名所」を見つける', hint:'いまは街の象徴。でも完成当時は猛烈に批判されました。', done:true},
    {title:'1000以上の物語が光る壁を探す', hint:'壁よりも、色ガラスの方が目立つ礼拝堂です。', done:false},
    {title:'皇帝の墓が、なぜあんなに巨大なのか考える', hint:'「死後の演出」まで政治だったのかもしれません。', done:false},
    {title:'ルーヴルで、視線がこちらを追う人物を探す', hint:'作品を見るだけでなく、どこから見ても同じか試して。', done:false},
    {title:'夜のパリで「5分だけの光」を見る', hint:'毎時ちょうど、塔の表情が変わります。', done:false},
  ],
};

let map;
let markers = [];
let currentMapFilter = 'all';
let currentTripFilter = 'all';
let selectedMapPlaceId = null;

function daysUntilTrip() {
  const now = new Date();
  const diff = TRIP_START - now;
  return Math.max(0, Math.ceil(diff / 86400000));
}

function renderCountdown() {
  $('#countdownDays').textContent = daysUntilTrip();
}

function renderCities() {
  $('#cityRail').innerHTML = demo.cities.map((city, i) => `
    <button class="city-chip ${i === 0 ? 'active' : ''}" type="button" data-city-index="${i}">
      <span>${String(i + 1).padStart(2,'0')} · ${city.country.toUpperCase()}</span>
      <strong>${city.name}</strong>
      <em>${city.dates}</em>
    </button>`).join('');
  $$('.city-chip').forEach(btn => btn.addEventListener('click', () => {
    $$('.city-chip').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    showToast(`${demo.cities[Number(btn.dataset.cityIndex)].name} の物語は順次追加します`);
  }));
}

function renderTimeline() {
  $('#timeline').innerHTML = demo.schedule.map(item => `
    <article class="timeline-item ${item.status}">
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-line"><span class="timeline-dot"></span></div>
      <div class="timeline-card">
        <div>
          <h3>${item.title}</h3>
          <p>${item.meta}</p>
          <span class="status-badge ${item.status}">${item.status === 'locked' ? '🔒 LOCKED' : item.status === 'wish' ? '♡ WISH' : '◐ FLEX'}</span>
        </div>
        <img src="${item.image}" alt="${item.title}" loading="lazy" />
      </div>
    </article>`).join('');
}

function renderTrip(filter = currentTripFilter) {
  const items = demo.tripItems.filter(x => filter === 'all' || x.type === filter);
  $('#tripList').innerHTML = items.map(item => `
    <article class="trip-item" data-type="${item.type}">
      <span class="trip-icon">${item.icon}</span>
      <div><h3>${item.title}</h3><p>${item.meta}</p></div>
      <span class="verified">✓ VERIFIED</span>
    </article>`).join('');
}

function renderQuests() {
  $('#questList').innerHTML = demo.quests.map((q, i) => `
    <button class="quest-item ${q.done ? 'complete' : ''}" type="button" data-quest="${i}">
      <span class="quest-index">${String(i + 1).padStart(2,'0')}</span>
      <span><h3>${q.title}</h3><p>${q.done ? '発見済み · タップして振り返る' : 'タップするとヒントだけ見られます'}</p></span>
      <span class="quest-lock">${q.done ? '✓' : '⌁'}</span>
    </button>`).join('');
  $$('.quest-item').forEach(btn => btn.addEventListener('click', () => {
    const q = demo.quests[Number(btn.dataset.quest)];
    showToast(q.done ? `発見済み：${q.title}` : `ヒント：${q.hint}`);
  }));
}

function switchScreen(name) {
  $$('.screen').forEach(s => s.classList.toggle('active', s.dataset.screen === name));
  $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.nav === name));
  window.scrollTo({top: 0, behavior: 'smooth'});
  if (name === 'map') setTimeout(() => map?.invalidateSize(), 60);
}

function initNavigation() {
  $$('.nav-item').forEach(btn => btn.addEventListener('click', () => switchScreen(btn.dataset.nav)));
  $$('[data-open-screen]').forEach(btn => btn.addEventListener('click', () => switchScreen(btn.dataset.openScreen)));
}

function prepareMapExperience() {
  if (!$('#mapV2Styles')) {
    const link = document.createElement('link');
    link.id = 'mapV2Styles';
    link.rel = 'stylesheet';
    link.href = './map-v2.css';
    document.head.appendChild(link);
  }
  const sheet = $('.nearby-sheet');
  const wrap = $('.map-wrap');
  if (sheet && wrap && sheet.parentElement !== wrap) wrap.appendChild(sheet);
  renderMapSheet();
}

function renderMapSheet(placeId = selectedMapPlaceId) {
  const sheet = $('.nearby-sheet');
  if (!sheet) return;
  const place = placeId ? demo.mapPlaces.find(p => p.id === placeId) : null;

  if (!place) {
    const nearby = demo.nearbyWish;
    sheet.classList.remove('place-mode');
    sheet.innerHTML = `
      <div class="sheet-handle"></div>
      <div class="sheet-heading">
        <div>
          <p class="eyebrow">NEARBY WISH</p>
          <h2>この辺で寄れそう</h2>
        </div>
        <span class="distance-badge">${nearby.walk}</span>
      </div>
      <article class="nearby-card map-sheet-card">
        <img class="map-sheet-photo" src="${nearby.image}" alt="${nearby.name}" />
        <div class="nearby-copy">
          <strong>${nearby.name}</strong>
          <span>${nearby.meta}</span>
          <div class="wishers">${nearby.wishers.map(x => `<span>${x}</span>`).join('')}<em>${nearby.wishers.length}人が気になる</em></div>
        </div>
        <button class="small-plus" type="button" data-quick-add aria-label="FLEX候補に追加">＋</button>
      </article>`;
  } else {
    sheet.classList.add('place-mode');
    const actionLabel = place.action === 'story' ? '物語を見る' : place.action === 'trip' ? 'TRIPで見る' : place.action === 'wish' ? 'FLEX候補に' : '今日の予定';
    sheet.innerHTML = `
      <div class="sheet-handle"></div>
      <article class="selected-place-card">
        <img class="selected-place-photo" src="${place.image}" alt="${place.name}" />
        <div class="selected-place-copy">
          <div class="selected-place-kicker"><span>${place.eyebrow}</span><b>${place.badge}</b></div>
          <h2>${place.name}</h2>
          <p class="selected-place-meta">${place.meta}</p>
          <p class="selected-place-description">${place.description}</p>
        </div>
      </article>
      <div class="map-sheet-actions">
        <button class="map-sheet-secondary" type="button" data-map-close>近くを見る</button>
        <button class="map-sheet-primary" type="button" data-map-action="${place.action}">${actionLabel}<span>→</span></button>
      </div>`;
  }

  $('[data-quick-add]', sheet)?.addEventListener('click', () => showToast('WISHをFLEX候補に追加しました'));
  $('[data-map-close]', sheet)?.addEventListener('click', clearMapPlaceSelection);
  $('[data-map-action]', sheet)?.addEventListener('click', (event) => {
    const action = event.currentTarget.dataset.mapAction;
    if (action === 'story') {
      $('#storyDialog')?.showModal();
    } else if (action === 'trip') {
      switchScreen('trip');
    } else if (action === 'wish') {
      showToast(`${place.name} をFLEX候補に追加しました`);
    } else {
      switchScreen('today');
    }
  });
}

function updateSelectedMarkerStyles() {
  markers.forEach(({marker, place}) => {
    const bubble = marker.getElement()?.querySelector('.pin-bubble');
    if (bubble) bubble.classList.toggle('selected', place.id === selectedMapPlaceId);
  });
}

function selectMapPlace(placeId) {
  const place = demo.mapPlaces.find(p => p.id === placeId);
  if (!place) return;
  selectedMapPlaceId = placeId;
  updateSelectedMarkerStyles();
  renderMapSheet(placeId);
  if (map) {
    const targetZoom = Math.max(map.getZoom(), 14);
    map.flyTo([place.lat, place.lng], targetZoom, {duration:.35});
  }
}

function clearMapPlaceSelection() {
  selectedMapPlaceId = null;
  updateSelectedMarkerStyles();
  renderMapSheet();
}

function initMap() {
  if (!window.L || !navigator.onLine) {
    showOfflineMap();
    return;
  }
  map = L.map('map', {zoomControl:false, attributionControl:true}).setView([48.865, 2.342], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:'© OpenStreetMap'
  }).addTo(map);
  L.control.zoom({position:'bottomleft'}).addTo(map);
  map.on('click', clearMapPlaceSelection);
  renderMapMarkers('all');
}

function renderMapMarkers(filter) {
  if (!map) return;
  markers.forEach(({marker}) => map.removeLayer(marker));
  markers = [];
  const points = demo.mapPlaces.filter(p => filter === 'all' || p.tag === filter || (filter === 'today' && p.tag === 'stay'));
  points.forEach(p => {
    const icon = L.divIcon({
      className:'custom-pin',
      html:`<div class="pin-bubble ${p.tag} ${p.id === selectedMapPlaceId ? 'selected' : ''}">${p.code}</div>`,
      iconSize:[42,42], iconAnchor:[21,21]
    });
    const marker = L.marker([p.lat,p.lng], {icon, title:p.name, bubblingMouseEvents:false}).addTo(map);
    marker.on('click', () => selectMapPlace(p.id));
    markers.push({marker, place:p});
  });
  if (points.length) {
    map.fitBounds(L.latLngBounds(points.map(p => [p.lat,p.lng])), {
      paddingTopLeft:[42,42],
      paddingBottomRight:[42,190],
      maxZoom:14
    });
  }
}

function showOfflineMap() {
  $('#map').hidden = true;
  $('#offlineMap').hidden = false;
}

function updateOnlineState() {
  if (!navigator.onLine) {
    showOfflineMap();
    showToast('オフライン簡易マップに切り替えました');
  } else if ($('#screen-map').classList.contains('active') && !map && window.L) {
    $('#map').hidden = false;
    $('#offlineMap').hidden = true;
    initMap();
  }
}

function initFilters() {
  $$('#mapFilters button').forEach(btn => btn.addEventListener('click', () => {
    $$('#mapFilters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMapFilter = btn.dataset.filter;
    selectedMapPlaceId = null;
    renderMapSheet();
    renderMapMarkers(currentMapFilter);
  }));
  $$('#tripFilters button').forEach(btn => btn.addEventListener('click', () => {
    $$('#tripFilters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTripFilter = btn.dataset.tripFilter;
    renderTrip(currentTripFilter);
  }));
}

function initReplan() {
  const dialog = $('#replanDialog');
  $('#replanButton').addEventListener('click', () => dialog.showModal());
  $$('[data-replan]').forEach(btn => btn.addEventListener('click', () => {
    const result = $('#replanResult');
    const plans = {
      delay: ['AURA 20:10は固定します。','Rodin MuseumをWISHへ戻し、Invalidesの滞在を20分短縮。移動バッファを25分確保します。'],
      tired: ['今日は「見る数」を減らします。','LOCKEDのOrsayとAURAは維持。Rodinを明日候補へ移し、夕方に45分の休憩を入れます。'],
      rain: ['屋内中心に組み替えます。','LOCKEDはそのまま。屋外WISHは後日に回し、近くの屋内候補を優先します。'],
    };
    const [title, copy] = plans[btn.dataset.replan];
    result.innerHTML = `<strong>${title}</strong>${copy}`;
    result.hidden = false;
  }));
}

function initAddPlace() {
  const dialog = $('#addPlaceDialog');
  $('#addPlaceButton').addEventListener('click', () => dialog.showModal());
  $('#addPlaceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const item = {place: form.get('place'), member:form.get('member'), priority:form.get('priority')};
    const saved = JSON.parse(localStorage.getItem('sisterTripWishes') || '[]');
    saved.push({...item, createdAt:Date.now()});
    localStorage.setItem('sisterTripWishes', JSON.stringify(saved));
    dialog.close();
    e.currentTarget.reset();
    showToast(`${item.member} の「${item.place}」を保存しました`);
  });
}

function initStories() {
  const dialog = $('#storyDialog');
  $$('[data-open-story]').forEach(btn => btn.addEventListener('click', () => dialog.showModal()));
  $('#storyClose').addEventListener('click', () => dialog.close());
  $$('[data-speak]').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.speak, btn)));
}

function speak(text) {
  if (!('speechSynthesis' in window)) {
    showToast('この端末では読み上げを利用できません');
    return;
  }
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    showToast('音声を停止しました');
    return;
  }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP';
  u.rate = .96;
  speechSynthesis.speak(u);
  showToast('音声ガイドを再生します');
}

function showToast(message) {
  const t = $('#toast');
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => t.classList.remove('show'), 2600);
}

function initOfflineDialog() {
  $('#offlineButton').addEventListener('click', () => $('#offlineDialog').showModal());
}

function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
}

function init() {
  renderCountdown();
  renderCities();
  renderTimeline();
  renderTrip();
  renderQuests();
  initNavigation();
  prepareMapExperience();
  initFilters();
  initReplan();
  initAddPlace();
  initStories();
  initOfflineDialog();
  initServiceWorker();
  initMap();
  window.addEventListener('online', updateOnlineState);
  window.addEventListener('offline', updateOnlineState);
  setInterval(renderCountdown, 3600000);
}

document.addEventListener('DOMContentLoaded', init);