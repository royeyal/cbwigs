# cbwigs

Custom JavaScript and CSS for the **cbwigs** Webflow site (Hebrew primary, English under `/en`). Webflow owns the HTML; this repo builds one JS bundle and one CSS file with Vite, and a Cloudflare Worker serves them at stable URLs that the site loads on every page.

- **Architecture, commands, deploy and conventions:** [`AGENTS.md`](../AGENTS.md)
- **Plain-English overview:** [`PROJECT_CONTEXT.md`](../PROJECT_CONTEXT.md)
- **Staging site:** https://cbwigs.webflow.io (the `cbwigs.co.il` domain isn't connected yet)

```bash
npm install
npm run dev      # demo pages on http://localhost:3000 (src/*.html)
npm run build    # → dist/ (commit it with the source change)
```

Merging to `main` deploys to production. Test on the PR's preview build first (see AGENTS.md → Verifying a Change).

## Components

One doc per component. Each one lists its source files, which pages use it, and the Webflow setup. Page lists are from the staging sitemap, October 2026; every Hebrew page has an `/en` twin.

### Everywhere

| Component | What it does |
|---|---|
| [multilevel-navigation](multilevel-navigation.md) | Navbar dropdowns, mobile burger menu, scrolled state |
| [locale-switch](locale-switch.md) | Points the language link at the same page in the other locale |
| [content-reveal-scroll](content-reveal-scroll.md) | Staggered fade-up of content groups on scroll |
| [underline-links](underline-links.md) | Animated link underlines (CSS) |
| [button-hover](button-hover.md) | Hover/focus/pressed states for `.button` (CSS) |
| [flodesk](flodesk.md) | Localizes and restyles the footer newsletter form |
| [dynamic-current-year](dynamic-current-year.md) | Current year in the footer |
| [relume-container](relume-container.md) | Site-wide overrides for Relume layout classes (CSS) |
| [webflow-overrides](webflow-overrides.md) | Rich-text paragraph, link and list styling (CSS) |

### Specific pages

| Component | What it does | Pages |
|---|---|---|
| [text-reveal](text-reveal.md) | SplitText heading reveal | home, about, collections, hair-extensions, hairbun, my-original |
| [gsap-slider](gsap-slider.md) | Draggable testimonial slider | home, collections, contact-us, hairbun |
| [draggable-infinite-slider](draggable-infinite-slider.md) | Looping video/reel slider with counter | home, collections, hair-extensions |
| [parallax-image](parallax-image.md) | Image parallax inside cards | home, events, collection-2026, hair-extensions, hairbun, my-original |
| [youtube-player](youtube-player.md) | Click-to-play inline YouTube (video or Short) | hairbun, my-original, events/* |
| [youtube-lightbox](youtube-lightbox.md) | Hero play button → video modal | home, about, hairbun, my-original |
| [lightbox-setup](lightbox-setup.md) | Image gallery lightbox with Flip | events/* |
| [snap-slider](snap-slider.md) | Scroll-snap image slider | hairbun |
| [layout-grid-flip](layout-grid-flip.md) | Large/small grid toggle with Flip | hairbun |
| [flip-counter](flip-counter.md) | Sticky flip-clock section counter | hairbun, my-original |
| [accordion](accordion.md) | Accordion with zero-padded numbers | my-original |
| [image-trail-following-cursor](image-trail-following-cursor.md) | Images trailing the cursor (desktop) | my-original |
| [copy-email-to-clipboard-button](copy-email-to-clipboard-button.md) | Copy-email button | contact-us |

### Not used on any page

| Component | Notes |
|---|---|
| [gsap-gallery-slider](gsap-gallery-slider.md) | Full-width one-at-a-time gallery; in the bundle, unused |
| `src/styles/animations.css` | Utility classes (`.gsap-fade-in`, `.scroll-trigger`, `.gsap-element`, …); none appear on the site |
| Standalone builds `/draggable-slider.js`, `/parallax-image.js` | For pages without `main.js`; every page loads `main.js` today |

Reference: [brand-colors](brand-colors.md) lists the Webflow color variables.

## Adding a component

1. Create `src/js/<name>.js` exporting `init<Name>()`. Select elements by `data-*` attributes and return early when none exist.
2. Put styles in `src/styles/<name>.css` and `@import` it from `src/styles/main.css`.
3. Import and call `init<Name>()` inside the `DOMContentLoaded` listener in `src/js/main.js`.
4. Use GSAP and its plugins as globals (`gsap`, `ScrollTrigger`, …); never import them.
5. Handle both directions: `[dir='rtl']` in CSS, `document.documentElement.lang.startsWith('he')` in JS.
6. Add `docs/<name>.md` (copy the header table from any doc here) and a row in the table above.

## Multilingual content

The navbar labels come from a single CMS item that wraps the whole navbar in a Collection List. Webflow Localization could localize the navbar component directly instead, but the CMS item lets a client edit both locales' menu text in the Editor without Designer access, so it stays.
