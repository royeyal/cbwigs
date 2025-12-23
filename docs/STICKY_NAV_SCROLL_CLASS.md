# Sticky Navigation Scroll Class

## Overview
The multilevel navigation script includes a sticky navigation scroll detection feature that automatically adds and removes a CSS class based on the page scroll position. This is useful for styling changes when the navigation becomes "sticky" or when the user scrolls down the page.

## Implementation

### JavaScript Function

The `initStickyNavScroll()` function is called once when the navigation initializes:

```javascript
function initStickyNavScroll() {
  // Check if GSAP and ScrollTrigger are available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('⚠️ GSAP or ScrollTrigger not found for sticky nav scroll effect');
    return;
  }

  const nav = document.querySelector('.nav');
  if (!nav) return;

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Create ScrollTrigger to add/remove class based on scroll position
  ScrollTrigger.create({
    start: 'top -50', // Trigger after scrolling 50px down
    end: 99999,
    toggleClass: { className: 'is-scrolled', targets: '.nav' },
    // markers: true, // Uncomment for debugging
  });
}
```

### How It Works

1. **Initialization**: The function is called once during navigation setup (controlled by a flag to prevent multiple initializations on resize)

2. **GSAP Dependency Check**: Verifies that GSAP and ScrollTrigger are available before proceeding

3. **Target Element**: Finds the `.nav` element to apply the class to

4. **ScrollTrigger Configuration**:
   - **start**: `'top -50'` - Triggers when the viewport has scrolled 50px down from the top
   - **end**: `99999` - Effectively infinite, so the class persists while scrolling down
   - **toggleClass**: Automatically adds `.is-scrolled` when scrolling past the start point, and removes it when scrolling back above it

### Class Name

The script uses `.is-scrolled` which is a common BEM-style state modifier widely used in the web development community for sticky navigation implementations.

## CSS Usage

You can now style the navigation differently when scrolled:

```css
/* Default navigation styles */
.nav {
  background-color: transparent;
  transition: background-color 0.3s ease;
}

/* Scrolled state */
.nav.is-scrolled {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
```

## Configuration

### Adjusting Scroll Threshold

To change when the class is applied, modify the `start` value:

```javascript
start: 'top -100', // Trigger after 100px scroll
start: 'top -20',  // Trigger after 20px scroll
```

### Debugging

Uncomment the `markers: true` line to see visual indicators of when the ScrollTrigger activates:

```javascript
ScrollTrigger.create({
  start: 'top -50',
  end: 99999,
  toggleClass: { className: 'is-scrolled', targets: '.nav' },
  markers: true, // Shows visual debugging markers
});
```

## Dependencies

- **GSAP**: Core animation library
- **ScrollTrigger**: GSAP plugin for scroll-based animations

Make sure both are loaded before the navigation script:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

## Best Practices

1. **Performance**: ScrollTrigger is highly optimized and uses native browser APIs for excellent performance

2. **Accessibility**: The class addition doesn't affect keyboard navigation or screen readers

3. **Responsive**: Works on both mobile and desktop without additional configuration

4. **Single Initialization**: The function only runs once per page load, even if the navigation reinitializes on resize

## Common Use Cases

- Changing navigation background color when scrolled
- Adding shadow or border to create depth
- Adjusting logo size or visibility
- Modifying text color for better contrast
- Animating navigation height changes
