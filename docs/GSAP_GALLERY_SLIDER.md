# GSAP Gallery Slider Guide

## Overview

A lightweight, infinite-looping image gallery slider powered entirely by GSAP — no third-party slider library needed. One full-width slide at a time, arrow navigation + drag/swipe support, and seamless looping via cloned boundary slides.

**Why use this instead of Swiper for a gallery?**
- Zero extra bundle weight — GSAP is already loaded globally on the site
- Smooth `power3.inOut` easing out of the box
- Seamless infinite loop using clone-based approach
- Works with any element as the prev/next button

> **Note:** The Swiper slider (`data-swiper-group`) remains active for other components. This is a separate, independent slider for full-width gallery use cases.

---

## Prerequisites

GSAP and the Draggable plugin must be loaded globally **before** your main bundle. These are typically already in your Webflow **Project Settings > Custom Code > `<head>` tag**:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/Draggable.min.js"></script>
```

Your main bundle script and CSS must also be present (usually already configured):

```html
<!-- In Project Settings > Custom Code > Before </body> tag -->
<script src="https://YOUR-WORKER-URL.workers.dev/main.js"></script>
<link rel="stylesheet" href="https://YOUR-WORKER-URL.workers.dev/main.css" />
```

---

## HTML Structure

```html
<!-- Outer wrapper: sets the visible viewport -->
<div data-gallery-slider class="gallery-slider">

  <!-- Track: holds all slides in a flex row -->
  <div data-gallery-slider-track class="gallery-slider__track">

    <!-- Slide: one per image -->
    <div data-gallery-slider-slide class="gallery-slider__slide">
      <img src="image-1.jpg" alt="Gallery image 1" />
    </div>

    <div data-gallery-slider-slide class="gallery-slider__slide">
      <img src="image-2.jpg" alt="Gallery image 2" />
    </div>

    <div data-gallery-slider-slide class="gallery-slider__slide">
      <img src="image-3.jpg" alt="Gallery image 3" />
    </div>

    <!-- Add as many slides as needed (minimum 2) -->
  </div>

  <!-- Navigation buttons — can be any element, placed anywhere inside the wrapper -->
  <div data-gallery-slider-prev class="gallery-slider__btn is--prev">←</div>
  <div data-gallery-slider-next class="gallery-slider__btn is--next">→</div>

</div>
```

### Required Data Attributes

| Attribute | Element | Required |
|---|---|---|
| `data-gallery-slider` | Outer wrapper | Yes |
| `data-gallery-slider-track` | Flex track (direct parent of slides) | Yes |
| `data-gallery-slider-slide` | Each individual slide | Yes (min 2) |
| `data-gallery-slider-prev` | Previous button | No (optional) |
| `data-gallery-slider-next` | Next button | No (optional) |

---

## Building in Webflow Designer

1. **Outer wrapper** (`data-gallery-slider`)
   - Add a **Div Block**
   - Set `overflow: hidden`, `position: relative`
   - Give it a fixed or percentage height (e.g., `60vh` or `500px`) — slides will fill this
   - Add the custom attribute: `data-gallery-slider`

2. **Track** (`data-gallery-slider-track`)
   - Add a **Div Block** inside the wrapper
   - Set `display: flex`, `width: 100%`, `height: 100%`
   - Add the custom attribute: `data-gallery-slider-track`

3. **Slides** (`data-gallery-slider-slide`)
   - Add **Div Blocks** inside the track (one per image)
   - Set `width: 100%`, `flex-shrink: 0`, `height: 100%`
   - Add an **Image** element inside each slide — set `width: 100%`, `height: 100%`, `object-fit: cover`
   - Add the custom attribute to each slide div: `data-gallery-slider-slide`

4. **Navigation buttons**
   - Add two **Div Blocks** (or **Button** elements) anywhere inside the outer wrapper
   - Style them as arrow buttons and position absolutely
   - Add custom attributes: `data-gallery-slider-prev` and `data-gallery-slider-next`

---

## How It Works

- On init, the script **clones the first and last slides** and inserts them at opposite ends of the track — this enables seamless boundary transitions
- The track is a flex row; position is controlled via GSAP `x` transform
- **Next** → increments the index, animates the track left
- **Prev** → decrements the index, animates the track right
- When landing on a clone, the track is **silently repositioned** to the real equivalent slide (no visible jump)
- Drag/swipe threshold is **20% of container width** — drag past it to advance, release short of it to snap back

---

## Customization

To change animation speed or easing, edit [src/js/gsap-gallery-slider.js](../src/js/gsap-gallery-slider.js):

```js
// Arrow navigation duration & easing (line ~65)
gsap.to(track, {
  duration: 0.7,           // seconds — increase for slower, decrease for faster
  ease: 'power3.inOut',    // try 'expo.inOut', 'back.out(1.2)', 'power2.inOut'
  ...
});

// Drag-release snap duration (line ~92)
goTo(currentIndex, 0.5);   // second argument overrides duration
```

**Common easing options:**
| Ease | Feel |
|---|---|
| `power3.inOut` | Default — smooth acceleration and deceleration |
| `expo.inOut` | More dramatic — slow start, fast middle, slow end |
| `power2.out` | Quick start, gentle landing |
| `back.out(1.2)` | Slight overshoot on arrival |

---

## Multiple Sliders

The script automatically initializes **every** `[data-gallery-slider]` on the page. Each instance is fully independent. Just repeat the HTML structure with the same data attributes.

---

## Interaction Summary

| Interaction | Behavior |
|---|---|
| Click next arrow | Advance one slide |
| Click prev arrow | Go back one slide |
| Drag / swipe > 20% width | Advance or go back one slide |
| Drag / swipe < 20% width | Snap back to current slide |
| Last slide → next | Loops to first slide (seamless) |
| First slide → prev | Loops to last slide (seamless) |
