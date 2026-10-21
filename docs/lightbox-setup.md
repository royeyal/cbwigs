# Gallery Lightbox

Click a gallery thumbnail to open it full-size with a GSAP Flip transition, then browse with arrows, keyboard or the counter. Supports RTL.

| | |
|---|---|
| Source | `src/js/lightbox-setup.js`, `src/styles/lightbox-setup.css` |
| Loaded by | `main.js` imports it for side effects; it runs `createLightbox()` on every `[data-gallery]` at `DOMContentLoaded` |
| Used on | The six `/events/*` pages (and `/en` versions) |
| Depends on | GSAP + Flip (Webflow globals) |

## Features

- ✅ GSAP FLIP animation for smooth image transitions
- ✅ Covers the whole page, navbar included (the wrapper is moved to `<body>`, see below)
- ✅ Page scroll locked while open
- ✅ Keyboard navigation (Arrow keys + Escape), focus moved into the dialog and kept there, then returned to the photo
- ✅ Localized accessible names on the buttons and the dialog
- ✅ Click-outside-to-close functionality
- ✅ Image counter display
- ✅ Prev/Next navigation buttons
- ✅ Full RTL (Right-to-Left) support
- ✅ Mobile layout with the nav under the image
- ✅ Configurable grid fade behavior
- ✅ Lifecycle callbacks for custom events

## Why the wrapper moves to `<body>`

Every Webflow section's `.padding-global` has `position: relative; z-index: 2`, which makes it a stacking context. A `position: fixed` wrapper inside one can't paint above anything outside that section, so the later CTA section, the footer and the navbar (`.nav`, z-index 100) covered the open lightbox. At init the script appends each `[data-lightbox="wrapper"]` to `<body>`, where its z-index (1000, from `lightbox-setup.css`) applies to the whole page.

Consequences, all handled in the script:

- Elements inside the wrapper are queried before the move, or through the wrapper, never through the `[data-gallery]` container.
- The clicked image moves into the wrapper while open, so `find()` looks for `[data-lightbox="original"]` in both the container and the wrapper.
- The click-outside listener sits on the wrapper itself, since clicks inside it no longer bubble to the container.

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

  <!-- Lightbox Wrapper (overlay); the script moves it to <body> at init -->
  <div data-lightbox="wrapper" class="lightbox-wrap" role="dialog" aria-modal="true">
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

## Configuration

`createLightbox()` is not exposed to page code; options are set in the `DOMContentLoaded` block at the bottom of `lightbox-setup.js` and apply to every gallery. Current values:

| Option | Function default | Set on the site | Effect |
|---|---|---|---|
| `fadeGridOnOpen` | `true` | `false` | `true` fades the grid items out while the lightbox is open |
| `flipBackOnClose` | `false` | `true` | `true` animates the image back into its thumbnail on close; `false` fades it out |
| `onStart`, `onOpen`, `onClose`, `onCloseComplete` | none | not set | Lifecycle callbacks |

## RTL Support

`isRTL()` checks `dir` on `<html>`, then `<body>`, then the computed `direction`. Hebrew pages have `<html dir="rtl">`.

- **Buttons are not swapped.** The nav row mirrors in RTL, so "prev" already sits on the right, which is the reading start. Each button always does what it says. (Until 2026-10 the script swapped the handlers in RTL, so the button labelled "prev" moved forward.)
- **Arrow keys follow the screen.** In RTL, Arrow Left goes to the next image and Arrow Right to the previous one.
- **Dot hover mirrors.** The dot beside prev/next slides outward, towards the edge its button sits on: left for prev in English, right in Hebrew. Defined in `lightbox-setup.css` on `[data-lightbox='prev'|'next']`.

## Accessibility

- **Button text comes from the script.** Webflow can't localize the button labels, because they are custom `<span>` elements, so the text set in the Designer (הקודם / הבא / סגירה on the Events template) is a placeholder. At init the script replaces the text of the `<span>` in each button, choosing the locale from `document.documentElement.lang`.
- The wrapper is `role="dialog" aria-modal="true"` (set in Webflow). The script also gives it and the three buttons localized `aria-label`s:

  | | Visible (HE) | Name (HE) | Visible (EN) | Name (EN) |
  |---|---|---|---|---|
  | Dialog | | גלריית תמונות | | Photo gallery |
  | Prev | הקודם | התמונה הקודמת | Previous | Previous image |
  | Next | הבא | התמונה הבאה | Next | Next image |
  | Close | סגירה | סגירה | Close | Close |

  Each name contains its visible text, so speech-input users can say what they see. An `aria-label` already set in Webflow is kept. To change a label, edit `LABELS` at the top of `lightbox-setup.js`.
