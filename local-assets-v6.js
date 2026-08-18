/* Sister Trip v6 — local/generated editorial image overrides. */
(() => {
  const localCityAssets = {
    paris: './assets/city/paris-generated.webp',
    milano: './assets/city/milano-generated.webp'
  };

  function apply() {
    if (typeof demo === 'undefined') return;
    (demo.cities || []).forEach(city => {
      if (localCityAssets[city.id]) city.image = localCityAssets[city.id];
    });

    const heroCandidates = document.querySelectorAll('.hero-card img, .hero img, [data-hero] img');
    heroCandidates.forEach(img => {
      img.src = localCityAssets.paris;
      img.dataset.city = 'paris';
    });

    document.querySelectorAll('.story-v4-hero img[data-city]').forEach(img => {
      const local = localCityAssets[img.dataset.city];
      if (local) img.src = local;
    });
  }

  window.SisterTripLocalAssetsV6 = { localCityAssets, apply };
})();
