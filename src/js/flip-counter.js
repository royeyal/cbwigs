// Use global GSAP from Webflow (no imports needed)
// Expects window.gsap and window.ScrollTrigger to be loaded by Webflow

/**
 * Initializes the flip counter effect for layout485
 * Creates a flip-clock style animation where numbers change as content scrolls
 * @returns {void}
 */
export function initFlipCounter() {
  // Check if GSAP is available globally
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn(
      '⚠️ GSAP or ScrollTrigger not found. Make sure they are loaded in Webflow.'
    );
    return;
  }

  // Register plugin (safe to call multiple times)
  gsap.registerPlugin(ScrollTrigger);

  const components = document.querySelectorAll('.layout485_component');

  if (components.length === 0) return;

  components.forEach(component => {
    const contentItems = component.querySelectorAll('.layout485_content');

    if (contentItems.length === 0) return;

    // Find or create the number wrapper
    const contentLeft = component.querySelector('.layout485_content-left');
    let numberWrapper = component.querySelector('.layout485_number-wrapper');

    if (!contentLeft) {
      console.warn('⚠️ .layout485_content-left not found in component');
      return;
    }

    if (!numberWrapper) {
      // Create the wrapper if it doesn't exist
      numberWrapper = document.createElement('div');
      numberWrapper.className = 'layout485_number-wrapper';
      contentLeft.appendChild(numberWrapper);
    }

    // Clear existing numbers in the wrapper
    numberWrapper.innerHTML = '';

    // Create number divs dynamically based on content count
    const numberDivs = [];
    for (let i = 1; i <= contentItems.length; i++) {
      const numberDiv = document.createElement('div');
      numberDiv.className = 'layout485_number';
      numberDiv.textContent = i;
      numberWrapper.appendChild(numberDiv);
      numberDivs.push(numberDiv);
    }

    const numbers = numberDivs;

    if (numbers.length === 0) return;

    // Set initial state - first number visible, rest positioned below
    numbers.forEach((number, index) => {
      if (index === 0) {
        // First number visible at position 0
        gsap.set(number, { yPercent: 0 });
      } else {
        // Other numbers stacked below, out of view
        gsap.set(number, { yPercent: index * 100 });
      }
    });

    // Create ScrollTrigger for each content item
    contentItems.forEach((content, index) => {
      ScrollTrigger.create({
        trigger: content,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => updateCounter(numbers, index),
        onEnterBack: () => updateCounter(numbers, index),
        markers: true // Uncomment for debugging
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

// Refresh ScrollTrigger on page load to handle reloads mid-scroll
window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});
