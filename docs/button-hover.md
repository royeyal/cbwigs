# Button Hover

One shared hover for every button on the site: a fill that grows across the button from the reading-start edge (left in English, right in Hebrew). It covers Webflow's `.button` (including the form's `<input type="submit">`), the navbar's `.nav-button` and the `.copy-email-button`. Base button styles (shape, colors, borders) stay in Webflow.

| | |
|---|---|
| Source | `src/styles/button-hover.css` |
| Loaded by | `main.css` |
| Used on | Every page (navbar buttons are on all of them) |

## How it works

The fill is a `linear-gradient` background whose `background-size` animates from `0% 100%` to `100% 100%`, anchored at `left center` (`right center` under `[dir='rtl']`). It's a background rather than a `::before` element because `<input>` elements can't have pseudo-elements. Icons don't move; WhatsApp, Waze and phone icons are brand marks.

Each variant sets two custom properties:

| Variant | `--btn-fill` | `--btn-fill-text` |
|---|---|---|
| `.button` (dark) | `button--bg-hover` #4a4540 | `neutral-lightest` (unchanged) |
| `.button.is-alternate` (light) | `neutral` #c8bfb3 | `neutral-darkest` (unchanged) |
| `.button.is-secondary` (outline) and `.copy-email-button` | `neutral-darkest` | `neutral-lightest` |
| `.button.is-secondary.is-alternate` (light outline on dark) | `neutral-lighter` | `neutral-darkest` |
| `.button.is-link` | no fill | |
| `.nav-button` over the hero | `#fff` | `#2b1d15` |
| `.nav-button.is--primary` (white) | `neutral-lighter` | `#2b1d15` |
| `.nav-button` once the bar is scrolled, and the primary on mobile | dark | `#fff` |

`--btn-fill-text` is set explicitly for every variant. A `currentcolor` default would make the label inherit its parent's color.

- The fill appears on hover (`hover: hover` and `pointer: fine` devices only, so taps don't leave it stuck), on `:focus-visible`, and on a copy button in its `copied` state.
- `:active` darkens the fill.
- `prefers-reduced-motion` turns the transition off; the fill still appears, instantly.

## Shapes

All buttons are pills. The navbar CTA (`.nav-button`) uses the site's pill radius variable, and the mobile `.menu-button` is a circle; both are set in the Webflow Designer. One exception lives in the repo: at ≤ 479px the WhatsApp button (`.nav-button.is--primary`) becomes an icon-only circle, with its label visually hidden but still read by screen readers. See [multilevel-navigation.md](multilevel-navigation.md).

## Borders (Webflow)

Every `.button` has a 3px border, so primary and secondary buttons are the same height. On the primary button it is `transparent`: the fill shows through it, so the pill is full size on any background, and the hover fill covers it too. Don't set it to the fill color; `neutral-darkest` is semi-transparent, so a same-color border renders as a darker rim.

Over photos, the dark glass button needs a light ring to stand out. The **Primary Button with Icon** component has an **On image** variant that sets the border to `neutral` (#c8bfb3); select it on instances placed over images. As of 2026-10-14 that is the Home hero (Hero Header with CTA) and the Hairbun photo section (Contact Us with Background Image).
