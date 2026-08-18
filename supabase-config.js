window.SISTER_TRIP_CONFIG = {
  supabaseUrl: 'https://zhibvqdajwiflavqiwbd.supabase.co',
  supabaseKey: 'sb_publishable_RXzsdpeYTmd-VvONxwV7Lg_131N_Wve'
};

// Load the travel master data and map-first UI after the base app has parsed.
// Keeping these as separate layers makes it easy to update the trip without destabilizing the locked visual foundation.
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
    await sisterTripLoadClassic('./image-stability.js');
    window.SisterTripImages?.install();
    await sisterTripLoadClassic('./map-v3.js');
    await sisterTripLoadClassic('./map-image-bridge.js');
    await sisterTripLoadClassic('./shared-v2.js');
    await sisterTripLoadClassic('./discover-data.js');
    window.SisterTripV3Boot?.();
    await sisterTripLoadClassic('./features-v4.js');
    window.SisterTripFeaturesV4Install?.();
  } catch (error) {
    console.error('Could not load Sister Trip enhancements', error);
  }
});
