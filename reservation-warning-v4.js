/* Keep the reservation warning panel aligned with the latest confirmed truth. */
(() => {
  function renderReservationWarnings() {
    const conflict = document.querySelector('.conflict-card');
    if (!conflict) return;
    conflict.innerHTML = `
      <div class="conflict-top"><span>!</span><strong>いま確認が必要なのは2つ</strong></div>
      <div class="compare-row"><span>AURA Invalides</span><b>未購入</b></div>
      <p>9/12 21:35の3名分を希望中。オンライン購入は未完了で、先方から電話決済の案内が届いています。</p>
      <div class="compare-row"><span>Roma stay / 帰宅</span><b>未登録</b></div>
      <p>ローマ宿と9/28の帰宅移動は、確定予約をまだ登録していません。</p>`;
  }

  function install() {
    renderReservationWarnings();
    const tripList = document.getElementById('tripList');
    if (!tripList || tripList.dataset.truthObserver === '1') return;
    tripList.dataset.truthObserver = '1';
    new MutationObserver(() => renderReservationWarnings()).observe(tripList, {childList:true});
  }

  window.SisterTripReservationWarningsV4Install = install;
})();