- On open, focus moves to the close button once the nav has faded in. Tab and Shift+Tab cycle through the dialog's buttons. On close, focus returns to the photo that opened it.
- While open, `<html>` gets `.is-lightbox-open`, which sets `overflow: hidden` (with `scrollbar-gutter: stable`, so the page doesn't shift sideways). The class is removed as soon as closing starts, from the close button, Escape or a click outside.

## CSS Classes

### State Classes (Applied by JavaScript)

- `.is-active` - Applied to wrapper when lightbox is open
- `.is-active` - Applied to current visible image item

### CSS in Webflow

Base styles come from the Designer (as of 2026-10-21):

```css
.lightbox-wrap {
  display: none;
  position: fixed;
  inset: 0% 0% auto;
  width: 100%;
  height: 100dvh;
  z-index: 100; /* raised to 1000 by lightbox-setup.css */
  justify-content: center;
  align-items: center;
}

.lightbox-img__wrap { width: 90vw; height: calc(100svh - 10em); }

.lightbox-img__item {
  visibility: hidden;
  position: absolute;
}

.lightbox-nav { position: absolute; bottom: 2em; left: 2em; right: 2em; }
.lightbox-nav__col { width: 33.333%; } /* .start counter, .center prev/next, .end close */
```

### CSS in this repo (`lightbox-setup.css`)

- `.lightbox-wrap` gets `z-index: 1000` and `overscroll-behavior: contain`; `html.is-lightbox-open` is the scroll lock.
- `.lightbox-nav` is inset `4.5rem` from each side instead of Webflow's 2em, because the UserWay button sits in the bottom-right corner above everything. It covered the counter in Hebrew and the close button in English.
- **≤ 767px:** the wrapper becomes a flex column, the image stage (`.lightbox-img__wrap`) takes the leftover height and the nav sits in flow under it. The counter and close share one row, and prev/next get a full-width row below, centred and clear of the UserWay button. The image fills the stage width (`width: 100%; min-width: 0`); the desktop `min-width: fit-content` would hold it at its intrinsic width. Ported from the identity-underground lightbox.
- Active states, dot hover directions and reduced motion.

## Keyboard Controls

| Key           | Action         | RTL Behavior          |
| ------------- | -------------- | --------------------- |
| `Escape`      | Close lightbox | Same                  |
| `Tab` / `Shift+Tab` | Move between the dialog's buttons (wraps) | Same |
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

Clicking outside the lightbox image closes the lightbox. The listener is on the wrapper. The following elements do NOT trigger close:

- The active image itself
- The nav columns (`[data-lightbox="nav"]`) and the close button

Clicks with `event.detail === 0` (keyboard-triggered, or the arrow keys' programmatic `.click()`) are ignored.

## Browser Compatibility

Works in all modern browsers that support:

- GSAP 3.x
- GSAP Flip plugin
- ES6+ JavaScript
- CSS transforms

## Files

- **JavaScript:** `src/js/lightbox-setup.js`
- **CSS:** `src/styles/lightbox-setup.css`
- **Built output:** part of `dist/js/main.[hash].js` and `dist/css/style.[hash].css`

## Notes

- GSAP and GSAP Flip plugin must be loaded globally (already available on Webflow site)
- Multiple galleries can exist on the same page (each with `data-gallery`)
- Images are moved in the DOM during FLIP animation and restored on close
- The script maintains grid layout by fixing height during animation
- Counter automatically displays image position (e.g., "3 / 10")

## Troubleshooting

**Lightbox opens behind other sections or the navbar:**

- Check the wrapper is a direct child of `<body>` once the page has loaded. If it isn't, the script didn't run on that gallery.

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
- Expected on this site: `fadeGridOnOpen` is set to `false` (see Configuration)
- Inspect CSS for conflicting `!important` rules

**RTL not working:**

- Set `dir="rtl"` on `<html>` or `<body>` element
- Or use CSS: `html { direction: rtl; }`
- Clear browser cache after changes

**Buttons read in the wrong language:**

- The names come from `<html lang>` at load. The `/en` pages must have `lang="en-US"` (or any `en…`). Anything not starting with `he` gets English.
