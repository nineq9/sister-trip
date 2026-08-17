(() => {
  const cfg = window.SISTER_TRIP_CONFIG;
  if (!cfg || !window.supabase) return;

  const client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  const state = { session:null, trip:null, members:[], channel:null, inviteToken:new URLSearchParams(location.search).get('invite') };
  const escapeHtml = (v='') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const toast = msg => window.showToast ? window.showToast(msg) : console.log(msg);

  function installDialog(){
    if (document.getElementById('memberDialog')) return;
    const dialog = document.createElement('dialog');
    dialog.id = 'memberDialog';
    dialog.className = 'member-dialog';
    dialog.innerHTML = `
      <section class="member-panel">
        <div class="sheet-handle"></div>
        <div class="dialog-header">
          <div><p class="eyebrow">SISTERS SYNC</p><h2>3人の旅を同期</h2></div>
          <button class="close-button" type="button" data-close-member>×</button>
        </div>
        <div id="memberDialogBody"></div>
      </section>`;
    document.body.appendChild(dialog);
    dialog.querySelector('[data-close-member]').addEventListener('click', () => dialog.close());
    const trigger = document.getElementById('membersButton');
    if (trigger) trigger.addEventListener('click', () => { renderDialog(); dialog.showModal(); });
  }

  function renderLoggedOut(body){
    body.innerHTML = `
      <p class="sync-copy">それぞれ自分のアカウントで入ると、行きたい場所・予定変更・クエスト進捗が3台に反映されます。</p>
      ${state.inviteToken ? '<div class="sync-success">招待リンクを確認しました。ログイン後、この旅行に参加します。</div>' : ''}
      <div class="auth-tabbar"><button class="active" type="button" data-auth-tab="login">ログイン</button><button type="button" data-auth-tab="signup">はじめて使う</button></div>
      <form class="auth-form" id="authForm">
        <input name="name" id="authName" placeholder="表示名（例：あすみ）" autocomplete="name" hidden />
        <input name="email" type="email" placeholder="メールアドレス" autocomplete="email" required />
        <input name="password" type="password" placeholder="パスワード（6文字以上）" minlength="6" autocomplete="current-password" required />
        <button class="sync-primary" type="submit">ログイン</button>
      </form>
      <div id="authMessage"></div>`;
    let mode='login';
    body.querySelectorAll('[data-auth-tab]').forEach(btn => btn.addEventListener('click', () => {
      mode=btn.dataset.authTab;
      body.querySelectorAll('[data-auth-tab]').forEach(x=>x.classList.toggle('active',x===btn));
      const name = body.querySelector('#authName');
      name.hidden = mode !== 'signup'; name.required = mode === 'signup';
      body.querySelector('#authForm button').textContent = mode === 'signup' ? 'アカウントを作る' : 'ログイン';
      body.querySelector('[name=password]').autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
    }));
    body.querySelector('#authForm').addEventListener('submit', async e => {
      e.preventDefault();
      const form=new FormData(e.currentTarget), email=String(form.get('email')).trim(), password=String(form.get('password')), displayName=String(form.get('name')||'').trim();
      const msg=body.querySelector('#authMessage'); msg.innerHTML='';
      try {
        if (mode==='signup') {
          const {data,error}=await client.auth.signUp({email,password,options:{data:{display_name:displayName}}});
          if(error) throw error;
          if(!data.session){ msg.innerHTML='<div class="sync-success">確認メールを送りました。メール内のリンクを開いたあと、ここからログインしてください。</div>'; return; }
        } else {
          const {error}=await client.auth.signInWithPassword({email,password}); if(error) throw error;
        }
        await bootSession(); renderDialog(); toast('3人同期を開始しました');
      } catch(err){ msg.innerHTML=`<div class="sync-warning">${escapeHtml(err.message || 'ログインできませんでした')}</div>`; }
    });
  }

  async function createTrip(name){
    if(!state.session) return;
    const user=state.session.user;
    const {data,error}=await client.from('trips').insert({name:name||'SISTERS IN EUROPE 2026',slug:`sisters-europe-${user.id.slice(0,8)}`,starts_on:'2026-09-11',ends_on:'2026-09-29',owner_user_id:user.id}).select().single();
    if(error) throw error;
    const displayName=user.user_metadata?.display_name || user.email?.split('@')[0] || 'Owner';
    const {error:memberError}=await client.from('trip_members').insert({trip_id:data.id,user_id:user.id,display_name:displayName,role:'owner'}); if(memberError) throw memberError;
    const cities=[['Paris','France','2026-09-11','2026-09-18',1],['Zürich','Switzerland','2026-09-18','2026-09-19',2],['Luzern','Switzerland','2026-09-19','2026-09-21',3],['Milano','Italy','2026-09-21','2026-09-23',4],['Venezia','Italy','2026-09-23','2026-09-24',5],['Firenze','Italy','2026-09-24','2026-09-26',6],['Roma','Italy','2026-09-26','2026-09-29',7]].map(([city,country,s,e,sort])=>({trip_id:data.id,name:city,country,starts_on:s,ends_on:e,sort_order:sort}));
    await client.from('cities').insert(cities);
    state.trip=data; await refreshMembers(); subscribeRealtime(); updateTopbar(); return data;
  }

  async function acceptInviteIfNeeded(){
    if(!state.inviteToken || !state.session) return false;
    const displayName=state.session.user.user_metadata?.display_name || state.session.user.email?.split('@')[0] || 'Sister';
    const {data,error}=await client.rpc('accept_trip_invite',{p_token:state.inviteToken,p_display_name:displayName});
    if(error){ if(!String(error.message).includes('invalid or expired')) throw error; return false; }
    history.replaceState({},'',location.pathname);
    state.inviteToken=null;
    const {data:trip}=await client.from('trips').select('*').eq('id',data).single(); state.trip=trip; return true;
  }

  async function refreshTrip(){
    if(!state.session){ state.trip=null; state.members=[]; return; }
    await acceptInviteIfNeeded();
    if(!state.trip){ const {data,error}=await client.from('trips').select('*').order('starts_on',{ascending:true}).limit(1); if(!error && data?.length) state.trip=data[0]; }
    if(state.trip) await refreshMembers();
  }

  async function refreshMembers(){
    if(!state.trip) return;
    const {data}=await client.from('trip_members').select('user_id,display_name,role,joined_at').eq('trip_id',state.trip.id).order('joined_at'); state.members=data||[]; updateTopbar();
  }

  async function createInvite(){
    if(!state.trip || !state.session) throw new Error('旅行を作成してください');
    const {data,error}=await client.from('trip_invites').insert({trip_id:state.trip.id,max_uses:2,created_by:state.session.user.id}).select('token').single(); if(error) throw error;
    return `${location.origin}${location.pathname}?invite=${data.token}`;
  }

  function subscribeRealtime(){
    if(state.channel){ client.removeChannel(state.channel); state.channel=null; }
    if(!state.trip) return;
    state.channel=client.channel(`trip-${state.trip.id}`)
      .on('postgres_changes',{event:'*',schema:'public',table:'wishes',filter:`trip_id=eq.${state.trip.id}`},payload=>{ if(payload.eventType==='INSERT') toast('新しい「行きたい」が追加されました ♡'); })
      .on('postgres_changes',{event:'*',schema:'public',table:'itinerary_items',filter:`trip_id=eq.${state.trip.id}`},()=>toast('旅程が更新されました'))
      .subscribe();
  }

  function updateTopbar(){
    const button=document.getElementById('membersButton'); if(!button) return;
    button.classList.toggle('synced',!!state.trip);
    const text=button.querySelector(':scope > span:last-child');
    if(text) text.textContent=state.trip ? `${Math.max(state.members.length,1)}人で同期中` : '3人で編集中';
    const stack=button.querySelector('.avatar-stack');
    if(stack && state.members.length){ stack.innerHTML=state.members.slice(0,3).map((m,i)=>`<span class="avatar ${['avatar-a','avatar-b','avatar-c'][i]||'avatar-a'}">${escapeHtml((m.display_name||'?').slice(0,1).toUpperCase())}</span>`).join(''); }
  }

  function renderLoggedIn(body){
    const user=state.session.user;
    if(!state.trip){
      body.innerHTML=`<p class="sync-copy"><b>${escapeHtml(user.email)}</b> でログイン中。最初の1人が旅行を作ると、妹さん2人へ招待リンクを送れます。</p>${state.inviteToken?'<div class="sync-success">招待を受け取っています。下の「招待を読み込む」を押してください。</div>':''}<div class="trip-create"><input id="tripName" value="SISTERS IN EUROPE 2026" aria-label="旅行名"/><button class="sync-primary" id="createTripBtn" type="button">この旅行を作る</button>${state.inviteToken?'<button class="sync-secondary" id="acceptInviteBtn" type="button">招待を読み込む</button>':''}</div><div class="logout-row"><button id="logoutBtn" type="button">ログアウト</button></div>`;
      body.querySelector('#createTripBtn').addEventListener('click',async()=>{try{await createTrip(body.querySelector('#tripName').value);renderDialog();toast('3人共有の旅行を作成しました');}catch(e){toast(e.message)}});
      body.querySelector('#acceptInviteBtn')?.addEventListener('click',async()=>{try{await acceptInviteIfNeeded();await refreshTrip();subscribeRealtime();renderDialog();toast('旅行に参加しました');}catch(e){toast(e.message)}});
    } else {
      const owner=state.trip.owner_user_id===user.id;
      body.innerHTML=`
        <div class="sync-state-card"><div class="sync-state-line"><strong><i class="sync-dot"></i>${escapeHtml(state.trip.name)}</strong><span>Realtime ON</span></div></div>
        <div class="member-list">${state.members.map((m,i)=>`<div class="member-row"><span class="member-bubble">${escapeHtml((m.display_name||'?').slice(0,1))}</span><div><b>${escapeHtml(m.display_name||'Sister')}</b><small>${m.user_id===user.id?'この端末':'共有メンバー'}</small></div><span class="member-role">${m.role==='owner'?'OWNER':'MEMBER'}</span></div>`).join('')}</div>
        ${owner?'<div class="invite-box"><h3>妹さんを招待</h3><p>リンクは2人まで使えます。妹さんはリンクを開いて、自分のアカウントでログインするだけ。</p><div class="invite-actions"><div class="invite-link" id="inviteLink">まだ作っていません</div><button class="invite-copy" id="inviteBtn" type="button">作る</button></div></div>':''}
        <div class="current-member-note">「行きたい」を追加すると、このアカウントの希望として3人に同期されます。</div>
        <div class="logout-row"><button id="logoutBtn" type="button">ログアウト</button></div>`;
      body.querySelector('#inviteBtn')?.addEventListener('click',async()=>{try{const link=await createInvite();body.querySelector('#inviteLink').textContent=link;body.querySelector('#inviteBtn').textContent='コピー';body.querySelector('#inviteBtn').onclick=async()=>{await navigator.clipboard.writeText(link);toast('招待リンクをコピーしました');};}catch(e){toast(e.message)}});
    }
    body.querySelector('#logoutBtn')?.addEventListener('click',async()=>{await client.auth.signOut();state.session=null;state.trip=null;state.members=[];if(state.channel)client.removeChannel(state.channel);updateTopbar();renderDialog();toast('ログアウトしました');});
  }

  function renderDialog(){ const body=document.getElementById('memberDialogBody'); if(!body) return; state.session ? renderLoggedIn(body) : renderLoggedOut(body); }

  async function addWishFromForm(formElement){
    const form=new FormData(formElement), label=String(form.get('place')||'').trim(), priority=String(form.get('priority')||'maybe'); if(!label) return;
    if(!state.session || !state.trip) return false;
    const {data:place,error:placeError}=await client.from('places').insert({trip_id:state.trip.id,name:label,source_url:/^https?:\/\//.test(label)?label:null,created_by:state.session.user.id}).select('id').single(); if(placeError) throw placeError;
    const {error}=await client.from('wishes').insert({trip_id:state.trip.id,place_id:place.id,member_user_id:state.session.user.id,label,source_url:/^https?:\/\//.test(label)?label:null,priority}); if(error) throw error;
    return true;
  }

  function overrideWishForm(){
    const form=document.getElementById('addPlaceForm'); if(!form) return;
    form.addEventListener('submit',async e=>{
      if(!state.session || !state.trip) return;
      e.preventDefault(); e.stopImmediatePropagation();
      try{const added=await addWishFromForm(form); if(added){document.getElementById('addPlaceDialog')?.close();form.reset();toast('3人に「行きたい」を同期しました ♡');}}
      catch(err){toast(`同期できませんでした：${err.message}`)}
    },true);
    const memberChoice=form.querySelector('.member-choice');
    if(memberChoice){ memberChoice.insertAdjacentHTML('beforebegin','<div class="current-member-note" id="wishOwnerNote">同期時は、ログインしている本人の希望として保存されます。</div>'); }
  }

  async function bootSession(){
    const {data:{session}}=await client.auth.getSession(); state.session=session;
    if(session){ await refreshTrip(); subscribeRealtime(); }
    updateTopbar();
  }

  document.addEventListener('DOMContentLoaded', async()=>{
    installDialog(); overrideWishForm(); await bootSession();
    client.auth.onAuthStateChange(async(_event,session)=>{state.session=session;if(session){await refreshTrip();subscribeRealtime();}else{state.trip=null;state.members=[];}updateTopbar();renderDialog();});
  });

  window.SisterSync={client,state,createInvite,refreshTrip,addWishFromForm};
})();
