// Standalone version of draggable infinite slider for Webflow
// This file is meant to be built separately and loaded in Webflow

import { initDraggableInfiniteSlider } from './draggable-infinite-slider.js';

// Auto-initialize when the script loads (for Webflow)
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDraggableInfiniteSlider);
  } else {
    // DOM is already ready
    initDraggableInfiniteSlider();
  }

  // Also expose it globally for manual initialization
  window.initDraggableInfiniteSlider = initDraggableInfiniteSlider;
}
