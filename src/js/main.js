// Main entry point for all GSAP animations
import '../styles/main.css';
import { initMaskTextScrollReveal } from './textreveal.js';

// Initialize all animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize text reveal animations
  initMaskTextScrollReveal();

  // Add other animation initializations here as you create them
  // Example:
  // initScrollAnimations();
  // initHoverInteractions();
});

// Export all animation functions for potential external access
export { initMaskTextScrollReveal };
