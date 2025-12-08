// Main entry point for all GSAP animations
import '../styles/main.css';
import { initMaskTextScrollReveal } from './textreveal.js';
import { initContentRevealScroll } from './contentrevealscroll.js';
import { initBasicGSAPSlider } from './gsap-slider.js';
import { initAccordionCSS } from './accordion.js';
import { initSwiperSlider } from './swipeslider.js';
import { initFooterParallax } from './footer-parallax.js';
import { initFlipCounter } from './flip-counter.js';
import { initImageTrail } from './image-trail-following-cursor.js';
import { initDisplayCount } from './display-count.js';
import { initYouTubeLightbox } from './youtube-lightbox.js';
import { initLayoutGridFlip } from './layout-grid-flip.js';
// import { initDraggableInfiniteSlider } from './draggable-infinite-slider.js'; // Only loaded in demo HTML
import './youtube-player.js';

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

  // Initialize swiper slider (will only run if swiper elements exist and library is loaded)
  initSwiperSlider();

  // Initialize footer parallax effect
  initFooterParallax();

  // Initialize flip counter effect
  initFlipCounter();

  // Initialize image trail following cursor (will only run if wrapper exists)
  initImageTrail({
    minWidth: 992,
    moveDistance: 15,
    stopDuration: 350,
    trailLength: 8
  });

  // Initialize display count (will only run if count groups exist)
  initDisplayCount();

  // Initialize YouTube lightbox modal (will only run if hero lightbox exists)
  initYouTubeLightbox();

  // Initialize layout grid flip (will only run if layout groups exist)
  initLayoutGridFlip();

  // Initialize draggable infinite slider (only on demo page)
  // initDraggableInfiniteSlider();
});

// Export all animation functions for potential external access
export {
  initMaskTextScrollReveal,
  initContentRevealScroll,
  initBasicGSAPSlider,
  initAccordionCSS,
  initSwiperSlider,
  initFooterParallax,
  initFlipCounter,
  initImageTrail,
  initDisplayCount,
  initYouTubeLightbox,
  initLayoutGridFlip
  // initDraggableInfiniteSlider - only for demo page
};
