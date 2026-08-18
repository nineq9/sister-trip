/* Spot image keys layered onto the trip master data.
   Kept separate from reservation/schedule data so photo curation can change without touching travel truth. */
(() => {
  if (typeof demo === 'undefined') return;

  const placeImageKeys = {
    'saint-sulpice': 'saint-sulpice',
    'saint-etienne': 'saint-etienne-du-mont',
    'petit-palais': 'petit-palais',
    'invalides': 'invalides',
    'alexandre': 'pont-alexandre-iii',
    'eiffel': 'eiffel-tower',
    'aura': 'invalides'
  };

  for (const place of demo.mapPlaces || []) {
    const imageKey = placeImageKeys[place.id];
    if (imageKey) place.imageKey = imageKey;
  }

  for (const day of Object.values(demo.dayPlans || {})) {
    for (const item of day.items || []) {
      if (!item.placeId) continue;
      const imageKey = placeImageKeys[item.placeId];
      if (imageKey) item.imageKey = imageKey;
    }
  }

  window.SisterTripSpotImageKeys = placeImageKeys;
})();
