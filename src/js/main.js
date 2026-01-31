// Main entry point for all GSAP animations
import '../styles/main.css';
import { initMaskTextScrollReveal } from './textreveal.js';
import { initContentRevealScroll } from './contentrevealscroll.js';
import { initBasicGSAPSlider } from './gsap-slider.js';
import { initAccordionCSS } from './accordion.js';
import { initLeadingZero } from './leading-zero.js';
import { initSwiperSlider } from './swipeslider.js';
import { initFlipCounter } from './flip-counter.js';
import { initImageTrail } from './image-trail-following-cursor.js';
import { initYouTubeLightbox } from './youtube-lightbox.js';
import { initLayoutGridFlip } from './layout-grid-flip.js';
import { initCopyEmailClipboard } from './copy-email-to-clipboard-button.js';
import { initNavigation } from './multilevel-navigation.js';
import { initParallaxImages } from './parallax-image.js';
// import { initDraggableInfiniteSlider } from './draggable-infinite-slider.js'; // Disabled - use standalone version if needed
import './youtube-player.js';
import './lightbox-setup.js';
import './locale-switch.js';

// Initialize all animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize text reveal animations
  initMaskTextScrollReveal();

  // Initialize content reveal scroll animations
  initContentRevealScroll();

  // Initialize basic GSAP slider
  initBasicGSAPSlider();

  // Initialize accordion functionality
  initAccordionCSS();

  // Initialize leading zero formatter for accordion counts (will only run if count elements exist)
  initLeadingZero();

  // Initialize swiper slider (will only run if swiper elements exist and library is loaded)
  initSwiperSlider();

  // Initialize flip counter effect
  initFlipCounter();

  // Initialize image trail following cursor (will only run if wrapper exists)
  initImageTrail({
    minWidth: 992,
    moveDistance: 15,
    stopDuration: 350,
    trailLength: 8
  });

  // Initialize YouTube lightbox modal (will only run if hero lightbox exists)
  initYouTubeLightbox();

  // Initialize layout grid flip (will only run if layout groups exist)
  initLayoutGridFlip();

  // Initialize copy email to clipboard button (will only run if buttons exist)
  initCopyEmailClipboard();

  // Initialize multilevel navigation (will only run if navigation exists)
  initNavigation();

  // Initialize parallax image effect (will only run if data-parallax-image exists)
  initParallaxImages();

  // Initialize draggable infinite slider - DISABLED (use standalone version if needed)
  // initDraggableInfiniteSlider();
});

// Export all animation functions for potential external access
export {
  initMaskTextScrollReveal,
  initContentRevealScroll,
  initBasicGSAPSlider,
  initAccordionCSS,
  initLeadingZero,
  initSwiperSlider,
  initFlipCounter,
  initImageTrail,
  initYouTubeLightbox,
  initLayoutGridFlip,
  initCopyEmailClipboard,
  initNavigation,
  initParallaxImages
  // initDraggableInfiniteSlider - use standalone version
};
