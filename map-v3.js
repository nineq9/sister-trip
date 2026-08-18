/* Sister Trip MAP v3 — multi-city, map-first experience. */

let currentMapCityId = (demo.dayPlans?.[typeof selectedTripDayKey !== 'undefined' ? selectedTripDayKey : '09-12']?.city) || 'paris';
let journeyRouteLayer = null;
let mapMoveTimer = null;

function ensureMapV3Styles() {
  if (document.querySelector('link[href="./map-v3.css"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = './map-v3.css';
  link.id = 'mapV3Styles';
  document.head.appendChild(link);
}

function cityById(id) {
  return demo.cities.find(city => city.id === id);
}

function firstDayForCity(cityId) {
  return Object.keys(demo.dayPlans || {}).find(key => demo.dayPlans[key].city === cityId) || null;
}

function mapImageFallback(img) {
  if (!img) return;
  img.addEventListener('error', () => {
    img.style.display = 'none';
    img.parentElement?.classList.add('image-missing');
  }, {once:true});
}

prepareMapExperience = function prepareMapExperienceV3() {
  ensureMapV3Styles();
  const wrap = $('.map-wrap');
  const sheet = $('.nearby-sheet');
  const header = $('.map-header-panel');
  if (!wrap || !sheet || !header) return;

  if (sheet.parentElement !== wrap) wrap.appendChild(sheet);
  if (header.parentElement !== wrap) wrap.appendChild(header);

  header.innerHTML = `
    <div class="map-v3-toolbar">
      <label class="map-city-control" aria-label="地図の都市を選ぶ">
        <span class="map-mini-label">MAP</span>
        <select id="mapCitySelect">
          <option value="journey">EUROPE</option>
          ${demo.cities.map(city => `<option value="${city.id}" ${city.id === currentMapCityId ? 'selected' : ''}>${city.name}</option>`).join('')}
        </select>
      </label>
      <div class="segmented" id="mapFilters" role="tablist" aria-label="地図フィルター">
        <button class="active" type="button" data-filter="all">すべて</button>
        <button type="button" data-filter="today">今日</button>
        <button type="button" data-filter="wish">行きたい</button>
      </div>
    </div>`;

  $('#mapCitySelect')?.addEventListener('change', event => {
    const cityId = event.currentTarget.value;
    if (cityId !== 'journey') {
      const day = firstDayForCity(cityId);
      if (day && typeof selectedTripDayKey !== 'undefined') selectedTripDayKey = day;
    }
    setMapCity(cityId, true);
  });

  renderMapSheet();
};

function toggleMapSheet() {
  const sheet = $('.nearby-sheet');
  const wrap = $('.map-wrap');
  if (!sheet || !wrap) return;
  sheet.classList.toggle('collapsed');
  wrap.classList.toggle('sheet-collapsed', sheet.classList.contains('collapsed'));
}

function bindSheetHandle() {
  const handle = $('.nearby-sheet .sheet-handle');
  if (handle) {
    handle.setAttribute('role', 'button');
    handle.setAttribute('aria-label', '地図の詳細カードを開閉');
    handle.tabIndex = 0;
    handle.addEventListener('click', toggleMapSheet);
    handle.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleMapSheet();
      }
    });
  }
}

function travelDistanceKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;
  const x = Math.sin(dLat/2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
}

function nearbySuggestionForCenter() {
  if (!map || currentMapCityId === 'journey') return null;
  const center = map.getCenter();
  let candidates = demo.mapPlaces.filter(p => p.city === currentMapCityId && p.tag === 'wish');
  if (!candidates.length) candidates = demo.mapPlaces.filter(p => p.city === currentMapCityId && p.tag === 'flex');
  if (!candidates.length) return demo.nearbyByCity?.[currentMapCityId] || null;

  const ranked = candidates.map(place => ({place, km:travelDistanceKm({lat:center.lat,lng:center.lng}, place)})).sort((a,b) => a.km-b.km);
  const best = ranked[0];
  const walkMinutes = Math.max(3, Math.round(best.km / 0.075));
  return {
    placeId: best.place.id,
    name: best.place.name,
    meta: best.place.meta || 'WISH · FLEXに追加可能',
    walk: best.km <= 2.3 ? `徒歩 約${walkMinutes}分` : `${best.km.toFixed(1)} km`,
    wishers: best.place.wishers || ['1'],
    image: best.place.image
  };
}

