# Lightbox Setup Documentation

## Overview

The lightbox component provides an elegant image gallery viewer with smooth GSAP animations, FLIP transitions, and full RTL support. It allows users to click gallery thumbnails to view full-size images in a modal overlay with navigation controls.

## Features

- ✅ GSAP FLIP animation for smooth image transitions
- ✅ Keyboard navigation (Arrow keys + Escape)
- ✅ Click-outside-to-close functionality
- ✅ Image counter display
- ✅ Prev/Next navigation buttons
- ✅ Full RTL (Right-to-Left) support
- ✅ Configurable grid fade behavior
- ✅ Lifecycle callbacks for custom events

## Setup in Webflow

### Required HTML Structure

The lightbox requires specific data attributes on your gallery elements:

```html
<!-- Gallery Container -->
<div data-gallery>
  <!-- Grid Items (that get faded out) -->
  <div data-lightbox="trigger-parent">
    <!-- Clickable Trigger -->
    <div data-lightbox="trigger">
      <img src="thumbnail.jpg" alt="Gallery image" />
    </div>
  </div>

  <!-- Lightbox Wrapper (overlay) -->
  <div data-lightbox="wrapper" class="lightbox-wrap">
    <!-- Lightbox Items (full-size images) -->
    <div data-lightbox="item" class="lightbox-img__item">
      <img src="full-size-1.jpg" alt="Image 1" />
    </div>
    <div data-lightbox="item" class="lightbox-img__item">
      <img src="full-size-2.jpg" alt="Image 2" />
    </div>

    <!-- Navigation Elements -->
    <div data-lightbox="nav">
      <button data-lightbox="prev" class="lightbox-nav__button">
        <div class="lightbox-nav__dot"></div>
        Previous
      </button>
      <button data-lightbox="next" class="lightbox-nav__button">
        <div class="lightbox-nav__dot"></div>
        Next
      </button>
      <button data-lightbox="close">Close</button>
    </div>

    <!-- Optional: Counter Display -->
    <div data-lightbox="nav">
      <span data-lightbox="counter-current">1</span>
      /
      <span data-lightbox="counter-total">5</span>
    </div>
  </div>
</div>
```

### Data Attributes Reference

| Attribute                         | Element            | Purpose                                                |
| --------------------------------- | ------------------ | ------------------------------------------------------ |
| `data-gallery`                    | Container          | Main gallery wrapper that groups all lightbox elements |
| `data-lightbox="trigger-parent"`  | Grid item wrapper  | Elements that fade out when lightbox opens             |
| `data-lightbox="trigger"`         | Clickable element  | Triggers lightbox on click                             |
| `data-lightbox="wrapper"`         | Overlay div        | Full-screen lightbox container with dark background    |
| `data-lightbox="item"`            | Image container    | Full-size image containers in lightbox                 |
| `data-lightbox="nav"`             | Navigation wrapper | Contains navigation buttons                            |
| `data-lightbox="prev"`            | Button             | Previous image button                                  |
| `data-lightbox="next"`            | Button             | Next image button                                      |
| `data-lightbox="close"`           | Button             | Close lightbox button                                  |
| `data-lightbox="counter-current"` | Span               | Displays current image number                          |
| `data-lightbox="counter-total"`   | Span               | Displays total image count                             |

## Configuration Options

### Basic Initialization

```javascript
// Automatic initialization (default behavior)
// This runs on DOMContentLoaded for all [data-gallery] elements
```

### Advanced Configuration

```javascript
const galleryElement = document.querySelector('[data-gallery]');

createLightbox(galleryElement, {
  // Callbacks
  onStart: () => {
    console.log('Lightbox opening animation started');
  },
  onOpen: () => {
    console.log('Lightbox fully opened');
  },
  onClose: () => {
    console.log('Lightbox closing animation started');
  },
  onCloseComplete: () => {
    console.log('Lightbox fully closed');
  },

  // Grid fade behavior
  fadeGridOnOpen: true // Default: true
});
```

### Configuration Parameters

#### `fadeGridOnOpen` (boolean, default: `true`)

Controls whether gallery grid items fade out when the lightbox opens.

**When `true` (default):**

- Gallery grid items fade to `opacity: 0` and `visibility: hidden`
- Creates focus on the opened lightbox image
- Background grid is hidden during lightbox viewing
- Grid items fade back in when lightbox closes

