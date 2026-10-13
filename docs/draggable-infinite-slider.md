# Draggable Infinite Slider

A looping, draggable carousel with momentum, snapping, prev/next buttons and a `01 / 05` style counter. Slides can be links and can show a centered play button.

| | |
|---|---|
| Source | `src/js/draggable-infinite-slider.js`, `src/styles/draggable-infinite-slider.css` |
| Loaded by | `main.js` → `initDraggableInfiniteSlider()` |
| Used on | `/`, `/collection-2025`, `/collection-2026`, `/hair-extensions` (and `/en` versions) |
| Depends on | GSAP, Draggable, InertiaPlugin (Webflow globals; the slider exits if any is missing) |
| Demo | `src/draggable-infinite-slider.html` |

## Webflow setup

One slider per page: the script uses `document.querySelector` for the buttons and counters.

```
[data-slider="list"]               .slider__list            ← Collection List
└── [data-slider="slide"] ×n       .slider__slide           ← Collection Item
    └── a.slide__link                                       ← optional; whole slide clickable
        └── .slider__slide-inner
            ├── .slide-play-button > .slide-play-icon       ← optional, centered
            ├── img.slide__img
            └── .slide__caption > .slide__caption-dot + p.slide__caption-label

button[data-slider="button-prev"]
button[data-slider="button-next"]
[data-slide-count="step"]          ← cloned once per slide; the stack slides to the active number
[data-slide-count="total"]
```

- Counts are zero-padded (`01`…`09`).
- The active slide gets `.active`. Clicking a slide that isn't active moves the loop to it.
- GSAP Draggable suppresses the click after a drag, so dragging doesn't open the slide link.
- The CMS template gives every link `id="slide-link"`, which duplicates the ID on the page. Remove the ID in Webflow; nothing in the code uses it.

## Behavior

- Built on the GSAP `horizontalLoop` helper: slides are positioned with transforms and wrap around seamlessly.
- Slides align to the start (`center: false`). At `min-width: 992px`, `.active` goes to the slide *after* the loop's current one (the second visible slide); below that it's the current one. A `matchMedia` listener moves it when the breakpoint changes.
- Throws use InertiaPlugin and snap to the nearest slide.
- Pages without `[data-slider="slide"]` exit silently (no console output).

## Styling

`.slide-play-button` is an 80px circle (70px at ≤ 991px) with the same glass style as the YouTube player's play button; it reacts to `.slide__link:hover` and `:focus-visible`. Everything else (slide width, gap, caption) is in `draggable-infinite-slider.css`.
