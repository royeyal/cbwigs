# Underline Links

CSS-only animated underlines, drawn with `::before` / `::after` lines that scale in and out from the reading direction.

| | |
|---|---|
| Source | `src/styles/underline-links.css` |
| Loaded by | `main.css` |
| Used on | Every page (navbar, footer and body links) |

## Variants

| Hook | Resting state | On hover |
|---|---|---|
| `[data-underline-link]` | No underline | Underline draws in |
| `[data-underline-link="alt"]` | Underlined | Underline sweeps out, then draws back in |
| `.section-rich-text .w-richtext a` (all rich text on the site today) | Native text underline (from `webflow.css`) | Native underline goes away, animated line draws in |
| `.w-richtext a` anywhere else | Native underline **and** the animated line | Animated line sweeps out and back, like `alt` |
| `[data-hover]` on an ancestor | | Hovering the ancestor triggers its child links, so a whole card can drive the link's underline |

- Hover effects are inside `@media (hover: hover) and (pointer: fine)`, so touch devices never get a stuck underline.
- Each variant has `[dir='rtl']` rules that flip the `transform-origin`, so lines grow from the right in Hebrew.
- The line is `0.0625em` thick in `currentColor`; the easing is `cubic-bezier(0.625, 0.05, 0, 1)` over 0.735s.

Rich-text links depend on two files: this one draws the animated line, and `webflow.css` (loaded later) turns the native underline back on and removes it on hover. Rich text outside a `.section-rich-text` wrapper would show both lines at rest.

`.w-richtext a` is one of the two deliberate exceptions to "don't target `.w-*` classes" (rich-text links have no other hook). Related rich-text styling (color, list padding) is in [webflow-overrides.md](webflow-overrides.md).
