# GSAP Slider (testimonials)

A draggable card slider with snapping, prev/next controls and screen-reader announcements. Slides-per-view and on/off are set per breakpoint with CSS variables.

| | |
|---|---|
| Source | `src/js/gsap-slider.js`, `src/styles/gsap-slider.css` |
| Loaded by | `main.js` → `initBasicGSAPSlider()`; also re-runs on width changes (debounced 200ms) |
| Used on | `/`, `/collection-2025`, `/collection-2026`, `/contact-us`, `/hairbun` (and `/en` versions) |
| Depends on | GSAP + Draggable (+ InertiaPlugin for throws) (Webflow globals) |

## Webflow setup

```
[data-gsap-slider-init]                      .gsap-slider
├── [data-gsap-slider-collection]            .gsap-slider__collection   ← Collection List Wrapper
│   └── [data-gsap-slider-list]              .gsap-slider__list         ← the dragged track
│       └── [data-gsap-slider-item] ×n       .gsap-slider__item
└── [data-gsap-slider-controls]                                         ← optional; hidden when the slider is off
    ├── [data-gsap-slider-control="prev"]
    └── [data-gsap-slider-control="next"]
```

## Settings (CSS variables on `[data-gsap-slider-init]`)

| Variable | > 991px | ≤ 991px | ≤ 767px | ≤ 480px |
|---|---|---|---|---|
| `--slider-status` | `on` | `on` | `on` | `on` |
| `--slider-spv` (slides per view) | 3 | 2.25 | 1.15 | 1 |
| `--slider-gap` | 1.5em | 1.5em | 1em | 0.75em |

Set `--slider-status: off` at a breakpoint to show a static row instead. The slider also turns itself off when every item already fits. Change these in `gsap-slider.css` (or override the variables in Webflow).

## Behavior

- Drag or throw the track; it snaps to slide positions. Arrows and Arrow Left/Right (while focus is in the slider) move one slide.
- State attributes for styling: `data-gsap-slider-status="active|not-active"` on the root, `data-gsap-slider-control-status` on each control, `data-gsap-slider-list-status="grab|grabbing"` on the track.
- Accessibility: the root becomes a labelled carousel region with a polite live region ("Slide 2 of 5"). Every slide that is at least half in view at the snapped position stays exposed (3 at `--slider-spv: 3`); the others get `aria-hidden` and lose their links from the tab order. Visibility is measured from the real slide positions, so gap and `max-width` are accounted for. `aria-selected="true"` stays on the current snap position's slide only.

## Known issues

- No RTL-specific code: positions and arrow keys work in physical (left/right) terms on Hebrew pages too.
- ARIA labels ("Slider", "Previous Slide", "Slide 1 of 5") are English on both locales.
