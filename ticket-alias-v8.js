/* Sister Trip v8 — public-safe reservation title aliases only. */
(() => {
  const details = window.SisterTripV4Data?.reservationDetails;
  if (!Array.isArray(details)) return;

  const aliases = [
    ['Paris → Zürich', 'パリ → チューリッヒ']
  ];

  for (const [sourceMatch, aliasMatch] of aliases) {
    if (details.some(item => item.match === aliasMatch)) continue;
    const source = details.find(item => item.match === sourceMatch);
    if (source) details.push({...source, match: aliasMatch});
  }
})();
