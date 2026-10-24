# View Transitions

CSS-only page transitions between pages of the site: the old page fades down and out, the new one rises in with a slight overshoot, and the navbar stays in place.

| | |
|---|---|
| Source | `src/styles/view-transitions.css` |
| Loaded by | `main.css` |
| Used on | Every page |
| Depends on | `data-view-transition="navbar"` on `.nav` in the Mega Menu component (Webflow) |

## How it works

- `@view-transition { navigation: auto; }` opts the site into cross-document view transitions. Both the page you leave and the page you land on must have the rule, which they do because `main.css` loads in the head of every page. It applies to same-origin navigations only (links within the site, the Hebrew/English switch, back and forward).
- The browser snapshots the old page as `::view-transition-old(root)` and the new one as `::view-transition-new(root)`. The old snapshot runs `fade-out-down` (180ms, ease-in); the new one runs `fade-in-up` (320ms, `cubic-bezier(0.34, 1.56, 0.64, 1)`, which overshoots slightly).
- `[data-view-transition='navbar']` gives the navbar `view-transition-name: navbar`, so it is captured separately from the page. It doesn't fade with the root; the browser morphs it from the old page's navbar to the new one's, which also covers the scrolled (`.is-scrolled`) and top-of-page looks differing between pages. A `view-transition-name` must be unique on the page, so only the one navbar has the attribute.
- Everything sits inside `@media (prefers-reduced-motion: no-preference)`, so visitors who ask for reduced motion get plain navigation.

## Browser support

Chromium (Chrome, Edge) and Safari 18.2+ run the transitions. Browsers without cross-document view transitions ignore the at-rule and navigate normally.

## Webflow setup

The `data-view-transition="navbar"` attribute is set on the `.nav` element inside the **Mega Menu** component, so it is on every page. Without it, the navbar fades and rises with the rest of the page.

## Interplay with other components

Page-load animations ([text-reveal](text-reveal.md), [content-reveal-scroll](content-reveal-scroll.md)) start on the new page while it is still fading in. The fade-in is short (320ms) so they overlap only briefly. If a page feels busy on arrival, shorten `fade-in-up` or drop its `transform` before touching those components.
