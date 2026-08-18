/* Sister Trip v4 — expandable day/trip cards, city stories, ticket vault and NOW/PLAN discovery. */
(() => {
  const V4 = window.SisterTripV4Data;
  if (!V4) return;

  const escapeHtml = (value='') => String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  const mapIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15"/><path d="M15 6v15"/></svg>`;
  const state = {
    installed:false,
    storyCity:'paris',
    discoverMode:'plan',
    discoverDay: typeof selectedTripDayKey !== 'undefined' ? selectedTripDayKey : '09-12',
    userLocation:null,
    locationMarker:null,
    discoverMarkers:[],
    discoveryEnabled:true,
    mapSheetBase:null,
    timelineBase:null,
    tripBase:null
  };

  function ensureCss() {
    if (document.querySelector('link[href="./features-v4.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './features-v4.css';
    document.head.appendChild(link);
  }

  function placeById(id) {
    return (demo.mapPlaces || []).find(place => place.id === id) || null;
  }

  function statusLabel(status) {
    return status === 'locked' ? '🔒 LOCKED' : status === 'wish' ? '♡ WISH' : '◐ FLEX';
  }

  function closeOtherTimelineRows(keep) {
    document.querySelectorAll('.timeline-item.is-expanded').forEach(row => {
      if (row !== keep) row.classList.remove('is-expanded');
    });
  }

  function enhanceTimeline() {
    document.querySelectorAll('#timeline .timeline-item').forEach(row => {
      if (row.dataset.v4Enhanced === '1') return;
      row.dataset.v4Enhanced = '1';
      const card = row.querySelector('.timeline-card');
      const placeId = row.dataset.timelinePlace || '';
      const place = placeById(placeId);
      if (!card || !place) return;

      card.setAttribute('aria-expanded', 'false');
      card.setAttribute('aria-label', `${place.name} の詳細を開く`);
      const extraInfo = V4.placeDetails[place.id] || {};
      const extra = document.createElement('div');
      extra.className = 'timeline-extra';
      extra.setAttribute('aria-hidden', 'true');
      extra.innerHTML = `
        <div class="timeline-detail-row"><b>この場所</b><span>${escapeHtml(place.description || place.meta || '')}</span></div>
        ${extraInfo.look ? `<div class="timeline-detail-row"><b>見るもの</b><span>${escapeHtml(extraInfo.look)}</span></div>` : ''}
        ${extraInfo.stay ? `<div class="timeline-detail-row"><b>目安</b><span>${escapeHtml(extraInfo.stay)}</span></div>` : ''}
        ${extraInfo.note ? `<div class="timeline-detail-row"><b>旅メモ</b><span>${escapeHtml(extraInfo.note)}</span></div>` : ''}
        <div class="timeline-detail-row"><b>予定</b><span>${escapeHtml(statusLabel(row.classList.contains('locked') ? 'locked' : row.classList.contains('wish') ? 'wish' : 'flex'))}</span></div>
        <button class="timeline-map-button" type="button" data-v4-map-place="${escapeHtml(place.id)}">${mapIcon}<span>MAPでこの場所を見る</span></button>`;
      card.insertAdjacentElement('afterend', extra);

      card.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        const willOpen = !row.classList.contains('is-expanded');
        closeOtherTimelineRows(row);
        row.classList.toggle('is-expanded', willOpen);
        card.setAttribute('aria-expanded', String(willOpen));
        extra.setAttribute('aria-hidden', String(!willOpen));
      });

      extra.querySelector('[data-v4-map-place]')?.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        if (typeof setMapCity === 'function') setMapCity(place.city, false);
        switchScreen('map');
        setTimeout(() => {
          if (typeof selectMapPlace === 'function') selectMapPlace(place.id);
        }, 110);
      });
    });
  }

  function wrapTimeline() {
    if (state.timelineBase) return;
    state.timelineBase = renderTimeline;
    renderTimeline = function renderTimelineV4(...args) {
      const result = state.timelineBase.apply(this, args);
      enhanceTimeline();
      syncDiscoverDaySelect();
      return result;
    };
    renderTimeline();
  }

  function reservationForTitle(title='') {
    return V4.reservationDetails.find(item => String(title).includes(item.match)) || null;
  }

  function closeOtherTripItems(keep) {
    document.querySelectorAll('#tripList .trip-item.is-expanded').forEach(card => {
      if (card === keep) return;
      card.classList.remove('is-expanded');
      card.nextElementSibling?.classList.remove('is-open');
      card.setAttribute('aria-expanded','false');
    });
  }

  function privateDetailsToBullets(details) {
    if (!details || typeof details !== 'object') return [];
    const labels = {address:'住所',check_in:'チェックイン',check_out:'チェックアウト',guests:'人数',room:'部屋',payment:'支払い',luggage:'荷物',note:'メモ',access:'入館・入室',cancellation:'キャンセル',booking_status:'予約状態',seat:'座席',terminal:'ターミナル'};
    return Object.entries(details).flatMap(([key,value]) => {
      if (value == null || value === '') return [];
      const label = labels[key] || key.replaceAll('_',' ');
      if (Array.isArray(value)) return value.map(v => `${label}：${String(v)}`);
      if (typeof value === 'object') return Object.entries(value).map(([k,v]) => `${label}・${k}：${String(v)}`);
      return [`${label}：${String(value)}`];
    });
  }

  async function mergePrivateReservationDetails(title, detailList, detail) {
    const sync = window.SisterSync;
    if (!sync?.state?.session || !sync?.state?.trip) return;
    try {
      const {data,error} = await sync.client.from('reservation_vault').select('title,source_ref,details').eq('trip_id', sync.state.trip.id);
      if (error || !data?.length) return;
      const row = data.find(item => title.includes(item.title) || item.title.includes(title) || (detail?.ticketKey && item.source_ref === detail.ticketKey));
      if (!row) return;
      privateDetailsToBullets(row.details).forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        li.dataset.privateDetail = '1';
        detailList.appendChild(li);
      });
    } catch (_) {}
  }

  function enhanceTripCards() {
    [...document.querySelectorAll('#tripList .trip-item')].forEach(card => {
      if (card.dataset.v4Enhanced === '1') return;
      card.dataset.v4Enhanced = '1';
      card.tabIndex = 0;
      card.setAttribute('role','button');
      card.setAttribute('aria-expanded','false');
      const title = card.querySelector('h3')?.textContent?.trim() || '';
      const detail = reservationForTitle(title);
      const extra = document.createElement('div');
      extra.className = 'trip-extra';
      extra.innerHTML = detail ? `
        <ul class="trip-detail-list">${detail.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
        <div class="trip-private-note"><span>⌁</span><span>予約番号・暗証番号・正確な住所などは公開GitHubには置かず、3人のログイン後だけ非公開データから表示します。</span></div>
        ${detail.ticketKey ? `<button type="button" class="ticket-open-button" data-ticket-key="${escapeHtml(detail.ticketKey)}" data-ticket-title="${escapeHtml(title)}"><span>▣</span> チケット / QRを表示</button>` : ''}` : `
        <div class="trip-private-note"><span>⌁</span><span>この予約の追加情報は、予約メールまたは非公開データが入るとここに表示されます。</span></div>`;
      card.insertAdjacentElement('afterend', extra);

      const toggle = () => {
        const willOpen = !card.classList.contains('is-expanded');
        closeOtherTripItems(card);
        card.classList.toggle('is-expanded', willOpen);
        extra.classList.toggle('is-open', willOpen);
        card.setAttribute('aria-expanded',String(willOpen));
        if (willOpen && detail && !extra.dataset.privateLoaded) {
          extra.dataset.privateLoaded = '1';
          mergePrivateReservationDetails(title, extra.querySelector('.trip-detail-list'), detail);
        }
      };
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
      });
      extra.querySelector('[data-ticket-key]')?.addEventListener('click', event => {
        event.stopPropagation();
        openTicketVault(event.currentTarget.dataset.ticketKey, event.currentTarget.dataset.ticketTitle || title);
      });
    });
  }

  function wrapTrip() {
    if (state.tripBase) return;
    state.tripBase = renderTrip;
    renderTrip = function renderTripV4(...args) {
      const result = state.tripBase.apply(this,args);
      enhanceTripCards();
      return result;
    };
    renderTrip(currentTripFilter);
  }

  function ensureTicketDialog() {
    let dialog = document.getElementById('ticketDialogV4');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'ticketDialogV4';
    dialog.className = 'v4-dialog';
    dialog.innerHTML = `<section class="v4-dialog-panel"><header class="v4-dialog-head"><div><p class="eyebrow">PRIVATE TICKET</p><h2 id="ticketDialogTitle">チケット</h2></div><button class="v4-dialog-close" type="button" data-ticket-close aria-label="閉じる">×</button></header><div class="ticket-stage" id="ticketStageV4"></div></section>`;
    document.body.appendChild(dialog);
    dialog.querySelector('[data-ticket-close]').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{ if(event.target===dialog) dialog.close(); });
    return dialog;
  }

  function ticketCacheKey(tripId,ticketKey) { return `sister-trip-ticket:${tripId}:${ticketKey}`; }

  function renderTicketAssets(stage, assets) {
    if (!assets?.length) return false;
    stage.innerHTML = '';
    const priority = {qr:0,barcode:1,ticket_image:2,ticket_pdf:3};
    let rendered = 0;
    [...assets].sort((a,b)=>(priority[a.asset_kind]??9)-(priority[b.asset_kind]??9)).forEach(asset => {
      const data = String(asset.asset_data || '');
      if (!/^(data:|https:\/\/)/.test(data)) return;
      if (asset.asset_kind === 'ticket_pdf' || asset.mime_type === 'application/pdf') {
        const iframe = document.createElement('iframe'); iframe.src = data; iframe.title = asset.title || 'チケットPDF'; stage.appendChild(iframe);
      } else {
        const img = document.createElement('img'); img.src = data; img.alt = asset.title || 'チケット / QR'; stage.appendChild(img);
      }
      rendered += 1;
    });
    if (!rendered) return false;
    const badge = document.createElement('span'); badge.className = 'ticket-offline-badge'; badge.textContent = 'この端末に保存済み · オフライン表示対応'; stage.appendChild(badge);
    return true;
  }

  function renderTicketPlaceholder(stage, loggedIn=false) {
    stage.innerHTML = `<div class="ticket-placeholder"><div class="ticket-glyph">▣</div><h3>${loggedIn ? 'チケットデータはまだ取り込まれていません' : '3人共有へログインすると表示できます'}</h3><p>${loggedIn ? 'QRやPDFは公開GitHubには保存しません。非公開のチケット保管庫に取り込まれたものだけ、この画面に表示します。' : '予約番号やQRを公開ページへ埋め込まないため、チケットはログイン後の非公開領域だけで扱います。'}</p></div>`;
  }

  async function openTicketVault(ticketKey,title) {
    const dialog = ensureTicketDialog();
    const stage = dialog.querySelector('#ticketStageV4');
    dialog.querySelector('#ticketDialogTitle').textContent = title || 'チケット';
    stage.innerHTML = '<div class="ticket-placeholder"><div class="ticket-glyph">…</div><h3>チケットを確認しています</h3></div>';
    dialog.showModal();
    const sync = window.SisterSync;
    const tripId = sync?.state?.trip?.id || '';
    if (tripId) {
      try { const cached = localStorage.getItem(ticketCacheKey(tripId,ticketKey)); if (cached && renderTicketAssets(stage, JSON.parse(cached))) return; } catch (_) {}
    }
    if (!sync?.state?.session || !tripId) { renderTicketPlaceholder(stage,false); return; }
    try {
      const {data,error} = await sync.client.from('ticket_assets').select('title,asset_kind,mime_type,asset_data').eq('trip_id',tripId).eq('source_ref',ticketKey);
      if (error) throw error;
      if (data?.length) {
        try { localStorage.setItem(ticketCacheKey(tripId,ticketKey), JSON.stringify(data)); } catch (_) {}
        if (renderTicketAssets(stage,data)) return;
      }
      renderTicketPlaceholder(stage,true);
    } catch (_) { renderTicketPlaceholder(stage,true); }
  }

  function speak(text) {
    if (!('speechSynthesis' in window) || !text) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'ja-JP'; utterance.rate = .94; speechSynthesis.speak(utterance);
  }

  function storyCityFromCurrentPlan() {
    const plan = demo.dayPlans?.[typeof selectedTripDayKey !== 'undefined' ? selectedTripDayKey : state.discoverDay];
    return plan?.city || 'paris';
  }

  function renderCityStory(cityId=state.storyCity) {
    const screen = document.getElementById('screen-more');
    if (!screen) return;
    const city = demo.cities.find(c=>c.id===cityId) || demo.cities[0];
    const story = V4.cityStories[city.id] || V4.cityStories.paris;
    state.storyCity = city.id;
    screen.innerHTML = `<div class="page-intro"><p class="eyebrow">STORY / CITY</p><h1>街の物語</h1><p>行く前に知ると、現地で「あれだ」が増える。</p></div><div class="story-city-rail" aria-label="街の物語を選ぶ">${demo.cities.map(c=>`<button type="button" class="story-city-pill ${c.id===city.id?'active':''}" data-story-city="${escapeHtml(c.id)}">${escapeHtml(c.name)}</button>`).join('')}</div><article class="story-v4-hero"><img src="${escapeHtml(city.image || '')}" alt="${escapeHtml(city.name)}" data-city="${escapeHtml(city.id)}" /><div class="story-v4-shade"></div><div class="story-v4-copy"><p class="eyebrow">${escapeHtml(story.kicker)}</p><h2>${escapeHtml(story.title)}</h2><p>${escapeHtml(story.body)}</p><button class="story-v4-play" type="button" data-story-listen>▶ 3分で聴く</button></div></article><section class="story-facts" aria-label="覚えておきたい3つ">${story.facts.map((fact,index)=>`<article class="story-fact"><span>${index+1}</span><p>${escapeHtml(fact)}</p></article>`).join('')}</section><section class="story-quest-v4"><span>✦</span><div><strong>${escapeHtml(city.name)} QUEST</strong><p>${escapeHtml(story.quest)}</p></div></section>`;
    screen.querySelectorAll('[data-story-city]').forEach(button=>button.addEventListener('click',()=>renderCityStory(button.dataset.storyCity)));
    screen.querySelector('[data-story-listen]')?.addEventListener('click',()=>speak(story.listen));
    window.SisterTripImages?.protectImage(screen.querySelector('.story-v4-hero img'));
  }

  function installStory() { state.storyCity = storyCityFromCurrentPlan(); renderCityStory(state.storyCity); }

  function distanceKm(a,b) {
    const R=6371,dLat=(b.lat-a.lat)*Math.PI/180,dLng=(b.lng-a.lng)*Math.PI/180,lat1=a.lat*Math.PI/180,lat2=b.lat*Math.PI/180;
    const x=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
    return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
  }
  function walkMinutes(km) { return Math.max(3,Math.round(km/0.07)); }
  function actualTripDayKey() { const now=new Date(); if(now.getFullYear()!==2026||now.getMonth()!==8)return null; const key=`09-${String(now.getDate()).padStart(2,'0')}`; return demo.dayPlans?.[key]?key:null; }
  function parseTimeMinutes(value='') { const match=String(value).match(/(\d{1,2}):(\d{2})/); return match?Number(match[1])*60+Number(match[2]):null; }
  function nextLockedContext(dayKey) {
    const day=demo.dayPlans?.[dayKey]; if(!day)return null; const now=new Date(),currentMinutes=now.getHours()*60+now.getMinutes();
    const next=(day.items||[]).filter(item=>item.status==='locked'&&parseTimeMinutes(item.time)!=null&&parseTimeMinutes(item.time)>currentMinutes).sort((a,b)=>parseTimeMinutes(a.time)-parseTimeMinutes(b.time))[0];
    if(!next)return null; return {item:next,place:next.placeId?placeById(next.placeId):null,minutesUntil:parseTimeMinutes(next.time)-currentMinutes};
  }
  function planAnchors(dayKey) { const day=demo.dayPlans?.[dayKey]; return day?(day.items||[]).map(item=>placeById(item.placeId)).filter(Boolean).map(place=>({lat:place.lat,lng:place.lng})):[]; }
  function nearestDistanceToAnchors(rec,anchors) { return anchors.length?Math.min(...anchors.map(anchor=>distanceKm(anchor,rec))):0; }

  function clearDiscoverMarkers() { state.discoverMarkers.forEach(marker=>{try{if(map?.hasLayer(marker))map.removeLayer(marker);}catch(_){}}); state.discoverMarkers=[]; }
  function addDiscoverMarkers(recs) {
    if(!map||!window.L)return; clearDiscoverMarkers();
    recs.forEach(rec=>{const icon=L.divIcon({className:'custom-pin',html:`<div class="discover-pin">${rec.category==='eat'?'🍴':rec.category==='buy'?'◈':rec.category==='view'?'⌃':'✦'}</div>`,iconSize:[36,36],iconAnchor:[18,18]}); const marker=L.marker([rec.lat,rec.lng],{icon,title:rec.name,bubblingMouseEvents:false}).addTo(map); marker.on('click',()=>focusRecommendation(rec.id)); state.discoverMarkers.push(marker);});
  }

  function recommendationContext() {
    if(state.discoverMode==='current'&&state.userLocation){const city=currentMapCityId==='journey'?storyCityFromCurrentPlan():currentMapCityId;return {city,anchor:state.userLocation,anchors:[state.userLocation],dayKey:actualTripDayKey()||state.discoverDay};}
    const dayKey=state.discoverDay||(typeof selectedTripDayKey!=='undefined'?selectedTripDayKey:'09-12'),day=demo.dayPlans?.[dayKey];
    return {city:day?.city||(currentMapCityId==='journey'?'paris':currentMapCityId),anchor:null,anchors:planAnchors(dayKey),dayKey};
  }

  function rankedRecommendations() {
    const context=recommendationContext(),next=state.discoverMode==='current'?nextLockedContext(context.dayKey):null;
    let recs=V4.recommendations.filter(rec=>rec.city===context.city).map(rec=>{const km=context.anchor?distanceKm(context.anchor,rec):nearestDistanceToAnchors(rec,context.anchors),firstWalk=walkMinutes(km);let feasible=true,feasibility='';if(next?.minutesUntil&&next.place){const onwardKm=distanceKm(rec,{lat:next.place.lat,lng:next.place.lng}),total=firstWalk+rec.minutes+walkMinutes(onwardKm)+15;feasible=total<=next.minutesUntil;feasibility=feasible?`次の固定予定まで${next.minutesUntil}分 · 余裕あり`:'次の固定予定には入れにくい';}return {...rec,km,firstWalk,feasible,feasibility};}).sort((a,b)=>(Number(b.feasible)-Number(a.feasible))||a.km-b.km);
    return {context,recs:recs.slice(0,4),next};
  }

  function focusRecommendation(id) { const rec=V4.recommendations.find(item=>item.id===id); if(!rec)return; if(typeof setMapCity==='function'&&currentMapCityId!==rec.city)setMapCity(rec.city,false); map?.flyTo([rec.lat,rec.lng],15,{duration:.35}); window.showToast?.(`${rec.name} · ${rec.label}`); }

  function renderDiscoverSheet() {
    const sheet=document.querySelector('.nearby-sheet'),wrap=document.querySelector('.map-wrap');
    if(!sheet||!map||currentMapCityId==='journey')return state.mapSheetBase?.();
    const {context,recs,next}=rankedRecommendations(),city=demo.cities.find(c=>c.id===context.city),day=demo.dayPlans?.[context.dayKey];
    sheet.classList.remove('place-mode'); sheet.classList.add('discover-mode');
    sheet.innerHTML=`<div class="sheet-handle"></div><div class="sheet-heading"><div><p class="eyebrow">${state.discoverMode==='current'?'NOW / CURRENT LOCATION':'PLAN / '+escapeHtml(day?.date||'')}</p><h2>${state.discoverMode==='current'?'今ここから寄れそう':'予定の近くでおすすめ'}</h2><p class="discover-mode-note">${state.discoverMode==='current'?(next?`次の固定予定：${escapeHtml(next.item.title)} ${escapeHtml(next.item.time)}`:'現在地から近い順'):`${escapeHtml(city?.name||'')} · 予定ルートから近い順`}</p></div></div><div class="discover-list">${recs.length?recs.map(rec=>`<button type="button" class="discover-card" data-rec-id="${escapeHtml(rec.id)}"><div><span class="discover-chip">${escapeHtml(rec.label)}</span><h3>${escapeHtml(rec.name)}</h3><p>${escapeHtml(rec.why)}</p><div class="discover-card-meta"><span class="discover-chip cost">${escapeHtml(rec.price)}</span><span class="discover-chip">滞在 ${rec.minutes}分</span>${rec.feasibility?`<span class="discover-chip">${escapeHtml(rec.feasibility)}</span>`:''}</div><p class="discover-freshness">${escapeHtml(rec.tip)} · 情報確認 ${escapeHtml(rec.checked)}</p></div><span class="discover-distance">${rec.km<2.3?`徒歩約${rec.firstWalk}分`:`約${rec.km.toFixed(1)}km`}</span></button>`).join(''):'<div class="discover-empty">このエリアのおすすめはまだ追加中です。</div>'}</div>`;
    sheet.querySelector('.sheet-handle')?.addEventListener('click',()=>{sheet.classList.toggle('collapsed');wrap?.classList.toggle('sheet-collapsed',sheet.classList.contains('collapsed'));});
    sheet.querySelectorAll('[data-rec-id]').forEach(button=>button.addEventListener('click',()=>focusRecommendation(button.dataset.recId)));
    addDiscoverMarkers(recs);
  }

  function syncDiscoverDaySelect() { const select=document.getElementById('mapDiscoverDay'); if(select&&select.value!==state.discoverDay)select.value=state.discoverDay; }
  function setDiscoverMode(mode) { state.discoverMode=mode;document.querySelectorAll('[data-discover-mode]').forEach(button=>button.classList.toggle('active',button.dataset.discoverMode===mode));if(mode==='plan'){const day=demo.dayPlans?.[state.discoverDay];if(day&&typeof setMapCity==='function')setMapCity(day.city,true);renderDiscoverSheet();return;}requestCurrentLocation(); }

  function requestCurrentLocation() {
    if(!navigator.geolocation){window.showToast?.('この端末では現在地を取得できません');return;}
    window.showToast?.('現在地を確認しています…');
    navigator.geolocation.getCurrentPosition(position=>{const loc={lat:position.coords.latitude,lng:position.coords.longitude};state.userLocation=loc;const nearest=demo.cities.map(city=>({city,km:distanceKm(loc,{lat:city.center[0],lng:city.center[1]})})).sort((a,b)=>a.km-b.km)[0];if(nearest&&nearest.km<=90&&typeof setMapCity==='function')setMapCity(nearest.city.id,false);if(state.locationMarker&&map?.hasLayer(state.locationMarker))map.removeLayer(state.locationMarker);if(window.L&&map){const icon=L.divIcon({className:'custom-pin',html:'<div class="current-location-pin"></div>',iconSize:[24,24],iconAnchor:[12,12]});state.locationMarker=L.marker([loc.lat,loc.lng],{icon,title:'現在地',bubblingMouseEvents:false}).addTo(map);map.flyTo([loc.lat,loc.lng],15,{duration:.4});}if(nearest&&nearest.km>90)window.showToast?.('現在地は旅程の街から離れています。予定地モードも使えます');renderDiscoverSheet();},error=>{state.discoverMode='plan';document.querySelectorAll('[data-discover-mode]').forEach(button=>button.classList.toggle('active',button.dataset.discoverMode==='plan'));window.showToast?.(error.code===1?'位置情報が許可されていません':'現在地を取得できませんでした');renderDiscoverSheet();},{enableHighAccuracy:true,timeout:10000,maximumAge:120000});
  }

  function installDiscoverControls() {
    const header=document.querySelector('.map-header-panel'); if(!header||header.querySelector('.map-v4-discover-controls'))return;
    const controls=document.createElement('div'); controls.className='map-v4-discover-controls';
    controls.innerHTML=`<div class="map-v4-mode" aria-label="おすすめの基準"><button type="button" data-discover-mode="current">📍 現在地</button><button type="button" class="active" data-discover-mode="plan">🗓 予定地</button></div><select id="mapDiscoverDay" class="map-v4-day" aria-label="予定日を選ぶ">${Object.entries(demo.dayPlans||{}).map(([key,day])=>`<option value="${key}" ${key===state.discoverDay?'selected':''}>${escapeHtml(day.date)} · ${escapeHtml(demo.cities.find(c=>c.id===day.city)?.name||day.city)}</option>`).join('')}</select>`;
    header.appendChild(controls);
    controls.querySelectorAll('[data-discover-mode]').forEach(button=>button.addEventListener('click',()=>setDiscoverMode(button.dataset.discoverMode)));
    controls.querySelector('#mapDiscoverDay').addEventListener('change',event=>{state.discoverDay=event.currentTarget.value;state.discoverMode='plan';document.querySelectorAll('[data-discover-mode]').forEach(button=>button.classList.toggle('active',button.dataset.discoverMode==='plan'));if(typeof selectedTripDayKey!=='undefined')selectedTripDayKey=state.discoverDay;renderTimeline();const day=demo.dayPlans?.[state.discoverDay];if(day&&typeof setMapCity==='function')setMapCity(day.city,true);renderDiscoverSheet();});
    document.getElementById('mapCitySelect')?.addEventListener('change',event=>{if(state.discoverMode!=='plan'||event.currentTarget.value==='journey')return;const cityId=event.currentTarget.value,key=Object.keys(demo.dayPlans||{}).find(dayKey=>demo.dayPlans[dayKey].city===cityId);if(key){state.discoverDay=key;syncDiscoverDaySelect();}});
  }

  function wrapMapSheet() {
    if(state.mapSheetBase)return; state.mapSheetBase=renderMapSheet;
    renderMapSheet=function renderMapSheetV4(placeId=selectedMapPlaceId){if(placeId){document.querySelector('.nearby-sheet')?.classList.remove('discover-mode');clearDiscoverMarkers();return state.mapSheetBase(placeId);}if(state.discoveryEnabled&&currentMapCityId!=='journey')return renderDiscoverSheet();return state.mapSheetBase(placeId);};
  }

  function install() {
    if(state.installed)return; state.installed=true; ensureCss(); wrapTimeline(); wrapTrip(); ensureTicketDialog(); installStory(); wrapMapSheet(); installDiscoverControls(); if(currentMapCityId!=='journey')renderDiscoverSheet();
  }

  window.SisterTripFeaturesV4Install=install;
  window.SisterTripFeaturesV4={state,renderCityStory,openTicketVault,requestCurrentLocation,renderDiscoverSheet};
})();
