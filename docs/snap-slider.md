# Snap Slider

Horizontal image slider built on native CSS scroll-snap, with prev/next arrows and faded edges. It replaced Swiper in October 2026: same look, about 1 KB instead of ~23 KB gzipped on every page.

| | |
|---|---|
| Source | `src/js/snap-slider.js`, `src/styles/snap-slider.css` |
| Loaded by | `main.js` → `initSnapSlider()` |
| Used on | `/hairbun`, `/en/hairbun` |
| Depends on | Nothing (no GSAP) |
| Demo | `src/snap-slider-demo.html` |

## Webflow setup

The attribute names still say `swiper` because that is what the Webflow markup already uses; there is no Swiper on the site.

```
[data-swiper-group]                .swiper-group      ← fade mask, positioning context
├── [data-swiper-wrap]             .swiper            ← Collection List Wrapper
│   └── [role=list]                .swiper-wrapper    ← Collection List: becomes the scroller
│       └── [role=listitem] ×n     .swiper-slide      ← Collection Item
│           └── .swiper-card > img
└── .swiper-navigation
    ├── button[data-swiper-prev]   .swiper-navigation__button
    ├── .swiper-pagination                            ← empty spacer
    └── button[data-swiper-next]   .swiper-navigation__button
```

- The script marks the list with `data-snap-track` and styles hang off that. Static (non-CMS) markup works too: if there is no `[role=list]`, the first child of `[data-swiper-wrap]` is used.
- The arrows must be `<button>` elements; they are hidden with the `disabled` attribute at either end.
- `aria-label` is added to arrows that don't have one (`הקודם` / `הבא` in Hebrew, `Previous` / `Next` in English).

## Behavior

- Swipe on touch, trackpad scroll on desktop, arrows everywhere. No mouse-drag and no infinite loop (Swiper had both).
- Each arrow scrolls one slide toward the side of the slider it sits on. That is direction-proof: in RTL the left arrow (marked `data-swiper-next`) moves toward the end, in LTR the right one does.
- Smooth scrolling respects `prefers-reduced-motion`.

## Sizing

Slide width is set in `snap-slider.css`: `max(min(20em, 80%), calc(275px + 1.25em))`. That gives 320px slides on desktop (matching the old Swiper layout) and never lets a slide get narrower than the Webflow card's 275px `min-width` plus the slide's 1.25em end padding (both set in Webflow).

## Edge fade

`[data-swiper-group]` has a horizontal `mask-image`. Tune it with these variables, or add a combo class:

| Variable | Default |
|---|---|
| `--swiper-fade-fade-in` | `8%` |
| `--swiper-fade-fade-out` | `92%` |

Combo classes: `.swiper-group--no-fade`, `.swiper-group--subtle-fade` (5%/95%), `.swiper-group--strong-fade` (12%/88%). The gradient is mirrored under `[dir='rtl']`.
