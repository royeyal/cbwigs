// Main entry point for all GSAP animations
import '../styles/main.css';
import { initMaskTextScrollReveal } from './textreveal.js';
import { initContentRevealScroll } from './contentrevealscroll.js';
import { initBasicGSAPSlider } from './gsap-slider.js';
import { initAccordionCSS } from './accordion.js';
import { initSwiperSlider } from './swipeslider.js';
import { initFooterParallax } from './footer-parallax.js';
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
});

// Export all animation functions for potential external access
export {
  initMaskTextScrollReveal,
  initContentRevealScroll,
  initBasicGSAPSlider,
  initAccordionCSS,
  initSwiperSlider,
  initFooterParallax
};
