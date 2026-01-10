/**
 * Parallax Image Effect
 * Creates a smooth parallax scrolling effect on images within cards
 * Triggered by data-parallax-image attribute
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize parallax effect on all elements with data-parallax-image attribute
 */
export function initParallaxImages() {
  console.log('[Parallax Image] Initializing...');

  // Select all elements with the data-parallax-image attribute
  const parallaxContainers = document.querySelectorAll('[data-parallax-image]');

  if (parallaxContainers.length === 0) {
    console.log(
      '[Parallax Image] No elements found with data-parallax-image attribute'
    );
    return;
  }

  console.log(
    `[Parallax Image] Found ${parallaxContainers.length} element(s) with data-parallax-image`
  );

  parallaxContainers.forEach(container => {
    // Find the image within the container
    const image = container.querySelector('.card__img');

    if (!image) {
      console.warn('Parallax Image: No .card__img found within', container);
      return;
    }

    // Get custom speed from attribute (default: 30)
    const speed = container.getAttribute('data-parallax-speed') || '30';
    const parallaxSpeed = parseInt(speed, 10);

    // Get direction from attribute (default: down)
    const direction =
      container.getAttribute('data-parallax-direction') || 'down';
    const yStart = direction === 'up' ? parallaxSpeed : -parallaxSpeed;
    const yEnd = direction === 'up' ? -parallaxSpeed : parallaxSpeed;

    // Create the parallax animation
    gsap.fromTo(
      image,
      {
        y: yStart,
        scale: 1.2 // Scale up to allow movement without showing edges
      },
      {
        y: yEnd,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom', // When top of container hits bottom of viewport
          end: 'bottom top', // When bottom of container hits top of viewport
          scrub: true, // Smooth scrubbing
          invalidateOnRefresh: true // Recalculate on window resize
        }
      }
    );

    console.log(
      `[Parallax Image] ✓ Initialized parallax on image (speed: ${parallaxSpeed}, direction: ${direction})`
    );
  });

  console.log(
    `[Parallax Image] ✓ All ${parallaxContainers.length} instance(s) created successfully`
  );
}

/**
 * Refresh ScrollTrigger instances
 * Call this after dynamic content loads
 */
export function refreshParallaxImages() {
  console.log('[Parallax Image] Refreshing ScrollTrigger instances...');
  ScrollTrigger.refresh();
}

/**
 * Destroy all parallax ScrollTrigger instances
 */
export function destroyParallaxImages() {
  console.log('[Parallax Image] Destroying parallax instances...');
  let count = 0;
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.trigger?.hasAttribute('data-parallax-image')) {
      trigger.kill();
      count++;
    }
  });
  console.log(`[Parallax Image] ✓ Destroyed ${count} instance(s)`);
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParallaxImages);
} else {
  initParallaxImages();
}
