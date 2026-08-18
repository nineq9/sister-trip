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
    await sisterTripLoadClassic('./map-v3.js');
    window.SisterTripV3Boot?.();
  } catch (error) {
    console.error('Could not load Sister Trip v3 enhancements', error);
  }
});
