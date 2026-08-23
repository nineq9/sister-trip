/* Sister Trip Build v8 — Firenze PLAN, secure ticket vault, and 3-sister onboarding.
   Public-safe only. No ticket contents, booking codes, QR data, PINs, or private addresses live here. */
(() => {
  const BUILD = '2026-08-23-v8';
  const BUCKET = 'trip-tickets';
  const SECURE_DB = 'sister-trip-secure-tickets-v1';
  const SECURE_DB_VERSION = 1;
  const MAX_TICKET_BYTES = 15 * 1024 * 1024;
  const objectUrls = new Set();
  let installed = false;
  let baseTimeline = null;
  let baseTrip = null;
  let manifestPromise = null;
  let manifestSignature = '';
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value='') => String(value).replace(/[&<>'\"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[ch]));
  const toast = message => window.showToast ? window.showToast(message) : console.log(message);

  function isStandalone() {
    return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function applyFlorencePlan() {
    if (typeof demo === 'undefined' || !demo) return;
    const image = typeof CITY_IMAGES !== 'undefined' ? CITY_IMAGES.firenze : '';
    demo.dayPlans = demo.dayPlans || {};
    demo.dayPlans['09-24'] = {
      date:'24 SEP',
      dow:'Thu',
      city:'firenze',
      title:'Firenze · 街もホテルも楽しむ日',
      theme:'11時ごろ到着。荷物を預けて旧市街へ。夕方はhu Firenzeのプール、温水ジャグジー、BBQまでをひとつの旅体験として楽しむ。',
      items:[
        {time:'11:00ごろ', title:'フィレンツェ到着', meta:'到着時刻はPLAN · 移動状況に合わせて変更OK', status:'plan', placeId:null, image},
        {time:'11:30ごろ', title:'hu Firenzeへ移動・荷物を預ける', meta:'身軽になって旧市街へ · PLAN', status:'plan', placeId:'florence-stay', image},
        {time:'12:30〜16:15', title:'フィレンツェ旧市街観光', meta:'Duomo → Signoria → Ponte Vecchioを中心に · PLAN', status:'plan', placeId:'florence-duomo', image},
        {time:'16:30ごろ', title:'市内スーパーでBBQ食材を購入', meta:'肉・野菜・パン・チーズ・飲み物などを現地調達 · PLAN', status:'plan', placeId:null, image},
        {time:'17:30ごろ', title:'hu Firenzeへ戻る・チェックイン', meta:'宿泊予約は確認済み／戻る時刻はPLAN', status:'plan', placeId:'florence-stay', image},
        {time:'18:00ごろ', title:'プール ＋ 温水ジャグジー', meta:'天候・当日の営業時間を優先 · PLAN', status:'plan', placeId:'florence-stay', image},
        {time:'19:15ごろ', title:'3人でBBQ', meta:'共用グリル €3（約¥560）/18分。3人なら36分＝€6（約¥1,115）を目安 · PLAN', status:'plan', placeId:'florence-stay', image},
        {time:'20:15以降', title:'Lounge Bar / バンガローでゆっくり', meta:'営業状況と体力に合わせてのんびり · PLAN', status:'plan', placeId:'florence-stay', image}
      ]
    };
  }

  function normalizePlanLabels() {
    $$('#timeline .timeline-item.plan').forEach(row => {
      row.querySelectorAll('.status-badge').forEach(badge => { badge.textContent = '◐ PLAN'; });
      row.querySelectorAll('.timeline-detail-row span').forEach(span => {
        if (span.textContent.trim() === '◐ FLEX') span.textContent = '◐ PLAN';
      });
    });
  }

  function wrapTimeline() {
    if (baseTimeline || typeof renderTimeline !== 'function') return;
    baseTimeline = renderTimeline;
    renderTimeline = function renderTimelineBuildV8(...args) {
      const result = baseTimeline.apply(this, args);
      normalizePlanLabels();
      return result;
    };
    if (typeof selectedTripDayKey !== 'undefined' && selectedTripDayKey === '09-24') renderTimeline();
  }

  function reservationForTitle(title='') {
    const details = window.SisterTripV4Data?.reservationDetails || [];
    return details.find(item => String(title).includes(item.match)) || null;
  }

  function installFlorenceExperience(extra) {
    if (!extra || extra.querySelector('.florence-experience-v8')) return;
    const card = document.createElement('article');
    card.className = 'florence-experience-v8';
    card.innerHTML = `
      <p class="eyebrow">STAY EXPERIENCE · PLAN</p>
      <h4>この宿で楽しむこと</h4>
      <div class="florence-experience-tags" aria-label="宿で楽しむこと">
        <span>POOL</span><span>WARM JACUZZI</span><span>BBQ</span><span>LOUNGE</span>
      </div>
      <ul>
        <li><b>プール</b> — 夕方に入る予定。天候・当日の営業時間を優先。</li>
        <li><b>温水ジャグジー</b> — プールと一緒に楽しむPLAN。</li>
        <li><b>共用BBQ</b> — グリルは €3（約¥560）/18分。</li>
        <li><b>3人の目安</b> — 36分で €6（約¥1,115）程度。</li>
        <li><b>食材</b> — 旧市街のスーパーで別途購入して戻る。</li>
        <li><b>予約</b> — BBQの事前予約が必要という公式案内は確認されていない。</li>
      </ul>
      <p class="florence-experience-note">宿泊予約そのものと、17:30以降の過ごし方は別。夕方の時刻はすべて旅行中に動かせるPLANです。</p>`;
    const privateNote = extra.querySelector('.trip-private-note');
    if (privateNote) privateNote.insertAdjacentElement('beforebegin', card);
    else extra.prepend(card);
  }

  function syncContext() {
    const sync = window.SisterSync;
    const session = sync?.state?.session || null;
    const userId = session?.user?.id || '';
    let tripId = sync?.state?.trip?.id || '';
    if (userId && tripId) {
      try { localStorage.setItem(`sister-trip-last-trip:${userId}`, tripId); } catch (_) {}
    }
    if (userId && !tripId) {
      try { tripId = localStorage.getItem(`sister-trip-last-trip:${userId}`) || ''; } catch (_) {}
    }
    return {sync, session, userId, tripId, liveTripId:sync?.state?.trip?.id || ''};
  }

  function isOwner(ctx=syncContext()) {
    return !!(ctx.userId && ctx.sync?.state?.trip?.owner_user_id === ctx.userId);
  }

  function openSecureDb() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window) || !window.crypto?.subtle) return reject(new Error('secure cache unavailable'));
      const request = indexedDB.open(SECURE_DB, SECURE_DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('keys')) db.createObjectStore('keys', {keyPath:'id'});
        if (!db.objectStoreNames.contains('tickets')) db.createObjectStore('tickets', {keyPath:'id'});
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('secure cache unavailable'));
    });
  }

  function idbRequest(store, method, value) {
    return new Promise((resolve, reject) => {
      const req = value === undefined ? store[method]() : store[method](value);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('indexedDB error'));
    });
  }

  async function withStore(name, mode, fn) {
    const db = await openSecureDb();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(name, mode);
        const store = tx.objectStore(name);
        let result;
        let settled = false;
        tx.oncomplete = () => { if (!settled) { settled = true; resolve(result); } };
        tx.onerror = () => { if (!settled) { settled = true; reject(tx.error || new Error('indexedDB transaction failed')); } };
        tx.onabort = () => { if (!settled) { settled = true; reject(tx.error || new Error('indexedDB transaction aborted')); } };
        Promise.resolve(fn(store)).then(value => { result = value; }, error => {
          if (!settled) { settled = true; try { tx.abort(); } catch (_) {} reject(error); }
        });
      });
    } finally {
      db.close();
    }
  }

  async function getDeviceKey(userId) {
    if (!userId) throw new Error('login required');
    const keyId = `user:${userId}`;
    try {
      const existing = await withStore('keys','readonly',store => idbRequest(store,'get',keyId));
      if (existing?.key) return existing.key;
    } catch (_) {}
    const key = await crypto.subtle.generateKey({name:'AES-GCM',length:256}, false, ['encrypt','decrypt']);
    await withStore('keys','readwrite',store => idbRequest(store,'put',{id:keyId,key}));
    return key;
  }

  function ticketRecordId(userId, tripId, sourceRef) {
    return `${userId}:${tripId}:${sourceRef}`;
  }

  async function saveEncryptedTicket(userId, tripId, sourceRef, assets) {
    if (!assets?.length) return;
    const key = await getDeviceKey(userId);
    const encryptedAssets = [];
    for (const asset of assets) {
      if (!asset.blob) continue;
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const plain = await asset.blob.arrayBuffer();
      const cipher = await crypto.subtle.encrypt({name:'AES-GCM',iv}, key, plain);
      encryptedAssets.push({
        title:asset.title || 'チケット',
        asset_kind:asset.asset_kind || 'ticket_image',
        mime_type:asset.mime_type || asset.blob.type || 'application/octet-stream',
        iv,
        cipher
      });
    }
    if (!encryptedAssets.length) return;
    const record = {
      id:ticketRecordId(userId,tripId,sourceRef), userId, tripId, sourceRef,
      cachedAt:new Date().toISOString(), assets:encryptedAssets
    };
    await withStore('tickets','readwrite',store => idbRequest(store,'put',record));
  }

  async function loadEncryptedTicket(userId, tripId, sourceRef) {
    try {
      const record = await withStore('tickets','readonly',store => idbRequest(store,'get',ticketRecordId(userId,tripId,sourceRef)));
      if (!record?.assets?.length || record.userId !== userId || record.tripId !== tripId) return [];
      const key = await getDeviceKey(userId);
      const assets = [];
      for (const asset of record.assets) {
        const plain = await crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(asset.iv)}, key, asset.cipher);
        assets.push({...asset, blob:new Blob([plain],{type:asset.mime_type})});
      }
      return assets;
    } catch (_) {
      return [];
    }
  }

  async function deleteEncryptedTicket(userId, tripId, sourceRef) {
    try { await withStore('tickets','readwrite',store => idbRequest(store,'delete',ticketRecordId(userId,tripId,sourceRef))); } catch (_) {}
  }

  async function cachedTicketRefs(userId, tripId) {
    if (!userId || !tripId) return new Set();
    try {
      const rows = await withStore('tickets','readonly',store => idbRequest(store,'getAll'));
      return new Set((rows || []).filter(row => row.userId === userId && row.tripId === tripId && row.assets?.length).map(row => row.sourceRef));
    } catch (_) {
      return new Set();
    }
  }

  function dataUriToBlob(dataUri, mime='application/octet-stream') {
    try {
      const [header,payload] = String(dataUri).split(',',2);
      if (!header || payload == null) return null;
      const binary = header.includes(';base64') ? atob(payload) : decodeURIComponent(payload);
      const bytes = new Uint8Array(binary.length);
      for (let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
      return new Blob([bytes],{type:(header.match(/^data:([^;,]+)/)?.[1] || mime)});
    } catch (_) { return null; }
  }

  async function downloadTicketAssets(sourceRef) {
    const ctx = syncContext();
    if (!ctx.session || !ctx.liveTripId) throw new Error('オンラインの旅行セッションが必要です');
    const {data,error} = await ctx.sync.client.from('ticket_assets')
      .select('title,asset_kind,mime_type,storage_path,asset_data,offline_allowed')
      .eq('trip_id',ctx.liveTripId).eq('source_ref',sourceRef);
    if (error) throw error;
    const assets = [];
    for (const row of data || []) {
      let blob = null;
      if (row.storage_path) {
        const {data:file,error:fileError} = await ctx.sync.client.storage.from(BUCKET).download(row.storage_path);
        if (fileError) throw fileError;
        blob = file;
      } else if (String(row.asset_data || '').startsWith('data:')) {
        blob = dataUriToBlob(row.asset_data,row.mime_type);
      }
      if (blob) assets.push({...row,blob});
    }
    return assets;
  }

  function cleanupObjectUrls() {
    objectUrls.forEach(url => URL.revokeObjectURL(url));
    objectUrls.clear();
  }

  function ensureSecureTicketDialog() {
    let dialog = $('#secureTicketDialogV8');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'secureTicketDialogV8';
    dialog.className = 'secure-ticket-dialog-v8';
    dialog.innerHTML = `
      <section class="secure-ticket-panel-v8">
        <header class="secure-ticket-head-v8">
          <div><p class="eyebrow">PRIVATE TICKET</p><h2 id="secureTicketTitleV8">チケット</h2></div>
          <button type="button" class="v4-dialog-close" data-secure-ticket-close aria-label="閉じる">×</button>
        </header>
        <div class="secure-ticket-stage-v8" id="secureTicketStageV8"></div>
      </section>`;
    document.body.appendChild(dialog);
    const close = () => { cleanupObjectUrls(); dialog.close(); };
    dialog.querySelector('[data-secure-ticket-close]').addEventListener('click',close);
    dialog.addEventListener('click',event=>{if(event.target===dialog) close();});
    dialog.addEventListener('close',cleanupObjectUrls);
    return dialog;
  }

  function renderTicketPlaceholder(stage, title, body) {
    cleanupObjectUrls();
    stage.innerHTML = `<div class="secure-ticket-placeholder-v8"><div class="ticket-glyph">▣</div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div>`;
  }

  function renderTicketAssets(stage, assets, cached=false) {
    cleanupObjectUrls();
    stage.innerHTML = '';
    let rendered = 0;
    const priority = {qr:0,barcode:1,ticket_image:2,ticket_pdf:3};
    [...assets].sort((a,b)=>(priority[a.asset_kind]??9)-(priority[b.asset_kind]??9)).forEach(asset => {
      if (!asset.blob) return;
      const url = URL.createObjectURL(asset.blob);
      objectUrls.add(url);
      const wrap = document.createElement('article');
      wrap.className = 'secure-ticket-asset-v8';
      const label = document.createElement('strong');
      label.textContent = asset.title || 'チケット';
      wrap.appendChild(label);
      if (asset.mime_type === 'application/pdf' || asset.asset_kind === 'ticket_pdf') {
        const iframe = document.createElement('iframe');
        iframe.src = url; iframe.title = asset.title || 'チケットPDF';
        wrap.appendChild(iframe);
        const open = document.createElement('a');
        open.href = url; open.target = '_blank'; open.rel = 'noopener'; open.textContent = 'PDFを別画面で開く';
        wrap.appendChild(open);
      } else {
        const img = document.createElement('img');
        img.src = url; img.alt = asset.title || 'チケット / QR';
        wrap.appendChild(img);
      }
      stage.appendChild(wrap);
      rendered += 1;
    });
    if (!rendered) return false;
    const badge = document.createElement('div');
    badge.className = 'secure-cache-badge-v8';
    badge.innerHTML = cached
      ? '<span>✓</span><b>暗号化キャッシュから表示中</b><small>ログイン中のこの端末だけで復号します。</small>'
      : '<span>✓</span><b>非公開保管庫から読み込み済み</b><small>この端末にも暗号化して保存します。</small>';
    stage.appendChild(badge);
    return true;
  }

  async function openSecureTicket(sourceRef, title) {
    const dialog = ensureSecureTicketDialog();
    const stage = $('#secureTicketStageV8',dialog);
    $('#secureTicketTitleV8',dialog).textContent = title || 'チケット';
    renderTicketPlaceholder(stage,'チケットを確認しています','非公開保管庫または暗号化キャッシュを確認中です。');
    dialog.showModal();
    const ctx = syncContext();
    if (!ctx.session || !ctx.userId || !ctx.tripId) {
      renderTicketPlaceholder(stage,'ログインが必要です','QR・PDFは公開ページには置かず、旅行メンバーのログイン後だけ表示します。');
      return;
    }

    if (navigator.onLine !== false && ctx.liveTripId) {
      try {
        const onlineAssets = await downloadTicketAssets(sourceRef);
        if (onlineAssets.length) {
          renderTicketAssets(stage,onlineAssets,false);
          if (onlineAssets.some(asset => asset.offline_allowed !== false)) {
            saveEncryptedTicket(ctx.userId,ctx.tripId,sourceRef,onlineAssets.filter(asset=>asset.offline_allowed!==false)).catch(()=>{});
          }
          return;
        }
        await deleteEncryptedTicket(ctx.userId,ctx.tripId,sourceRef);
        renderTicketPlaceholder(stage,'実チケットは未登録です','予約概要だけでは「表示可能」にしません。PDFまたは画像が非公開保管庫に入ると、ここから表示できます。');
        return;
      } catch (_) {
        // Network/API failure falls through to the encrypted offline cache.
      }
    }

    const cached = await loadEncryptedTicket(ctx.userId,ctx.tripId,sourceRef);
    if (cached.length && renderTicketAssets(stage,cached,true)) return;
    renderTicketPlaceholder(stage,'オフラインではまだ表示できません','この端末で一度チケットを開くと、対応チケットだけ暗号化してオフライン用に保存します。');
  }

  function normalizedTicketFile(file) {
    const name = String(file?.name || '').toLowerCase();
    const type = String(file?.type || '').toLowerCase();
    if (type === 'application/pdf' || type === 'document/pdf' || name.endsWith('.pdf')) return {file,mime:'application/pdf',ext:'pdf'};
    if (type === 'image/png' || name.endsWith('.png')) return {file,mime:'image/png',ext:'png'};
    if (type === 'image/webp' || name.endsWith('.webp')) return {file,mime:'image/webp',ext:'webp'};
    if (type === 'image/jpeg' || name.endsWith('.jpg') || name.endsWith('.jpeg')) return {file,mime:'image/jpeg',ext:'jpg'};
    return null;
  }

  async function uploadTicketFiles(sourceRef, title, files) {
    const ctx = syncContext();
    if (!ctx.session || !ctx.liveTripId || !isOwner(ctx)) throw new Error('OWNERでログインしてください');
    const accepted = [...files].map(normalizedTicketFile).filter(Boolean).filter(item => item.file.size > 0 && item.file.size <= MAX_TICKET_BYTES);
    if (!accepted.length) throw new Error('PDF / JPG / PNG / WebP（15MB以下）を選んでください');
    for (const item of accepted) {
      const {file,mime,ext} = item;
      const assetId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const path = `${ctx.liveTripId}/${sourceRef}/${assetId}.${ext}`;
      const {error:uploadError} = await ctx.sync.client.storage.from(BUCKET).upload(path,file,{contentType:mime,upsert:false,cacheControl:'0'});
      if (uploadError) throw uploadError;
      const {error:rowError} = await ctx.sync.client.from('ticket_assets').insert({
        trip_id:ctx.liveTripId, source_ref:sourceRef, title:title || 'Ticket',
        asset_kind:mime === 'application/pdf' ? 'ticket_pdf' : 'ticket_image',
        mime_type:mime, storage_path:path, original_name:file.name, byte_size:file.size,
        uploaded_by:ctx.userId, offline_allowed:true
      });
      if (rowError) {
        await ctx.sync.client.storage.from(BUCKET).remove([path]).catch(()=>{});
        throw rowError;
      }
    }
    manifestPromise = null; manifestSignature = '';
    toast(`${accepted.length}件のチケットを非公開保管庫に追加しました`);
    await refreshTicketSlots(true);
  }

  async function ticketManifest(force=false) {
    const ctx = syncContext();
    if (!ctx.session || !ctx.userId || !ctx.tripId) return new Set();
    const signature = `${ctx.userId}:${ctx.tripId}`;
    if (!force && manifestPromise && manifestSignature === signature) return manifestPromise;
    manifestSignature = signature;
    manifestPromise = (async () => {
      const refs = await cachedTicketRefs(ctx.userId,ctx.tripId);
      if (navigator.onLine !== false && ctx.liveTripId) {
        try {
          const {data,error} = await ctx.sync.client.from('ticket_assets').select('source_ref').eq('trip_id',ctx.liveTripId);
          if (!error) (data || []).forEach(row => row.source_ref && refs.add(row.source_ref));
        } catch (_) {}
      }
      return refs;
    })();
    return manifestPromise;
  }

  function secureSlotHtml(ready, owner, loggedIn) {
    if (ready) return `<button type="button" class="ticket-open-button secure-ticket-open-v8"><span>▣</span> チケット / QRを表示</button>`;
    if (owner) return `<div class="secure-ticket-missing-v8"><span>実チケット未登録</span><button type="button" class="secure-ticket-upload-v8">PDF / 画像を安全に追加</button><input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" multiple hidden /></div>`;
    if (loggedIn) return `<div class="secure-ticket-missing-v8"><span>実チケット未登録</span><small>予約概要のみ。PDF / QRはまだ保管庫にありません。</small></div>`;
    return `<div class="secure-ticket-missing-v8 quiet"><span>チケットはログイン後に確認</span></div>`;
  }

  async function refreshTicketSlots(force=false) {
    const ctx = syncContext();
    const refs = await ticketManifest(force);
    $$('.secure-ticket-slot-v8').forEach(slot => {
      const sourceRef = slot.dataset.ticketKey || '';
      const title = slot.dataset.ticketTitle || 'チケット';
      const ready = refs.has(sourceRef);
      slot.innerHTML = secureSlotHtml(ready,isOwner(ctx),!!ctx.session);
      slot.querySelector('.secure-ticket-open-v8')?.addEventListener('click',event=>{
        event.preventDefault(); event.stopPropagation(); openSecureTicket(sourceRef,title);
      });
      const input = slot.querySelector('input[type=file]');
      slot.querySelector('.secure-ticket-upload-v8')?.addEventListener('click',event=>{
        event.preventDefault(); event.stopPropagation(); input?.click();
      });
      input?.addEventListener('click',event=>event.stopPropagation());
      input?.addEventListener('change',async event=>{
        event.stopPropagation();
        if (!event.target.files?.length) return;
        const button = slot.querySelector('.secure-ticket-upload-v8');
        if (button) { button.disabled=true; button.textContent='追加中…'; }
        try { await uploadTicketFiles(sourceRef,title,event.target.files); }
        catch (error) { toast(`チケットを追加できませんでした：${error.message || error}`); }
        finally { event.target.value=''; if(button){button.disabled=false;button.textContent='PDF / 画像を安全に追加';} }
      });
    });
  }

  function enhanceTripCards() {
    $$('#tripList .trip-item').forEach(card => {
      const title = card.querySelector('h3')?.textContent?.trim() || '';
      const detail = reservationForTitle(title);
      const extra = card.nextElementSibling?.classList.contains('trip-extra') ? card.nextElementSibling : null;
      if (!extra) return;

      // v4 used ticketKey as a proxy for availability. v8 removes those optimistic buttons;
      // an actual asset row or encrypted cache is required before "表示" appears.
      extra.querySelectorAll('.ticket-open-button:not(.secure-ticket-open-v8)').forEach(button => button.remove());

      if (title.includes('hu Firenze Camping in Town')) installFlorenceExperience(extra);
      if (!detail?.ticketKey) return;
      let slot = [...extra.querySelectorAll('.secure-ticket-slot-v8')].find(node => node.dataset.ticketKey === detail.ticketKey);
      if (!slot) {
        slot = document.createElement('div');
        slot.className = 'secure-ticket-slot-v8';
        slot.dataset.ticketKey = detail.ticketKey;
        slot.dataset.ticketTitle = title;
        extra.appendChild(slot);
      }
    });
    refreshTicketSlots(false).catch(()=>{});
  }

  function wrapTrip() {
    if (baseTrip || typeof renderTrip !== 'function') return;
    baseTrip = renderTrip;
    renderTrip = function renderTripBuildV8(...args) {
      const result = baseTrip.apply(this,args);
      queueMicrotask(enhanceTripCards);
      return result;
    };
    enhanceTripCards();
  }

  function enhanceMemberDialog() {
    const body = $('#memberDialogBody');
    if (!body) return;
    const ctx = syncContext();
    if (!isStandalone() && !body.querySelector('.pwa-homescreen-tip-v8')) {
      const tip = document.createElement('div');
      tip.className = 'pwa-homescreen-tip-v8';
      tip.innerHTML = `<span>＋</span><div><b>iPhoneではホーム画面に追加できます</b><small>Safariの共有ボタン →「ホーム画面に追加」で、次からアプリのように起動できます。</small></div>`;
      body.appendChild(tip);
    }
    if (ctx.session && ctx.sync?.state?.trip && !body.querySelector('.member-status-v8')) {
      const owner = isOwner(ctx);
      const status = document.createElement('div');
      status.className = `member-status-v8 ${owner?'owner':'member'}`;
      status.innerHTML = owner
        ? `<span>OWNER</span><div><b>この旅行のオーナー</b><small>メンバー一覧と妹2人への招待リンクを管理できます。</small></div>`
        : `<span>MEMBER</span><div><b>Sister Tripに参加中</b><small>自分のアカウントで、3人の予定と「行きたい」を共有しています。</small></div>`;
      body.prepend(status);
    }
    refreshTicketSlots(true).catch(()=>{});
  }

  function observeDynamicUi() {
    const tripList = $('#tripList');
    if (tripList) new MutationObserver(()=>queueMicrotask(enhanceTripCards)).observe(tripList,{childList:true});
    const memberBody = $('#memberDialogBody');
    if (memberBody) new MutationObserver(()=>queueMicrotask(enhanceMemberDialog)).observe(memberBody,{childList:true});
  }

  function preserveInviteAcrossSignup() {
    const sync = window.SisterSync;
    if (!sync?.client?.auth) return;
    const urlToken = new URLSearchParams(location.search).get('invite');
    if (urlToken) {
      try { sessionStorage.setItem('sister-trip-pending-invite',urlToken); } catch (_) {}
      if (!sync.state.inviteToken) sync.state.inviteToken = urlToken;
    } else if (!sync.state.inviteToken) {
      try { sync.state.inviteToken = sessionStorage.getItem('sister-trip-pending-invite') || null; } catch (_) {}
    }
    if (!sync.client.auth.__sisterTripInviteRedirectV8) {
      const originalSignUp = sync.client.auth.signUp.bind(sync.client.auth);
      sync.client.auth.signUp = credentials => {
        const pending = sync.state.inviteToken || (() => { try { return sessionStorage.getItem('sister-trip-pending-invite') || ''; } catch (_) { return ''; } })();
        const redirect = `${location.origin}${location.pathname}${pending ? `?invite=${encodeURIComponent(pending)}` : ''}`;
        return originalSignUp({...credentials,options:{...(credentials?.options || {}),emailRedirectTo:redirect}});
      };
      sync.client.auth.__sisterTripInviteRedirectV8 = true;
    }
  }

  function watchAuth() {
    const sync = window.SisterSync;
    if (!sync?.client?.auth) return;
    sync.client.auth.onAuthStateChange(()=>{
      manifestPromise=null; manifestSignature='';
      setTimeout(async()=>{
        preserveInviteAcrossSignup();
        const pending = sync.state.inviteToken;
        if (sync.state.session && pending && !sync.state.trip) {
          try { await sync.refreshTrip(); } catch (_) {}
        }
        if (sync.state.trip && pending) { try { sessionStorage.removeItem('sister-trip-pending-invite'); } catch (_) {} }
        enhanceMemberDialog(); enhanceTripCards();
      },0);
    });
  }

  function install() {
    if (installed) return;
    installed = true;
    applyFlorencePlan();
    wrapTimeline();
    wrapTrip();
    observeDynamicUi();
    preserveInviteAcrossSignup();
    watchAuth();
    enhanceMemberDialog();
    normalizePlanLabels();
    enhanceTripCards();
    window.SisterTripBuildV8 = {
      build:BUILD,
      refreshTickets:()=>refreshTicketSlots(true),
      openTicket:openSecureTicket,
      uploadTicketFiles,
      applyFlorencePlan
    };
  }

  window.SisterTripBuildV8Install = install;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
