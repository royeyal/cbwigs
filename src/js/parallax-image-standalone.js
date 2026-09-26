// Standalone version of the parallax image effect for Webflow pages that don't load main.js
// Built separately (vite build --mode standalone) and served via /parallax-image.js

import {
  initParallaxImages,
  refreshParallaxImages,
  destroyParallaxImages
} from './parallax-image.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParallaxImages);
} else {
  initParallaxImages();
}

// Expose for manual control (e.g. after loading content dynamically)
window.initParallaxImages = initParallaxImages;
window.refreshParallaxImages = refreshParallaxImages;
window.destroyParallaxImages = destroyParallaxImages;
