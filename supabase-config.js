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
    await sisterTripLoadClassic('./gmail-trip-sync.js');
    window.SisterTripApplyGmailSnapshot?.();
    await sisterTripLoadClassic('./florence-day-plan.js');
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

    // Focused post-design QA fixes. These intentionally load last so they only
    // correct viewport/sheet behavior and Japanese labels without restyling v5.
    const v7css = document.createElement('link');
    v7css.rel = 'stylesheet';
    v7css.href = './bugfix-v7.css';
    document.head.appendChild(v7css);
    await sisterTripLoadClassic('./bugfix-v7.js');
    window.SisterTripBugfixV7Install?.();

    // Build v8 adds only the requested Firenze PLAN, secure ticket vault and
    // sister onboarding refinements. It intentionally runs after the visual lock.
    const v8css = document.createElement('link');
    v8css.rel = 'stylesheet';
    v8css.href = './build-v8.css';
    document.head.appendChild(v8css);
    await sisterTripLoadClassic('./build-v8.js');
    window.SisterTripBuildV8Install?.();
  } catch (error) {
    console.error('Could not load Sister Trip enhancements', error);
  }
});