**When `false`:**

- Gallery grid items remain visible behind the lightbox
- Useful if you want to show the grid context
- Grid items do not animate on open/close

**Example:**

```javascript
// Keep grid visible
createLightbox(gallery, {
  fadeGridOnOpen: false
});

// Fade grid (default behavior)
createLightbox(gallery, {
  fadeGridOnOpen: true
});
```

## RTL Support

The lightbox automatically detects and adapts to RTL (Right-to-Left) layouts:

### Automatic Detection

- Checks `<html dir="rtl">` attribute
- Checks `<body dir="rtl">` attribute
- Checks CSS `direction: rtl` property

### RTL Adaptations

1. **Navigation buttons swap behavior**
   - In RTL: Left button = Next, Right button = Previous
   - Maintains intuitive user experience

2. **Keyboard controls swap**
   - Arrow Right = Previous in RTL
   - Arrow Left = Next in RTL

3. **CSS hover effects mirror**
   - Button hover animations flip for RTL
   - Defined in `lightbox-setup.css`

## CSS Classes

### State Classes (Applied by JavaScript)

- `.is-active` - Applied to wrapper when lightbox is open
- `.is-active` - Applied to current visible image item

### CSS Structure in Webflow

The following CSS should be set in Webflow Designer:

```css
/* Lightbox wrapper should be hidden by default */
.lightbox-wrap {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  justify-content: center;
  align-items: center;
}

/* Lightbox items hidden by default */
.lightbox-img__item {
  visibility: hidden;
  position: absolute;
}
```

The `lightbox-setup.css` file provides additional styles for active states and RTL support.

## Keyboard Controls

| Key           | Action         | RTL Behavior          |
| ------------- | -------------- | --------------------- |
| `Escape`      | Close lightbox | Same                  |
| `Arrow Right` | Next image     | Previous image in RTL |
| `Arrow Left`  | Previous image | Next image in RTL     |

## Animation Details

### Opening Animation

1. Grid items fade out (if `fadeGridOnOpen: true`)
2. Clicked image FLIP animates from thumbnail to lightbox position
3. Background overlay fades to `rgba(0,0,0,0.75)`
4. Navigation elements fade in from bottom (staggered from center)

### Closing Animation

1. Navigation elements fade out with upward motion
2. Background overlay fades to transparent
3. Active lightbox image fades out
4. Original image FLIP animates back to thumbnail position
5. Grid items fade back in (if `fadeGridOnOpen: true`)

### GSAP Settings

- Default ease: `power4.inOut`
- Default duration: `0.8s`
- Smooth animations with proper cleanup

## Click-Outside Behavior

Clicking outside the lightbox image closes the lightbox. The following elements do NOT trigger close:

- The active image itself
- Navigation buttons
- Close button
- Trigger elements

## Browser Compatibility

Works in all modern browsers that support:

- GSAP 3.x
- GSAP Flip plugin
- ES6+ JavaScript
- CSS transforms

## Files

- **JavaScript:** `src/js/lightbox-setup.js`
- **CSS:** `src/styles/lightbox-setup.css`
- **Built Output:** Included in `dist/js/main.[hash].js` and `dist/css/main.[hash].css`

## Notes

- GSAP and GSAP Flip plugin must be loaded globally (already available on Webflow site)
- Multiple galleries can exist on the same page (each with `data-gallery`)
- Images are moved in the DOM during FLIP animation and restored on close
- The script maintains grid layout by fixing height during animation
- Counter automatically displays image position (e.g., "3 / 10")

## Troubleshooting

**Lightbox doesn't open:**

- Verify all required data attributes are present
- Check that GSAP and Flip are loaded globally
- Check console for JavaScript errors

**Images don't animate smoothly:**

- Ensure images have proper dimensions set
- Check that parent containers don't have conflicting transforms
- Verify GSAP Flip plugin is loaded

**Grid doesn't fade out:**

- Verify `data-lightbox="trigger-parent"` is on grid items
- Check if `fadeGridOnOpen: false` was set
- Inspect CSS for conflicting `!important` rules

**RTL not working:**

- Set `dir="rtl"` on `<html>` or `<body>` element
- Or use CSS: `html { direction: rtl; }`
- Clear browser cache after changes