renderMapSheet = function renderMapSheetV3(placeId = selectedMapPlaceId) {
  const sheet = $('.nearby-sheet');
  const wrap = $('.map-wrap');
  if (!sheet) return;
  const wasCollapsed = sheet.classList.contains('collapsed');
  const place = placeId ? demo.mapPlaces.find(p => p.id === placeId) : null;

  if (currentMapCityId === 'journey' && !place) {
    sheet.classList.remove('place-mode');
    sheet.innerHTML = `
      <div class="sheet-handle"></div>
      <div class="journey-sheet-copy">
        <p class="eyebrow">EUROPE · 11–28 SEP</p>
        <h2>7つの街を、ひとつのルートで見る。</h2>
        <p>都市のピンをタップすると、その街の詳細地図へ入れます。</p>
        <div class="journey-city-dots">${demo.cities.map(c => `<span title="${c.name}">${c.name.slice(0,1)}</span>`).join('')}</div>
      </div>`;
  } else if (!place) {
    const nearby = nearbySuggestionForCenter() || demo.nearbyByCity?.[currentMapCityId] || demo.nearbyWish;
    demo.nearbyWish = nearby;
    const city = cityById(currentMapCityId);
    sheet.classList.remove('place-mode');
    sheet.innerHTML = `
      <div class="sheet-handle"></div>
      <div class="sheet-heading">
        <div><p class="eyebrow">NEARBY · ${city?.name?.toUpperCase() || ''}</p><h2>この辺で寄れそう</h2></div>
        <span class="distance-badge">${nearby?.walk || '候補'}</span>
      </div>
      <article class="nearby-card map-sheet-card" ${nearby?.placeId ? `data-nearby-place="${nearby.placeId}"` : ''}>
        <img class="map-sheet-photo" src="${nearby?.image || city?.image || ''}" alt="${nearby?.name || '近くの候補'}" />
        <div class="nearby-copy">
          <strong>${nearby?.name || '近くの候補'}</strong>
          <span>${nearby?.meta || 'FLEXに追加可能'}</span>
          <div class="wishers">${(nearby?.wishers || ['1']).map(x => `<span>${x}</span>`).join('')}<em>${(nearby?.wishers || ['1']).length}人が気になる</em></div>
        </div>
        <button class="small-plus" type="button" data-quick-add aria-label="FLEX候補に追加">＋</button>
      </article>`;
  } else {
    sheet.classList.add('place-mode');
    const actionLabel = place.action === 'story' ? '物語を見る' : place.action === 'trip' ? 'TRIPで見る' : place.action === 'wish' ? 'FLEX候補に' : '予定を見る';
    sheet.innerHTML = `
      <div class="sheet-handle"></div>
      <article class="selected-place-card">
        <img class="selected-place-photo" src="${place.image || cityById(place.city)?.image || ''}" alt="${place.name}" />
        <div class="selected-place-copy">
          <div class="selected-place-kicker"><span>${place.eyebrow || ''}</span><b>${place.badge || ''}</b></div>
          <h2>${place.name}</h2>
          <p class="selected-place-meta">${place.meta || ''}</p>
          <p class="selected-place-description">${place.description || ''}</p>
        </div>
      </article>
      <div class="map-sheet-actions">
        <button class="map-sheet-secondary" type="button" data-map-close>近くを見る</button>
        <button class="map-sheet-primary" type="button" data-map-action="${place.action || 'today'}">${actionLabel}<span>→</span></button>
      </div>`;
  }

  sheet.classList.toggle('collapsed', wasCollapsed && !place);
  wrap?.classList.toggle('sheet-collapsed', sheet.classList.contains('collapsed'));
  bindSheetHandle();
  sheet.querySelectorAll('img').forEach(mapImageFallback);

  $('[data-nearby-place]', sheet)?.addEventListener('click', event => {
    if (event.target.closest('[data-quick-add]')) return;
    selectMapPlace(event.currentTarget.dataset.nearbyPlace);
  });
  $('[data-quick-add]', sheet)?.addEventListener('click', () => showToast('FLEX候補に追加しました'));
  $('[data-map-close]', sheet)?.addEventListener('click', clearMapPlaceSelection);
  $('[data-map-action]', sheet)?.addEventListener('click', event => {
    const action = event.currentTarget.dataset.mapAction;
    if (!place) return;
    if (action === 'trip') {
      switchScreen('trip');
    } else if (action === 'wish') {
      showToast(`${place.name} をFLEX候補に追加しました`);
    } else if (action === 'story') {
      if (place.id === 'eiffel') $('#storyDialog')?.showModal();
      else {
        switchScreen('more');
        showToast(`${place.name}：${place.description}`);
      }
    } else {
      if (place.day && demo.dayPlans?.[place.day]) {
        selectedTripDayKey = place.day;
        renderTimeline();
      }
      switchScreen('today');
    }
  });
};

