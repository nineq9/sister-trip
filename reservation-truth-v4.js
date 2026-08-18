/* Sister Trip v4 — reservation-email truth corrections and additional safe summaries. */
(() => {
  const v4 = window.SisterTripV4Data;
  if (!v4 || typeof demo === 'undefined') return;

  v4.reservationDetails.unshift(
    {match:'Paris stay',bullets:['予約確認メール上は 9/11 15:00以降チェックイン → 9/17 11:00までにチェックアウト','6泊','3名利用はホスト確認・許可済み','22:00–09:00は騒音禁止の案内あり','正確な住所・確認コード・ホスト連絡先は非公開領域だけで表示']},
    {match:'Lindt Home of Chocolate',ticketKey:'lindt-zurich',bullets:['9/18 15:00 入場','Chocolate museum · Single ticket','大人3名','合計 CHF 51.00','支払い受領済み','メール内にモバイルチケットのダウンロードリンクあり']},
    {match:'AURA Invalides',bullets:['9/12 21:35 の3名分を希望','オンライン購入はサーバーエラーで未完了','先方から、9:30以降に予約窓口へ電話すれば電話決済可能との返信あり','まだ購入完了メールがないためLOCKEDにしない']},
    {match:'SBB nature day',ticketKey:'sbb-saver-day-pass',bullets:['Saver Day Pass · 2等・Full fare','9/19 00:00 → 9/20 05:00 有効','CHF 79.00','GA Travelcard area の対象路線で利用可能','交換不可・払い戻しは例外的な場合のみ','メール内リンクからスマホでチケット提示可能']}
  );

  const parisStay = (demo.mapPlaces || []).find(place => place.id === 'paris-stay');
  if (parisStay) {
    parisStay.eyebrow = 'BASE · 11–17 SEP';
    parisStay.meta = 'Bagnolet · 6 nights · 3名許可済み';
    parisStay.description = '9/11チェックイン、9/17チェックアウトの6泊。3名利用はホスト確認・許可済みです。';
  }

  const parisCheckin = demo.dayPlans?.['09-11']?.items?.find(item => item.placeId === 'paris-stay');
  if (parisCheckin) parisCheckin.meta = 'Bagnolet · 6 nights · 3名許可済み';

  const tripStay = (demo.tripItems || []).find(item => item.title === 'Paris stay');
  if (tripStay) {
    tripStay.meta = '11 → 17 Sep · 6 nights · 3名許可済み';
    tripStay.status = 'verified';
  }

  window.SisterTripReservationTruthV4 = {
    parisStayConflict: null,
    parisStayGuestsApproved: true
  };
})();
