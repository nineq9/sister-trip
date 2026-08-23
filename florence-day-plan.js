/* Sister Trip — Florence 24 Sep plan refinement.
   Mixes user-confirmed arrival intent with verified hu Firenze booking details.
   Facility use is kept FLEX where weather/opening hours can affect it. */
(() => {
  if (typeof demo === 'undefined' || !demo) return;

  const florenceImage = typeof CITY_IMAGES !== 'undefined' ? CITY_IMAGES.firenze : '';

  demo.dayPlans = demo.dayPlans || {};
  demo.dayPlans['09-24'] = {
    date:'24 SEP',
    dow:'Thu',
    city:'firenze',
    title:'Firenze · 街もホテルも楽しむ日',
    theme:'11時ごろ到着。荷物を置いて旧市街を歩き、夕方はhu FirenzeのプールとBBQを旅のイベントにする。',
    items:[
      {time:'11:00', title:'Firenze バス停に到着', meta:'到着予定 · 3人＋リュック＆キャリー', status:'flex', placeId:null, image:florenceImage},
      {time:'11:30〜12:15', title:'hu Firenzeへ移動・荷物を預ける', meta:'チェックイン前は荷物を預けて身軽に', status:'flex', placeId:'florence-stay', image:florenceImage},
      {time:'13:00〜16:30', title:'Duomo → Signoria → Ponte Vecchio', meta:'旧市街を写真と食べ歩き中心で · FLEX', status:'flex', placeId:'florence-duomo', image:florenceImage},
      {time:'16:30〜17:00', title:'BBQ食材を買う', meta:'市内スーパーでパン・野菜・チーズ・飲み物など', status:'flex', placeId:null, image:florenceImage},
      {time:'17:30', title:'hu Firenze check-in', meta:'デラックスバンガロー · 予約済み', status:'locked', placeId:'florence-stay', image:florenceImage},
      {time:'18:00〜19:00', title:'プール ＋ 温水ジャグジー', meta:'プールは屋外・非温水。9月営業／天候・当日の営業時間を優先', status:'flex', placeId:'florence-stay', image:florenceImage},
      {time:'19:15〜20:00', title:'3人でBBQ NIGHT', meta:'共用BBQ · €3で約18分稼働。3人なら€6＝約36分を目安', status:'flex', placeId:'florence-stay', image:florenceImage},
      {time:'20:15〜', title:'Pool Bar / Lounge Bar → バンガロー', meta:'営業していればゆっくり。翌日のローマ移動に備えて余白を残す', status:'flex', placeId:'florence-stay', image:florenceImage}
    ]
  };

  const v4 = window.SisterTripV4Data;
  if (v4?.reservationDetails) {
    const stay = v4.reservationDetails.find(item => item.match === 'hu Firenze');
    if (stay) {
      const extra = [
        'チェックイン前は荷物預かりを使って旧市街へ行く計画',
        '夕方はプール＋温水ジャグジーを予定（プールは屋外・非温水／天候・営業時間次第）',
        'BBQは共用グリル。€3で約18分、3人なら€6＝約36分を目安',
        '公式FAQ上はBBQの事前予約案内なし。受付でトークンを購入して利用',
        'BBQ食材は旧市街のスーパーで買って戻る計画'
      ];
      for (const bullet of extra) {
        if (!stay.bullets.includes(bullet)) stay.bullets.push(bullet);
      }
    }
  }

  if (typeof selectedTripDayKey !== 'undefined' && selectedTripDayKey === '09-24' && typeof renderTimeline === 'function') {
    renderTimeline();
  }

  window.SisterTripFlorencePlan = {updated:'2026-08-23', day:'09-24'};
})();
