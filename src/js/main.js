// Main entry point for all GSAP animations
import '../styles/main.css';
import { initMaskTextScrollReveal } from './textreveal.js';
import { initContentRevealScroll } from './contentrevealscroll.js';
import { initBasicGSAPSlider } from './gsap-slider.js';
import { initAccordionCSS } from './accordion.js';

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
});

// Export all animation functions for potential external access
export {
  initMaskTextScrollReveal,
  initContentRevealScroll,
  initBasicGSAPSlider,
  initAccordionCSS
};
