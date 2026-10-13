# Multilevel Navigation

The site header: mega-menu dropdowns on desktop, burger menu with accordion dropdowns on mobile, and a "scrolled" style once the page moves.

| | |
|---|---|
| Source | `src/js/multilevel-navigation.js`, `src/styles/multilevel-navigation.css` |
| Loaded by | `main.js` → `initNavigation()` |
| Used on | Every page (the navbar is a shared component) |
| Depends on | GSAP + ScrollTrigger (only for the scrolled state) |

## Webflow setup

| Element | Hook | Notes |
|---|---|---|
| `<nav>` | `[data-menu-status="closed"]` + class `.nav` | Script toggles `open` / `closed` on mobile; `.nav` gets `.is-scrolled` |
| Burger button | `[data-menu-button]` | Mobile only |
| Dropdown trigger | `button[data-dropdown-toggle]` + `.nav-link` | Its **next sibling** must be the `.nav-dropdown` |
| Dropdown links | `.nav-dropdown__link` | Get `role="menuitem"`; arrow keys move between them |
| Plain top-level links | `.nav-link` without `data-dropdown-toggle` | Hovering one closes open dropdowns (desktop) |

The menu labels come from a single CMS item (the whole navbar sits inside a Collection List), so a client can edit both locales in the Editor. That is deliberate; see the note in `docs/README.md`.

## Behavior

- **Desktop (≥ 768px):** dropdowns open on hover or click, close on mouse-leave, outside click, focus leaving the menu, or `Escape`. Opening by click moves focus to the first link.
- **Mobile (< 768px):** the burger toggles `data-menu-status`; each dropdown toggles independently and closing the menu closes all dropdowns.
- **Scrolled state:** after 50px of scroll, ScrollTrigger adds `.is-scrolled` to `.nav` (and removes it near the top). The CSS gives the bar a translucent white background with blur and shadow, and turns the primary nav button dark. Change the threshold in `initStickyNavScroll()` (`start: 'top -50'`).
- On resize the script re-checks the mode (debounced 200ms) and initializes the other mode's handlers if needed.

## Styling hooks

- `[data-dropdown-toggle='open']` on a toggle shows its dropdown.
- `.nav:not(.is-scrolled):has([data-dropdown-toggle='open'])` swaps the logo filter while a dropdown is open at the top of the page.
- `:root` variables in the CSS: `--nav-bg-height`, `--cubic-default`, `--duration-fast|normal|slow`, `--shadow-elevation-low|medium|high`.

## Known issues

- Crossing the 768px breakpoint after load (for example rotating a tablet) leaves both the desktop and mobile click handlers on the dropdown toggles, so a toggle can open and close in the same click. A reload fixes it.
- The desktop document-click and link-hover listeners are added again each time the page switches back to desktop mode.
