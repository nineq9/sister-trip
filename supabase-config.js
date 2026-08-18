window.SISTER_TRIP_CONFIG = {
  supabaseUrl: 'https://zhibvqdajwiflavqiwbd.supabase.co',
  supabaseKey: 'sb_publishable_RXzsdpeYTmd-VvONxwV7Lg_131N_Wve'
};

// Load the travel master data and progressively enhanced UI after the base app has parsed.
function sisterTripLoadClassic(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await sisterTripLoadClassic('./trip-data.js');
    await sisterTripLoadClassic('./trip-data-imagekeys.js');
    await sisterTripLoadClassic('./local-assets-v6.js');
    window.SisterTripLocalAssetsV6?.apply();
    await sisterTripLoadClassic('./image-stability.js');
    window.SisterTripImages?.install();
    await sisterTripLoadClassic('./map-v3.js');
    await sisterTripLoadClassic('./map-image-bridge.js');
    await sisterTripLoadClassic('./shared-v2.js');
    await sisterTripLoadClassic('./discover-data.js');
    await sisterTripLoadClassic('./editorial-v5-data.js');
    await sisterTripLoadClassic('./reservation-truth-v4.js');
    window.SisterTripV3Boot?.();
    await sisterTripLoadClassic('./features-v4.js');
    window.SisterTripFeaturesV4Install?.();
    await sisterTripLoadClassic('./reservation-warning-v4.js');
    window.SisterTripReservationWarningsV4Install?.();
    await sisterTripLoadClassic('./editorial-v5.js');
    window.SisterTripEditorialV5Install?.();
    window.SisterTripLocalAssetsV6?.apply();
  } catch (error) {
    console.error('Could not load Sister Trip enhancements', error);
  }
});
