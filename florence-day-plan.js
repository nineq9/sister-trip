/* Sister Trip — Florence 24 Sep PLAN.
   Public-safe travel plan only. Reservation secrets stay in authenticated Supabase data. */
(() => {
  if (typeof demo === 'undefined' || !demo) return;

  const florenceImage = typeof CITY_IMAGES !== 'undefined' ? CITY_IMAGES.firenze : '';

  demo.dayPlans = demo.dayPlans || {};
  demo.dayPlans['09-24'] = {
    date:'24 SEP',
    dow:'Thu',
    city:'firenze',
    title:'Firenze · 街もホテルも楽しむ日',
    theme:'11時ごろ到着。荷物を預けて旧市街へ。夕方はhu Firenzeのプール、温水ジャグジー、BBQまでをひとつの旅体験として楽しむ。',
    items:[
      {time:'11:00ごろ', title:'フィレンツェ到着', meta:'到着時刻はPLAN · 移動状況に合わせて変更OK', status:'plan', placeId:null, image:florenceImage},
      {time:'11:30ごろ', title:'hu Firenzeへ移動・荷物を預ける', meta:'身軽になって旧市街へ · PLAN', status:'plan', placeId:'florence-stay', image:florenceImage},
      {time:'12:30〜16:15', title:'フィレンツェ旧市街観光', meta:'Duomo → Signoria → Ponte Vecchioを中心に · PLAN', status:'plan', placeId:'florence-duomo', image:florenceImage},
      {time:'16:30ごろ', title:'市内スーパーでBBQ食材を購入', meta:'肉・野菜・パン・チーズ・飲み物などを現地調達 · PLAN', status:'plan', placeId:null, image:florenceImage},
      {time:'17:30ごろ', title:'hu Firenzeへ戻る・チェックイン', meta:'宿泊予約は確認済み／戻る時刻はPLAN', status:'plan', placeId:'florence-stay', image:florenceImage},
      {time:'18:00ごろ', title:'プール ＋ 温水ジャグジー', meta:'天候・当日の営業時間を優先 · PLAN', status:'plan', placeId:'florence-stay', image:florenceImage},
      {time:'19:15ごろ', title:'3人でBBQ', meta:'共用グリル €3（約¥560）/18分。3人なら36分＝€6（約¥1,115）を目安 · PLAN', status:'plan', placeId:'florence-stay', image:florenceImage},
      {time:'20:15以降', title:'Lounge Bar / バンガローでゆっくり', meta:'営業状況と体力に合わせてのんびり · PLAN', status:'plan', placeId:'florence-stay', image:florenceImage}
    ]
  };

  const v4 = window.SisterTripV4Data;
  if (v4?.reservationDetails) {
    const stay = v4.reservationDetails.find(item => item.match === 'hu Firenze');
    if (stay) {
      const experience = [
        'チェックイン前は荷物を預けて旧市街へ行くPLAN',
        '夕方はプール＋温水ジャグジーを楽しむPLAN（天候・当日の営業時間を優先）',
        '共用BBQグリルは €3（約¥560）/18分。3人なら36分＝€6（約¥1,115）程度を目安',
        'BBQ食材は市内スーパーで別途購入して戻るPLAN',
        'BBQの事前予約が必要という公式案内は確認されていない',
        '20:15以降はLounge BarまたはバンガローでゆっくりするPLAN'
      ];
      for (const bullet of experience) {
        if (!stay.bullets.includes(bullet)) stay.bullets.push(bullet);
      }
    }
  }

  if (typeof selectedTripDayKey !== 'undefined' && selectedTripDayKey === '09-24' && typeof renderTimeline === 'function') {
    renderTimeline();
  }

  window.SisterTripFlorencePlan = {updated:'2026-08-23', day:'09-24', mode:'PLAN'};
})();
