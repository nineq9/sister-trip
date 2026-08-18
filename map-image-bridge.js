/* Prevent MAP from hiding a photo on the first network error.
   The image stability layer owns retries and fallbacks. */
(() => {
  if (typeof mapImageFallback !== 'undefined') {
    mapImageFallback = function mapImageFallbackStable(img) {
      if (!img) return;
      window.SisterTripImages?.protectImage(img);
    };
  }
})();
