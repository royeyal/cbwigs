import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes the flip counter effect for layout485
 * Creates a flip-clock style animation where numbers change as content scrolls
 * @returns {void}
 */
export function initFlipCounter() {
  const components = document.querySelectorAll('.layout485_component');

  if (components.length === 0) return;

  components.forEach(component => {
    const contentItems = component.querySelectorAll('.layout485_content');
    const numbers = component.querySelectorAll(
      '.layout485_content-left .layout485_number-wrapper .layout485_number'
    );

    if (contentItems.length === 0 || numbers.length === 0) return;

    // Set initial state - show only first number
    gsap.set(numbers, { yPercent: 0 });

    // Create ScrollTrigger for each content item
    contentItems.forEach((content, index) => {
      ScrollTrigger.create({
        trigger: content,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => updateCounter(numbers, index),
        onEnterBack: () => updateCounter(numbers, index)
        // markers: true, // Uncomment for debugging
      });
    });
  });
}

/**
 * Updates the counter to show the current number
 * @param {NodeList} numbers - All number elements
 * @param {number} activeIndex - Index of the currently active number
 * @returns {void}
 */
function updateCounter(numbers, activeIndex) {
  numbers.forEach((number, index) => {
    if (index === activeIndex) {
      // Active number - position at 0
      gsap.to(number, {
        yPercent: 0,
        duration: 0.6,
        ease: 'power2.inOut'
      });
    } else if (index < activeIndex) {
      // Numbers before active - move up and out of view
      gsap.to(number, {
        yPercent: -100,
        duration: 0.6,
        ease: 'power2.inOut'
      });
    } else {
      // Numbers after active - keep below, out of view
      gsap.to(number, {
        yPercent: (index - activeIndex) * 100,
        duration: 0.6,
        ease: 'power2.inOut'
      });
    }
  });
}

/**
 * Cleanup function to kill all ScrollTriggers for flip counter
 * @returns {void}
 */
export function destroyFlipCounter() {
  ScrollTrigger.getAll().forEach(trigger => {
    if (
      trigger.vars.trigger &&
      trigger.vars.trigger.classList.contains('layout485_content')
    ) {
      trigger.kill();
    }
  });
}
