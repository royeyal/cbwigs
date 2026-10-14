# Text Reveal

Masked heading reveal: SplitText breaks a heading into lines, words or characters and slides them up into view.

| | |
|---|---|
| Source | `src/js/textreveal.js`, `src/styles/textreveal.css` |
| Loaded by | `main.js` → `initMaskTextScrollReveal()` |
| Used on | `/`, `/about`, `/collection-2025`, `/collection-2026`, `/hair-extensions`, `/hairbun`, `/my-original` (and `/en` versions) |
| Depends on | GSAP + SplitText + ScrollTrigger (Webflow globals) |

## Webflow setup

| Attribute | Value | Meaning |
|---|---|---|
| `data-split` | `heading` | Hides the heading until it is split (prevents a flash of unsplit text) |
| `data-split-reveal` | `lines` (default), `words`, `chars` | What animates |

Use both attributes on the same element. The Designer and Editor always show the text (`.wf-design-mode`, `.w-editor` overrides).

## Behavior

- Waits for `document.fonts.ready` so line breaks are measured with the real font.
- An `h1` animates immediately on load; other elements animate when their top reaches 80% of the viewport.
- Timing: lines 0.8s / 0.08s stagger, words 0.6s / 0.06s, chars 0.4s / 0.01s, all `expo.out`.
- After animating, the split is reverted to the original markup, so screen readers and resizing see normal text.
- `autoSplit` re-splits if the layout changes before the animation runs.
- Each line is clipped twice: by SplitText's `.line-mask` wrapper (`overflow: clip`) and by `.line` itself (`overflow: hidden`). Both get `padding-bottom: 0.1em; margin-bottom: -0.1em`, so descenders aren't cut off during the animation and the line spacing doesn't change.

## Known issues

- `prefers-reduced-motion` is only handled in CSS (the heading is never hidden); the JavaScript still animates the text.
