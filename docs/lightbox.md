# Gallery Lightbox

Hovering over a gallery photo shows a zoom badge and zooms the photo slightly inside its frame. A click grows the photo from its thumbnail to fill the screen, uncropped. Browse with buttons, arrow keys or a swipe; close with a click, Escape or by scrolling. Supports RTL.

| | |
|---|---|
| Source | `src/js/lightbox.js`, `src/styles/lightbox.css` |
| Loaded by | `main.js` calls `initLightbox()` at `DOMContentLoaded` |
| Used on | The six `/events/*` pages (and `/en` versions) |
| Depends on | GSAP (Webflow global). No Flip. |

Adapted in 2026-11 from the dorongiatmusic theme's lightbox (Osmo's "Click to Zoom", Basic) and its gallery's hover hint. It replaced `lightbox-setup.js`, a GSAP Flip lightbox built from a second, hidden Collection List of the same photos.

## Setup in Webflow

Nothing new. The script uses the Events template's existing markup:

```html
<div data-gallery>
  <!-- Collection List of the event's photos -->
  <div data-lightbox="trigger-parent">
    <button data-lightbox="trigger" class="gallery-item__button">
      <img class="card__img is-3-2" src="…" alt="…" />
    </button>
  </div>
  …
</div>
```

- Each `[data-gallery]` is one gallery: next and previous move through its triggers, in page order.
- Each `[data-lightbox="trigger"]` is a button with one image in it. A trigger without an image is skipped.
- The script creates the overlay (a `<dialog>` at the end of `<body>`), so the Designer has none.

### Left over from the old lightbox

The old script needed a full-screen wrapper in the Designer: `[data-lightbox="wrapper"]` (`.lightbox-wrap`), holding a second Collection List of the same photos (`.lightbox-img__wrap`) and the nav (`.lightbox-nav`). It is hidden (`display: none` from Webflow) and nothing uses it any more. Delete it from the Events template and publish. The photos in it are lazy and never shown, so the browser doesn't download them, but the list counts towards the page's Collection List limit.

## How it works

### The zoom hint

At init each trigger gets a `<span class="zoom-badge">` with Lucide's "maximize-2" icon.

- **Hover or keyboard focus** (on devices that can hover): the badge fades and scales in at the top corner on the inline end (top-left in Hebrew, top-right in English). The photo scales to 1.05 inside the button, which Webflow gives `overflow: hidden` and rounded corners.
- **Touch screens** (`hover: none`) show the badge all the time, a little smaller.
- **Click:** the button presses to 0.98.
- Webflow's own hover (a deeper drop-shadow on `.gallery-grid__item`) and focus ring (on `.gallery-item__button`) stay.

### Opening and closing

The overlay is a native `<dialog>` opened with `showModal()`:

- It sits in the browser's top layer, above the navbar and the UserWay button, with no z-index. (The old lightbox had to move its wrapper to `<body>` and inset its nav to stay clear of UserWay.)
- The page behind is inert, focus stays inside, and Escape is handled.
- On close, focus returns to the thumbnail of the photo last shown.

The zoomed photo is a copy of the thumbnail's `<img>`, sized to the largest box with the photo's own proportions that fits inside the dialog's padding (4.5rem; 1rem at the sides on phones, with 4.5rem above and below for the buttons).

The thumbnails are cropped to 3:2 (`object-fit: cover`) and many photos aren't, so a plain FLIP between the two boxes would stretch the photo. Instead the copy starts scaled uniformly to cover the thumbnail's frame and clipped to it (`clip-path: inset(… round …)`, including its corner radius), then both animate to rest. The crop opens up while the photo grows. Closing runs the same in reverse and follows the thumbnail if the page scrolls meanwhile. If the thumbnail is off screen (after next/previous), the photo fades out instead.

**Closes on:** a click anywhere except the buttons (the photo included), Escape, the close button, or scrolling the page. The page isn't scroll-locked; scrolling closes it.

### Next and previous

- Buttons at the sides (at the bottom corners on phones), with a counter ("3 / 8") at the bottom. With one photo they are hidden.
- Arrow keys follow the screen: in Hebrew, Arrow Left is next.
- A sideways swipe of at least 40px: in Hebrew, swiping right brings the next photo in from the left.
- A lazy thumbnail that hasn't loaded yet is loaded first, then shown.

## Accessibility

- Each trigger is named "`הגדלת התמונה: <alt>`" (English: "`Enlarge image: <alt>`"). An `aria-label` set in Webflow is kept.
- The dialog and its buttons have localized names; the language comes from `document.documentElement.lang` (`startsWith('he')`, anything else is English). To change one, edit `LABELS` at the top of `lightbox.js`.

  | | Hebrew | English |
  |---|---|---|
  | Dialog | גלריית תמונות | Photo gallery |
  | Previous | התמונה הקודמת | Previous image |
  | Next | התמונה הבאה | Next image |
  | Close | סגירה | Close |

- The buttons are icons only (chevrons and ×); the names are their `aria-label`s.
- The counter is a polite live region.
- On open, focus goes to the dialog itself rather than its first button, so the key that opened it can't press that button on key-up. Tab then moves through the close, previous and next buttons.
- With `prefers-reduced-motion: reduce`, every animation runs in zero time, and the thumbnail zoom and press are off.

## Keyboard

| Key | Action |
|---|---|
| `Enter` / `Space` on a photo | Open |
| `Escape` | Close |
| `Tab` / `Shift+Tab` | Move between the dialog's buttons |
| `Arrow Left` / `Arrow Right` | Next / previous in Hebrew; previous / next in English |

## Classes

All created by the script; styled in `lightbox.css`. The `zoom-` prefix keeps clear of the Designer's `.lightbox-*` and `.gallery*` classes.

| Class | Element |
|---|---|
| `.zoom-badge` | The hint badge inside each trigger |
| `dialog.zoom-lightbox` | The overlay |
| `.zoom-lightbox_image` | The zoomed photo (a new one per photo shown) |
| `.zoom-lightbox_close`, `_prev`, `_next` | Round buttons, white on dark, white focus ring |
| `.zoom-lightbox_counter` | "3 / 8" |

The dialog's buttons are found by `data-action="close|prev|next"`, not `data-lightbox`, so they never match the old wrapper's nav if it is still on the page.

## Settings

`CONFIG` at the top of `lightbox.js`: durations and eases for open (0.55s), close (0.45s) and slide (0.45s), the backdrop (90% black), the zoomed photo's corner radius (8px) and the swipe distance (40px). Every tween sets its own ease and duration, so the site-wide `gsap.defaults()` in `main.js` doesn't affect it.

## Demo

`src/lightbox-demo.html` (`npm run dev`, then open `/lightbox-demo.html`) mirrors the Events gallery with landscape and portrait photos. Change `<html lang dir>` to test English.

## Troubleshooting

**Clicking a photo does nothing:** check the button has `data-lightbox="trigger"`, contains an `<img>`, and sits inside a `[data-gallery]` element. Check GSAP is loaded.

**No badge on hover:** the badge is added at init; if the gallery is rendered later (it isn't on this site), it won't have one.

**The old lightbox opens instead:** the page is loading an old bundle. The aliases revalidate on every load, so a hard refresh fixes it.
