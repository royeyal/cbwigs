# Draggable Infinite Slider - Webflow Integration

## Overview
The draggable infinite slider creates a smooth, draggable carousel with infinite looping and momentum-based scrolling.

## Webflow Setup

### 1. Load GSAP Libraries (in Head or Before `</body>`)
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/Draggable.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/InertiaPlugin.min.js"></script>
```

### 2. Load the Slider Script (After GSAP)
```html
<script src="https://cbwigs-assets.roy-eyal.workers.dev/draggable-slider.js"></script>
```

**Note:** The worker automatically redirects to the latest hashed version.

The script will auto-initialize when the page loads.

### 3. Required HTML Structure

The slider looks for elements with specific `data-slider` attributes:

```html
<div data-slider="container">
  <div data-slider="list" class="slider-list">
    <div data-slider="slide" class="slider-slide">
      <!-- Slide content -->
    </div>
    <div data-slider="slide" class="slider-slide">
      <!-- Slide content -->
    </div>
    <!-- More slides... -->
  </div>
</div>
```

### 4. Optional Navigation Elements

Add these elements anywhere in your page:

```html
<!-- Previous button -->
<button data-slider="button-prev">Previous</button>

<!-- Next button -->
<button data-slider="button-next">Next</button>

<!-- Slide counter - shows current slide number -->
<div data-slide-count="step">01</div>

<!-- Total slides counter -->
<div data-slide-count="total">04</div>
```

## Data Attributes

| Attribute | Element | Description |
|-----------|---------|-------------|
| `data-slider="container"` | Wrapper div | Main container for the slider |
| `data-slider="list"` | Slider track | The element that will be animated/dragged |
| `data-slider="slide"` | Slide items | Individual slides (must be direct children of list) |
| `data-slider="button-prev"` | Button | Previous slide button |
| `data-slider="button-next"` | Button | Next slide button |
| `data-slide-count="step"` | Any element | Shows current slide index (auto-updates) |
| `data-slide-count="total"` | Any element | Shows total number of slides |

## CSS Classes

The slider automatically adds these classes:

- `.active` - Added to the current slide in view
- You'll need to style `.slider-list`, `.slider-slide`, etc.

## Configuration

The slider is configured in the JavaScript. Default settings:

```javascript
{
  draggable: true,        // Enable drag functionality
  center: false,          // Center slides or align to start
  pixelsPerSecond: 100,   // Animation speed
  snap: true,             // Snap to slides
  paddingRight: 0,        // Right padding
  onChange: (currentSlide, index) => {
    // Callback when slide changes
  }
}
```

## Manual Initialization

If you need to manually initialize (instead of auto-init):

```javascript
// The function is exposed globally
window.initDraggableInfiniteSlider();
```

## CSS Imports

The slider requires CSS. Either:

1. **Import in Webflow** (recommended):
   - Copy styles from `src/styles/draggable-infinite-slider.css`
   - Paste into Webflow's custom CSS

2. **Or load the CSS file**:
   ```html
   <link rel="stylesheet" href="https://cbwigs-assets.roy-eyal.workers.dev/main.css">
   ```

## Example Webflow Setup

Complete example in custom code section (Before `</body>`):

```html
<!-- GSAP Core + Plugins -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/Draggable.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/InertiaPlugin.min.js"></script>

<!-- Draggable Slider -->
<script src="https://cbwigs-assets.roy-eyal.workers.dev/draggable-slider.[hash].js"></script>
```

Replace `[hash]` with the actual hash from the build output.

## Troubleshooting

### Slider doesn't initialize
- Make sure GSAP libraries load before the slider script
- Check browser console for errors
- Verify `data-slider` attributes are correct

### Dragging doesn't work
- Ensure Draggable.min.js and InertiaPlugin.min.js are loaded
- Check that slides are direct children of the list element

### Slides don't snap
- Verify slide widths are set correctly in CSS
- Check that slides have `display: inline-block` or `flex`

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6 support
- Falls back gracefully if GSAP plugins aren't available

## Performance Tips

1. Limit the number of slides for best performance
2. Use `will-change: transform` on `.slider-list` for smoother animations
3. Optimize images in slides (use WebP, lazy loading)
4. Consider using `contain: layout` on slides

## Notes

- The slider creates an infinite loop by cloning slides
- Works with both mouse and touch inputs
- Momentum scrolling requires InertiaPlugin (GSAP Club membership)
- Without InertiaPlugin, slider still works but without momentum
