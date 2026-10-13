# Accordion

CSS-grid accordion with keyboard support, plus a helper that zero-pads the item numbers (`1` → `01`).

| | |
|---|---|
| Source | `src/js/accordion.js`, `src/js/leading-zero.js`, `src/styles/accordion.css` |
| Loaded by | `main.js` → `initAccordionCSS()`, `initLeadingZero()` |
| Used on | `/my-original` (and `/en`) |
| Depends on | Nothing |

## Webflow setup

```
[data-accordion-css-init] [data-accordion-close-siblings="true"]   ← optional: one open at a time
└── [data-accordion-status="not-active"] ×n                         ← "active" to start open
    ├── [data-accordion-toggle]                                     ← the clickable header
    │   ├── .accordion-css__item-count                              ← optional number, zero-padded by leading-zero.js
    │   └── .accordion-css__item-icon                               ← give it a rotation in Webflow; it turns to 0° when open
    └── .accordion-css__item-bottom                                 ← display: grid; grid-template-rows: 0fr in Webflow
```

The open/close animation is pure CSS: `.accordion-css__item-bottom` transitions `grid-template-rows` to `1fr` when its item is `active`. Give its single child `overflow: hidden` in Webflow.

## Behavior

- Click or Enter/Space toggles an item; with `close-siblings` the others close.
- Arrow Up/Down move focus between headers (wrapping), Home/End jump to the first and last.
- Toggles get `role="button"`, `tabindex="0"`, `aria-expanded` and `aria-controls`.
- `initLeadingZero()` pads any `.accordion-css__item-count` below 10, wherever it appears.