updateSelectedMarkerStyles = function updateSelectedMarkerStylesV3() {
  markers.forEach(item => {
    if (!item.marker || !item.place) return;
    const bubble = item.marker.getElement()?.querySelector('.pin-bubble');
    if (bubble) bubble.classList.toggle('selected', item.place.id === selectedMapPlaceId);
  });
};

selectMapPlace = function selectMapPlaceV3(placeId) {
  const place = demo.mapPlaces.find(p => p.id === placeId);
  if (!place) return;
  if (currentMapCityId !== place.city) {
    currentMapCityId = place.city;
    $('#mapCitySelect') && ($('#mapCitySelect').value = place.city);
    renderMapMarkers(currentMapFilter, false);
  }
  selectedMapPlaceId = placeId;
  const sheet = $('.nearby-sheet');
  sheet?.classList.remove('collapsed');
  $('.map-wrap')?.classList.remove('sheet-collapsed');
  updateSelectedMarkerStyles();
  renderMapSheet(placeId);
  if (map) map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), 14), {duration:.35});
};

clearMapPlaceSelection = function clearMapPlaceSelectionV3() {
  selectedMapPlaceId = null;
  updateSelectedMarkerStyles();
  renderMapSheet();
};

function clearMapLayers() {
  markers.forEach(item => {
    const marker = item.marker || item;
    if (marker && map?.hasLayer(marker)) map.removeLayer(marker);
  });
  markers = [];
  if (journeyRouteLayer && map?.hasLayer(journeyRouteLayer)) map.removeLayer(journeyRouteLayer);
  journeyRouteLayer = null;
}

function renderJourneyMap(fit = true) {
  if (!map) return;
  clearMapLayers();
  const route = demo.cities.map(city => city.center);
  journeyRouteLayer = L.polyline(route, {
    color:'#416a69', weight:3, opacity:.72, dashArray:'3 8', className:'journey-route'
  }).addTo(map);

  const labels = ['P','Z','L','M','V','F','R'];
  demo.cities.forEach((city, index) => {
    const icon = L.divIcon({className:'custom-pin', html:`<div class="journey-pin">${labels[index]}</div>`, iconSize:[43,43], iconAnchor:[21,21]});
    const marker = L.marker(city.center, {icon, title:city.name, bubblingMouseEvents:false}).addTo(map);
    marker.on('click', () => {
      const day = firstDayForCity(city.id);
      if (day) selectedTripDayKey = day;
      setMapCity(city.id, true);
    });
    markers.push({marker, city});
  });
  if (fit) map.fitBounds(L.latLngBounds(route), {paddingTopLeft:[34,70], paddingBottomRight:[34,150]});
  renderMapSheet();
}

