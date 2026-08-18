/* Sister Trip shared itinerary bridge.
   Seeds the verified/public-safe master plan after the owner creates the shared trip,
   then lets database changes override the local itinerary so ChatGPT can edit the plan. */

(() => {
  const seededTrips = new Set();
  let activeTripId = null;
  let channel = null;
  let pollTimer = null;

  const sync = () => window.SisterSync;
  const client = () => sync()?.client;
  const state = () => sync()?.state;

  const cityDates = {
    Paris:['2026-09-11','2026-09-18'],
    Zürich:['2026-09-18','2026-09-19'],
    Luzern:['2026-09-19','2026-09-20'],
    Milano:['2026-09-21','2026-09-23'],
    Venezia:['2026-09-23','2026-09-24'],
    Firenze:['2026-09-24','2026-09-25'],
    Roma:['2026-09-25','2026-09-29']
  };

  function safeJson(value, fallback={}) {
    try { return JSON.parse(value || ''); } catch (_) { return fallback; }
  }

  function exactStartsAt(dayKey, timeText, cityId) {
    if (!/^\d{2}:\d{2}$/.test(timeText || '')) return null;
    const [month, day] = dayKey.split('-');
    // Store local wall-clock with explicit offsets for the trip countries in September.
    const offset = cityId === 'paris' ? '+02:00' : '+02:00';
    return `2026-${month}-${day}T${timeText}:00${offset}`;
  }

  async function normalizeCities(tripId) {
    const c = client(); if (!c) return new Map();
    const {data:cities,error} = await c.from('cities').select('id,name,starts_on,ends_on').eq('trip_id',tripId);
    if (error) throw error;
    for (const city of cities || []) {
      const dates = cityDates[city.name];
      if (!dates) continue;
      if (city.starts_on !== dates[0] || city.ends_on !== dates[1]) {
        await c.from('cities').update({starts_on:dates[0], ends_on:dates[1]}).eq('id',city.id);
      }
    }
    const {data:updated} = await c.from('cities').select('id,name').eq('trip_id',tripId);
    return new Map((updated || []).map(x => [x.name,x.id]));
  }

  async function ensureMasterPlaces(tripId, cityMap) {
    const c = client(); if (!c) return new Map();
    const {data:existing,error} = await c.from('places').select('id,source_url,name').eq('trip_id',tripId);
    if (error) throw error;
    const bySource = new Map((existing || []).filter(x => x.source_url?.startsWith('sistertrip://place/')).map(x => [x.source_url,x.id]));
    const missing = [];
    for (const place of demo.mapPlaces || []) {
      const source = `sistertrip://place/${place.id}`;
      if (bySource.has(source)) continue;
      const city = demo.cities.find(x => x.id === place.city);
      missing.push({
        trip_id:tripId,
        city_id:cityMap.get(city?.name) || null,
        name:place.name,
        category:place.tag,
        latitude:place.lat,
        longitude:place.lng,
        image_url:place.image || null,
        source_url:source,
        story_title:place.eyebrow || null,
        story_body:place.description || null,
        created_by:state()?.session?.user?.id || null
      });
    }
    if (missing.length) {
      const {error:insertError} = await c.from('places').insert(missing);
      if (insertError) throw insertError;
    }
    const {data:all} = await c.from('places').select('id,source_url').eq('trip_id',tripId);
    return new Map((all || []).filter(x => x.source_url?.startsWith('sistertrip://place/')).map(x => [x.source_url.replace('sistertrip://place/',''),x.id]));
  }

  async function ensureMasterItinerary(tripId, cityMap, placeMap) {
    const c = client(); if (!c) return;
    const {data:existing,error} = await c.from('itinerary_items').select('source_ref').eq('trip_id',tripId).like('source_ref','sistertrip://day/%');
    if (error) throw error;
    const refs = new Set((existing || []).map(x => x.source_ref));
    const rows = [];

    for (const [dayKey,plan] of Object.entries(demo.dayPlans || {})) {
      const city = demo.cities.find(x => x.id === plan.city);
      for (let i=0;i<plan.items.length;i++) {
        const item = plan.items[i];
        const ref = `sistertrip://day/${dayKey}/${i}`;
        if (refs.has(ref)) continue;
        const placeDbId = item.placeId ? placeMap.get(item.placeId) || null : null;
        rows.push({
          trip_id:tripId,
          city_id:cityMap.get(city?.name) || null,
          place_id:placeDbId,
          title:item.title,
          starts_at:exactStartsAt(dayKey,item.time,plan.city),
          ends_at:null,
          flexibility:item.status === 'locked' ? 'locked' : item.status === 'wish' ? 'wish' : 'flex',
          item_type:item.title.includes('→') || item.title.includes('FlixBus') || item.title.includes('Air Serbia') ? 'transport' : item.title.toLowerCase().includes('check-in') || item.title.toLowerCase().includes('stay') ? 'stay' : 'activity',
          notes:JSON.stringify({dayKey,timeText:item.time,meta:item.meta,image:item.image,placeKey:item.placeId || null}),
          source:'system',
          source_ref:ref,
          created_by:state()?.session?.user?.id || null
        });
      }
    }
    if (rows.length) {
      const {error:insertError} = await c.from('itinerary_items').insert(rows);
      if (insertError) throw insertError;
    }
  }

  async function seedIfOwner() {
    const s=state(), c=client();
    if (!s?.session || !s?.trip || !c) return;
    if (s.trip.owner_user_id !== s.session.user.id) return;
    if (seededTrips.has(s.trip.id)) return;

    const {count,error} = await c.from('itinerary_items').select('id',{count:'exact',head:true}).eq('trip_id',s.trip.id).like('source_ref','sistertrip://day/%');
    if (error) throw error;
    const cityMap = await normalizeCities(s.trip.id);
    if (!count) {
      const placeMap = await ensureMasterPlaces(s.trip.id,cityMap);
      await ensureMasterItinerary(s.trip.id,cityMap,placeMap);
    }
    seededTrips.add(s.trip.id);
  }

  function localTimeFromRow(row, note) {
    if (row.starts_at) {
      try {
        const d = new Date(row.starts_at);
        return new Intl.DateTimeFormat('ja-JP',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Europe/Paris'}).format(d);
      } catch (_) {}
    }
    return note.timeText || '—';
  }

  async function loadSharedItinerary() {
    const s=state(), c=client();
    if (!s?.trip || !c || !demo.dayPlans) return;
    const {data,error} = await c.from('itinerary_items')
      .select('id,title,starts_at,ends_at,flexibility,item_type,notes,source_ref,place_id')
      .eq('trip_id',s.trip.id)
      .like('source_ref','sistertrip://day/%')
      .order('starts_at',{ascending:true,nullsFirst:true});
    if (error) return;

    const grouped = {};
    for (const row of data || []) {
      const note=safeJson(row.notes,{});
      const dayKey=note.dayKey || row.source_ref?.split('/')[3];
      if (!dayKey || !demo.dayPlans[dayKey]) continue;
      const placeKey=note.placeKey || demo.mapPlaces.find(p => p.id && row.source_ref?.includes(p.id))?.id || null;
      (grouped[dayKey] ||= []).push({
        time:localTimeFromRow(row,note),
        title:row.title,
        meta:note.meta || '',
        status:row.flexibility === 'locked' ? 'locked' : row.flexibility === 'wish' ? 'wish' : 'flex',
        placeId:placeKey,
        image:note.image || demo.cities.find(x=>x.id===demo.dayPlans[dayKey].city)?.image
      });
    }
    for (const [dayKey,items] of Object.entries(grouped)) demo.dayPlans[dayKey].items=items;
    if (typeof renderTimeline === 'function') renderTimeline();
  }

  async function loadSharedMappedWishes() {
    const s=state(), c=client();
    if (!s?.trip || !c) return;
    const {data,error}=await c.from('wishes').select('id,label,priority,member_user_id,places(id,name,latitude,longitude,image_url,category,city_id,source_url)').eq('trip_id',s.trip.id);
    if (error) return;
    for (const wish of data || []) {
      const p=wish.places;
      if (!p?.latitude || !p?.longitude) continue;
      const id=`shared-wish-${wish.id}`;
      if (demo.mapPlaces.some(x=>x.id===id)) continue;
      demo.mapPlaces.push({id,city:currentCityIdForCoords(p.latitude,p.longitude),name:p.name||wish.label,lat:p.latitude,lng:p.longitude,tag:'wish',code:'♡',eyebrow:'SHARED WISH',badge:wish.priority==='must'?'絶対':'行けたら',meta:'3人共有の行きたい',description:'共有リストから追加された場所です。',image:p.image_url||null,action:'wish',wishers:['♡']});
    }
    if (typeof renderMapMarkers === 'function') renderMapMarkers(currentMapFilter,false);
  }

  function currentCityIdForCoords(lat,lng) {
    let best='paris', bestDist=Infinity;
    for (const city of demo.cities || []) {
      const d=(city.center[0]-lat)**2+(city.center[1]-lng)**2;
      if (d<bestDist){bestDist=d;best=city.id;}
    }
    return best;
  }

  function subscribe(tripId) {
    const c=client(); if (!c) return;
    if (channel) c.removeChannel(channel);
    channel=c.channel(`sister-trip-master-${tripId}`)
      .on('postgres_changes',{event:'*',schema:'public',table:'itinerary_items',filter:`trip_id=eq.${tripId}`},()=>loadSharedItinerary())
      .on('postgres_changes',{event:'*',schema:'public',table:'wishes',filter:`trip_id=eq.${tripId}`},()=>loadSharedMappedWishes())
      .subscribe();
  }

  async function connectTrip(trip) {
    if (!trip || activeTripId===trip.id) return;
    activeTripId=trip.id;
    try {
      await seedIfOwner();
      await loadSharedItinerary();
      await loadSharedMappedWishes();
      subscribe(trip.id);
    } catch (error) {
      console.error('Sister Trip shared bridge:',error);
    }
  }

  function watch() {
    clearInterval(pollTimer);
    pollTimer=setInterval(()=>{
      const trip=state()?.trip;
      if (trip && trip.id!==activeTripId) connectTrip(trip);
      if (!trip && activeTripId) {
        activeTripId=null;
        if (channel) client()?.removeChannel(channel);
        channel=null;
      }
    },800);
  }

  watch();
  window.SisterTripShared={seedIfOwner,loadSharedItinerary,loadSharedMappedWishes};
})();
