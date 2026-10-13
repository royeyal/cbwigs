# Content Reveal on Scroll

Fades and slides groups of elements into view, one after another, when they scroll into the viewport.

| | |
|---|---|
| Source | `src/js/contentrevealscroll.js` |
| Loaded by | `main.js` → `initContentRevealScroll()` |
| Used on | Almost every page |
| Depends on | GSAP + ScrollTrigger (Webflow globals) |

## Webflow setup

Put `data-reveal-group` on a wrapper. Its **direct children** animate in order. With no children, the wrapper itself animates.

| Attribute | On | Default | Meaning |
|---|---|---|---|
| `data-reveal-group` | Wrapper | | Turns the effect on |
| `data-stagger` | Wrapper or nested group | `100` | Delay between items, in **milliseconds** |
| `data-distance` | Wrapper, child or nested group | `2em` | How far items travel up |
| `data-start` | Wrapper | `top 80%` | ScrollTrigger start |
| `data-reveal-group-nested` | A child, or an element inside one | | That child's own children reveal one by one inside its slot |
| `data-ignore="false"` | Nested child | | Also animate the nested group's parent element |

## Behavior

- Each group animates once (`once: true`), 0.8s `power4.inOut`, then clears its inline styles.
- With `prefers-reduced-motion: reduce` everything is shown immediately.
- Items start hidden via GSAP (`autoAlpha: 0`), so they are visible if JavaScript fails.