renderMapMarkers = function renderMapMarkersV3(filter = currentMapFilter, fit = true) {
  if (!map) return;
  currentMapFilter = filter;
  if (currentMapCityId === 'journey') {
    renderJourneyMap(fit);
    return;
  }

  clearMapLayers();
  const points = demo.mapPlaces.filter(place => {
    if (place.city !== currentMapCityId) return false;
    if (filter === 'all') return true;
    if (filter === 'wish') return place.tag === 'wish' || place.tag === 'attention';
    if (filter === 'today') return place.day === selectedTripDayKey || place.tag === 'stay';
    return true;
  });

  points.forEach(place => {
    const icon = L.divIcon({
      className:'custom-pin',
      html:`<div class="pin-bubble ${place.tag} ${place.id === selectedMapPlaceId ? 'selected' : ''}">${place.code}</div>`,
      iconSize:[42,42], iconAnchor:[21,21]
    });
    const marker = L.marker([place.lat,place.lng], {icon, title:place.name, bubblingMouseEvents:false}).addTo(map);
    marker.on('click', () => selectMapPlace(place.id));
    markers.push({marker, place});
  });

  const city = cityById(currentMapCityId);
  if (fit) {
    if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points.map(p => [p.lat,p.lng])), {paddingTopLeft:[35,72], paddingBottomRight:[35,180], maxZoom:14});
    } else if (points.length === 1) {
      map.setView([points[0].lat,points[0].lng], Math.min(city?.zoom || 13, 14));
    } else if (city) {
      map.setView(city.center, city.zoom || 12.5);
    }
  }
  renderMapSheet();
};

function setMapCity(cityId, fit = true) {
  currentMapCityId = cityId;
  selectedMapPlaceId = null;
  const select = $('#mapCitySelect');
  if (select) select.value = cityId;
  if (cityId !== 'journey') demo.nearbyWish = demo.nearbyByCity?.[cityId] || demo.nearbyWish;
  renderMapMarkers(currentMapFilter, fit);
}
window.setMapCity = setMapCity;

initMap = function initMapV3() {
  if (!window.L || !navigator.onLine) {
    showOfflineMap();
    return;
  }
  const city = cityById(currentMapCityId) || demo.cities[0];
  map = L.map('map', {zoomControl:false, attributionControl:true, zoomSnap:.25}).setView(city.center, city.zoom || 12.5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution:'© OpenStreetMap'}).addTo(map);
  L.control.zoom({position:'bottomleft'}).addTo(map);
  map.on('click', clearMapPlaceSelection);
  map.on('moveend', () => {
    clearTimeout(mapMoveTimer);
    mapMoveTimer = setTimeout(() => {
      if (!selectedMapPlaceId && currentMapCityId !== 'journey') renderMapSheet();
    }, 120);
  });
  renderMapMarkers('all', true);
};

initFilters = function initFiltersV3() {
  $$('#mapFilters button').forEach(btn => btn.addEventListener('click', () => {
    $$('#mapFilters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMapFilter = btn.dataset.filter;
    selectedMapPlaceId = null;
    $('.nearby-sheet')?.classList.remove('collapsed');
    $('.map-wrap')?.classList.remove('sheet-collapsed');
    renderMapMarkers(currentMapFilter, true);
  }));
  $$('#tripFilters button').forEach(btn => btn.addEventListener('click', () => {
    $$('#tripFilters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTripFilter = btn.dataset.tripFilter;
    renderTrip(currentTripFilter);
  }));
};

function bootSisterTripV3() {
  ensureMapV3Styles();
  // If app.js already initialized before these enhancement scripts arrived, rebuild safely.
  try {
    renderCities();
    renderTimeline();
    renderTrip();
    prepareMapExperience();
    initFilters();

    if (map) {
      map.remove();
      map = null;
      markers = [];
    }
    $('#map').hidden = false;
    $('#offlineMap').hidden = true;
    initMap();
    setTimeout(() => map?.invalidateSize(), 80);
  } catch (error) {
    console.error('Sister Trip v3 boot failed', error);
  }
}

window.SisterTripV3Boot = bootSisterTripV3;
