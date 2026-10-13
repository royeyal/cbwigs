# Layout Grid Flip

Two buttons switch a grid between a large and a small card layout, animated with GSAP Flip.

| | |
|---|---|
| Source | `src/js/layout-grid-flip.js`, `src/styles/layout-grid-flip.css` |
| Loaded by | `main.js` → `initLayoutGridFlip()` |
| Used on | `/hairbun` (and `/en`) |
| Depends on | GSAP + Flip (Webflow globals) |

## Webflow setup

```
.layout-group [data-layout-group] [data-layout-status="large"]
├── .layout-buttons
│   ├── button.layout-btn.is--active [data-layout-button="large"]
│   └── button.layout-btn            [data-layout-button="small"]
└── .layout-grid [data-layout-grid]
    └── .layout-grid__collection [data-layout-grid-collection]   ← Collection List Wrapper
        └── .layout-grid__list [data-layout-grid-list]
            └── .layout-grid__item [data-layout-grid-item] ×n
                └── .layout-grid__card
                    ├── .layout-grid__card-visual > img        ← can also carry data-parallax-image
                    └── .layout-grid__card-details
                        ├── h3.layout-grid__card-title [data-layout-grid-item-title]
                        └── .layout-grid__card-sub
```

Set the starting `data-layout-status` and give that button `is--active`.

## Behavior

- `data-layout-status` on the group drives the grid columns in CSS (large: 3 columns, small: 5; at ≤ 767px 1 and 2) and fades out `.layout-grid__card-sub` / shrinks the title in the small layout.
- Clicking a button records the item positions, switches the status and Flips the items into place over 0.65s with a small stagger, while animating the collection height. `data-transitioning="true"` is set during the animation.
- Buttons get `aria-pressed`. With reduced motion the layout switches instantly.
- Afterwards it calls `ScrollTrigger.refresh()` so parallax and reveals on the page re-measure.
