# Button Hover

Hover, focus and pressed states for Webflow's `.button` class: a color shift per variant, plus the icon nudging toward the label on icon buttons. The base button styles stay in Webflow.

| | |
|---|---|
| Source | `src/styles/button-hover.css` |
| Loaded by | `main.css` |
| Used on | Every page with a `.button` |

## States

| Variant | Hover / `:focus-visible` | `:active` |
|---|---|---|
| `.button` (dark) | background `--_primitives---button--bg-hover` (#4a4540) | `--_primitives---button--bg-active` (#2e2925) |
| `.button.is-alternate` (light) | background `neutral-lighter` (#e5d8c6) | `neutral` (#c8bfb3) |
| `.button.is-secondary` (outline) | border `accent--400` (#6b625a) | transparent |
| `.button.is-secondary.is-alternate` | border `neutral-lighter` | transparent |
| `.button.is-link` | no background change | transparent |
| `.button.is-icon` | icon (`.icon-embed-xsmall`) moves 0.25rem toward the label: right in LTR, left in RTL | |

- Colors come from the Webflow variables, so changing them in Webflow updates the hover too. The hex values are fallbacks.
- Hover only applies under `@media (hover: hover) and (pointer: fine)`; keyboard focus gets the same look via `:focus-visible`.
- `prefers-reduced-motion` turns the transitions off.
