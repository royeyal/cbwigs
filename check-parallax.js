// Quick test to verify the parallax script loads and finds elements
console.log('=== Parallax Image Script Check ===');
console.log('GSAP loaded:', typeof gsap !== 'undefined');
console.log('ScrollTrigger loaded:', typeof ScrollTrigger !== 'undefined');

// Check for elements with data-parallax-image
const parallaxElements = document.querySelectorAll('[data-parallax-image]');
console.log('Elements with data-parallax-image:', parallaxElements.length);

// Check each element
parallaxElements.forEach((el, index) => {
  const img = el.querySelector('.card__img');
  const speed = el.getAttribute('data-parallax-speed') || '30';
  const direction = el.getAttribute('data-parallax-direction') || 'down';
  console.log(`Card ${index + 1}:`, {
    hasImage: !!img,
    speed: speed,
    direction: direction
  });
});

// Check if ScrollTrigger instances were created
setTimeout(() => {
  const triggers = ScrollTrigger.getAll();
  console.log('ScrollTrigger instances created:', triggers.length);
  console.log('Expected instances:', parallaxElements.length);
  console.log('Match:', triggers.length === parallaxElements.length ? '✓ PASS' : '✗ FAIL');
}, 500);
