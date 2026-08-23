/* Sister Trip — Gmail verified reservations snapshot (2026-08-23).
   Public-safe summaries only: no booking PINs, ticket numbers, QR codes or PDFs. */
(() => {
  const verifiedTripItems = [
    {type:'move', icon:'✈', title:'BEG → CDG', meta:'9/11 06:35 → 09:15 · Air Serbia JU240 · Asumi · LOCKED', verified:true},
    {type:'stay', icon:'⌂', title:'Paris stay', meta:'9/11–17 · Bagnolet · 6 nights · 3名了承済み', verified:true},
    {type:'ticket', icon:'◇', title:'Disneyland Paris', meta:'9/14 · 1-Day / 1-Park · 大人1名 · LOCKED', verified:true},
    {type:'ticket', icon:'◇', title:'Notre-Dame Towers', meta:'9/15 19:30 · 3名 · Paris Museum Pass枠 · LOCKED', verified:true},
    {type:'ticket', icon:'◇', title:'Versailles', meta:'9/16 09:00 · Château Entrée A · 3名 · LOCKED', verified:true},
    {type:'ticket', icon:'◇', title:'Sainte-Chapelle', meta:'9/17 13:00 · 3名 · 時間枠予約 · LOCKED', verified:true},
    {type:'move', icon:'↗', title:'Paris → Zürich', meta:'9/17 22:00 → 9/18 07:35 · FlixBus · LOCKED', verified:true},
    {type:'stay', icon:'⌂', title:'Viadukt Apartments', meta:'9/18–19 · Zürich · 3名', verified:true},
    {type:'ticket', icon:'◇', title:'Lindt Home of Chocolate', meta:'9/18 15:00 · 大人3名 · CHF 51支払済み · LOCKED', verified:true},
    {type:'move', icon:'↗', title:'SBB Saver Day Pass', meta:'9/19 00:00 → 9/20 05:00 · 2等 · Asumi · CHF 79', verified:true},
    {type:'stay', icon:'⌂', title:'Luzern Youth Hostel', meta:'9/19–20 · 女性ドミトリー3床 · 朝食込み', verified:true},
    {type:'move', icon:'↗', title:'Luzern → Milano', meta:'9/21 01:30 → 04:50 · FlixBus · LOCKED', verified:true},
    {type:'stay', icon:'⌂', title:'Star Hostel San Siro Fiera', meta:'9/21–23 · Milano · トリプルルーム3名', verified:true},
    {type:'move', icon:'↗', title:'Milano → Venezia', meta:'9/23 08:00 → 11:30 · FlixBus · LOCKED', verified:true},
    {type:'stay', icon:'⌂', title:'S Marco Apartments', meta:'9/23–24 · Venezia Mestre · 3名', verified:true},
    {type:'stay', icon:'⌂', title:'hu Firenze Camping in Town', meta:'9/24–25 · デラックスバンガロー · 3名', verified:true}
  ];

  const additions = [
    {match:'Disneyland Paris',ticketKey:'klook-disneyland-paris-2026-09-14',bullets:['9/14 利用・1デー1パーク（日付指定）','大人1名の予約','KlookのPDFバウチャーあり','利用日の72時間前（現地時間）までは全額返金の案内']},
    {match:'Notre-Dame Towers',ticketKey:'notre-dame-towers-2026-09-15',bullets:['9/15 19:30・3名','Paris Museum Pass利用の予約枠','遅刻すると予約取消の案内','南塔は424段・高さ69m・エレベーターなし','この券だけでは大聖堂本体への入場券にはならない']},
    {match:'Versailles',ticketKey:'versailles-2026-09-16',bullets:['9/16 09:00・3名','Château - Entrée A / Pavillon Dufour','Billet Passeport・無料対象者3名','庭園は含まれない']},
    {match:'Sainte-Chapelle',ticketKey:'sainte-chapelle-2026-09-17',bullets:['9/17 13:00・3名','これは入場券ではなく時間枠予約','別途すでに購入済みの入場券 / パスを提示する必要あり','セキュリティチェックで遅延する場合あり']},
    {match:'Lindt Home of Chocolate',ticketKey:'lindt-zurich-2026-09-18',bullets:['9/18 15:00・Chocolate museum','大人3名','合計 CHF 51 支払済み']},
    {match:'SBB Saver Day Pass',ticketKey:'sbb-saver-day-pass-2026-09-19',bullets:['9/19 00:00〜9/20 05:00 有効','Saver Day Pass・2等・Full fare','Asumi 1名','CHF 79','GA Travelcard area対象路線で有効','交換不可・返金は例外時のみ']},
    {match:'Star Hostel San Siro Fiera',bullets:['9/21 チェックイン → 9/23 チェックアウト','大人3名・トリプルルーム・共用バスルーム','宿泊＋税・リネンを含む総額 €136.72','Booking.com事前決済 €64.72','現地払い：市税 €57＋ベッドリネン €15','返金不可']}
  ];

  function apply() {
    if (typeof demo !== 'undefined' && demo) {
      demo.tripItems = verifiedTripItems.map(item => ({...item}));
      if (typeof renderTrip === 'function') renderTrip(typeof currentTripFilter !== 'undefined' ? currentTripFilter : 'all');
    }

    const v4 = window.SisterTripV4Data;
    if (v4?.reservationDetails) {
      for (const item of additions) {
        if (!v4.reservationDetails.some(existing => existing.match === item.match)) {
          v4.reservationDetails.push(item);
        }
      }
    }

    window.SisterTripGmailSnapshot = {
      checkedAt:'2026-08-23',
      itemCount:verifiedTripItems.length,
      source:'Gmail booking confirmations / ticket PDFs'
    };
  }

  apply();
  window.SisterTripApplyGmailSnapshot = apply;
})();
