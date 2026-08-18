/* Sister Trip v5 — travel-budget display metadata.
   Prices are practical trip-planning estimates, not checkout guarantees.
   FX snapshot for offline display: 2026-08-18, EUR→JPY 184.808 / CHF→JPY 196.545. */
(() => {
  const v4 = window.SisterTripV4Data;
  if (!v4) return;

  const EUR_JPY = 184.808;
  const CHF_JPY = 196.545;
  const maps = q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

  const meta = {
    'paris-chartier': {price:'€7–20', yen:'約¥1,300–3,700 / 人', party:'3人 約¥3,900–11,100', sourceLabel:'公式メニュー', sourceUrl:'https://www.bouillon-chartier.com/en/bouillon-chartier-grands-boulevards-en/'},
    'paris-carnavalet': {price:'€0', yen:'無料', party:'3人 €0', sourceLabel:'Musée Carnavalet 公式', sourceUrl:'https://www.carnavalet.paris.fr/visiter/informations-pratiques'},
    'paris-monoprix': {price:'€2–8 目安', yen:'約¥370–1,480 / 1点', party:'買う物だけ比較', sourceLabel:'Monoprix', sourceUrl:'https://www.monoprix.fr/'},
    'zurich-migros': {price:'CHF 10–20 目安', yen:'約¥2,000–3,930 / 人', party:'3人 約¥5,900–11,800', sourceLabel:'Migros', sourceUrl:'https://www.migros.ch/en'},
    'zurich-poly': {price:'CHF 0', yen:'無料', party:'3人 CHF 0', sourceLabel:'場所を確認', sourceUrl:maps('Polyterrasse Zürich')},
    'zurich-choco': {price:'CHF 2–8 目安', yen:'約¥390–1,570 / 1点', party:'スーパー価格を比較', sourceLabel:'Migros', sourceUrl:'https://www.migros.ch/en'},
    'luzern-manora': {price:'CHF 10–20 目安', yen:'約¥2,000–3,930 / 人', party:'3人 約¥5,900–11,800', sourceLabel:'Manor', sourceUrl:'https://www.manor.ch/'},
    'luzern-musegg': {price:'CHF 0*', yen:'無料区間中心', party:'公開塔は季節確認', sourceLabel:'Museggmauer 公式', sourceUrl:'https://www.museggmauer.ch/'},
    'luzern-lake': {price:'CHF 4–10 目安', yen:'約¥790–1,970 / 人', party:'3人 約¥2,400–5,900', sourceLabel:'Coop', sourceUrl:'https://www.coop.ch/'},
    'milan-luini': {price:'€3–6 目安', yen:'約¥550–1,110 / 人', party:'3人 約¥1,700–3,300', sourceLabel:'Luini', sourceUrl:'https://www.luini.it/'},
    'milan-ossa': {price:'€0*', yen:'無料目安', party:'寄付は任意', sourceLabel:'場所を確認', sourceUrl:maps('San Bernardino alle Ossa Milano')},
    'milan-super': {price:'€2–10 目安', yen:'約¥370–1,850 / 1点', party:'輸入品価格と比較', sourceLabel:'Esselunga', sourceUrl:'https://www.esselunga.it/'},
    'venice-lele': {price:'€2–8 目安', yen:'約¥370–1,480 / 人', party:'3人 約¥1,100–4,400', sourceLabel:'場所・最新メニュー', sourceUrl:maps('Bacareto da Lele Venezia')},
    'venice-acqua': {price:'€0', yen:'入店無料', party:'買い物は任意', sourceLabel:'場所を確認', sourceUrl:maps('Libreria Acqua Alta Venezia')},
    'venice-market': {price:'€4–10 目安', yen:'約¥740–1,850 / 人', party:'3人 約¥2,200–5,600', sourceLabel:'場所を確認', sourceUrl:maps('supermarket San Marco Venice')},
    'florence-fratellini': {price:'€4–8 目安', yen:'約¥740–1,480 / 人', party:'3人 約¥2,200–4,400', sourceLabel:'場所・最新メニュー', sourceUrl:maps('I Fratellini Firenze')},
    'florence-nerbone': {price:'€5–12 目安', yen:'約¥920–2,220 / 人', party:'3人 約¥2,800–6,700', sourceLabel:'場所・最新メニュー', sourceUrl:maps('Da Nerbone Firenze')},
    'florence-michelangelo': {price:'€0', yen:'無料', party:'3人 €0', sourceLabel:'場所を確認', sourceUrl:maps('Piazzale Michelangelo Firenze')},
    'rome-guerra': {price:'€5–8 目安', yen:'約¥920–1,480 / 人', party:'3人 約¥2,800–4,400', sourceLabel:'場所・最新メニュー', sourceUrl:maps('Pastificio Guerra Roma')},
    'rome-trapizzino': {price:'€5', yen:'約¥920 / 個', party:'3人 €15 ≈ ¥2,770', sourceLabel:'Trapizzino 公式', sourceUrl:'https://www.trapizzino.it/en/trapizzino/trapizzino-roma-trastevere/'},
    'rome-aventine': {price:'€0', yen:'無料', party:'3人 €0', sourceLabel:'場所を確認', sourceUrl:maps('Aventine Keyhole Orange Garden Rome')}
  };

  for (const rec of v4.recommendations || []) {
    const m = meta[rec.id];
    if (!m) continue;
    Object.assign(rec, m, {checked:'2026-08-18'});
  }

  window.SisterTripV5Budget = {EUR_JPY, CHF_JPY, meta};
})();
