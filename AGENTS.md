# AGENTS.md

## Project Overview

This project provides custom JavaScript and CSS for **cbwigs.co.il**, a Hebrew/English bilingual Webflow e-commerce site selling wigs. The code is authored locally, bundled with Vite, and served via a Cloudflare Worker that resolves hashed asset filenames from Vite's manifest. Webflow pages reference the Cloudflare-hosted URLs directly via custom code embeds — the HTML structure is entirely managed inside Webflow, not in this repo.

## Stack

- **Runtime**: Browser (vanilla ES modules); no Node.js runtime code
- **Build tool**: Vite ^8.0.3 (ESM, single entry point, manifest mode)
- **Bundled dependency**: Swiper ^12.1.2 (imported as ES module)
- **Deployment target**: Cloudflare Workers (static assets via `ASSETS` binding)
- **Worker runtime**: `wrangler` ^4.71.0, compatibility date `2025-09-06`
- **CSS processing**: PostCSS with postcss-nesting, autoprefixer, cssnano
- **Linting**: ESLint ^10.0.3 (flat config), Stylelint ^17.4.0, Prettier ^3.8.1
- **Pre-commit hooks**: Husky + lint-staged

## Project Structure

```
cbwigs/
├── src/                          # All source code (Vite root)
│   ├── js/                       # JavaScript modules
│   │   ├── main.js               # Single entry point — imports all modules + CSS
│   │   ├── accordion.js
│   │   ├── contentrevealscroll.js
│   │   ├── draggable-infinite-slider.js
│   │   ├── draggable-infinite-slider-standalone.js  # Standalone build (no main.js)
│   │   ├── flip-counter.js
│   │   ├── gsap-gallery-slider.js
│   │   ├── gsap-slider.js
│   │   ├── image-trail-following-cursor.js
│   │   ├── layout-grid-flip.js
│   │   ├── leading-zero.js
│   │   ├── lightbox-setup.js
│   │   ├── locale-switch.js
│   │   ├── multilevel-navigation.js
│   │   ├── parallax-image.js
│   │   ├── swipeslider.js        # Uses bundled Swiper
│   │   ├── textreveal.js
│   │   ├── youtube-lightbox.js
│   │   └── youtube-player.js
│   ├── styles/                   # CSS modules
│   │   ├── main.css              # Imported by main.js; aggregates all CSS
│   │   └── *.css                 # Per-feature stylesheets
│   └── *.html                    # Local demo/test pages (not deployed)
├── external/
│   └── src/
│       └── worker.js             # Cloudflare Worker — manifest-based asset router
├── docs/                         # Feature documentation (Markdown)
├── dist/                         # Vite build output (gitignored)
│   ├── js/main.[hash].js
│   ├── css/main.[hash].css
│   └── .vite/manifest.json       # Read by the Worker at request time
├── vite.config.js
├── wrangler.toml
├── eslint.config.js
├── postcss.config.js
└── PROJECT_CONTEXT.md            # Plain-English architecture summary
```

## Commands

### Development
```bash
npm run dev      # Vite dev server on http://localhost:3000 (auto-opens browser)
```
Open any `src/*.html` demo file to test a feature locally.

### Build
```bash
npm run build    # Outputs to ./dist (JS → dist/js/, CSS → dist/css/, manifest → dist/.vite/)
npm run clean    # rm -rf dist
```

### Deploy
```bash
npm run deploy   # npm run build && npx wrangler deploy
```
Requires `CLOUDFLARE_API_TOKEN` to be set (see **Environment Variables** below).

## Environment Variables

Stored in `.env` (gitignored — never commit this file):

| Variable | Purpose |
|---|---|
| `WEBFLOW_TOKEN` | Webflow Data API token — authenticates calls to the Webflow Data API (used by Webflow MCP tools to read/write CMS content, pages, etc.) |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token — authenticates calls to the Cloudflare API (used by `wrangler` when running `npm run deploy` to publish the Worker) |

These are independent credentials for two separate services — neither talks to the other.

Copy the `.env` template and fill in your tokens before deploying.

### Test / Lint
```bash
npm run lint        # ESLint src/ --fix
npm run lint:css    # Stylelint src/**/*.css --fix
npm run format      # Prettier on src/**/*.{js,css}
npm run preview     # Vite preview server for the built dist/
```

## Cloudflare Specifics

- **Worker name**: `cbwigs-assets`
- **Main entry**: `external/src/worker.js`
- **Assets binding**: `ASSETS` → serves files from `./dist`
- **Compatibility date**: `2025-09-06`
- **No KV namespaces, D1, or custom routes configured**

The Worker reads `dist/.vite/manifest.json` at request time to resolve hashed filenames. Stable URL aliases (`/main.js`, `/main.css`, `/draggable-slider.js`, `/parallax-image.js`, `/parallax-image.css`) redirect to the correct hashed file. All responses include `Access-Control-Allow-Origin: *`.

## Webflow Specifics

- **Site ID**: `68b19e69d4dbfaf52f92045b`
- **Workspace ID**: `69637b73ed5f53706ed27832`
- Webflow manages all HTML structure and base styles; this repo only provides JS/CSS loaded via custom code embeds
- The site is bilingual (Hebrew `he` / English `en`) — `document.documentElement.lang` is used to detect locale at runtime
- Hebrew is RTL; CSS and JS must account for both LTR and RTL layouts

## Code Conventions

- **Module format**: ESM (`"type": "module"` in package.json); use `import`/`export` throughout
- **No TypeScript** — plain `.js` files only
- **GSAP globals**: `gsap`, `ScrollTrigger`, `SplitText`, `Draggable`, `InertiaPlugin`, `Flip` are loaded globally by Webflow. **Never import them.** Declared as `readonly` globals in ESLint config.
- **Swiper**: Imported as an ES module from the `swiper` package — the only bundled runtime dependency
- **DOM selection**: Use `data-*` attributes for selectors, not class names, following Webflow convention
- **Defensive init**: Every `init*()` function must check for element existence before running (e.g. `if (!elements.length) return;`)
- **Entry pattern**: Each feature file exports a named `init*()` function; `main.js` imports and calls all of them inside a `DOMContentLoaded` listener
- **Quotes**: single; **semi**: always; **indent**: 2 spaces; **no trailing commas** (enforced by ESLint)
- **CSS**: PostCSS nesting syntax is supported; avoid conflicting with Webflow-generated class names; prefer specific selectors

## Architecture Notes

- The Worker is purely a static asset router — it never caches responses for non-hashed paths (`no-cache`). Do not add server-side logic that assumes persistent state.
- Vite manifest mode is critical: `build.manifest: true` in vite.config.js is what enables the Worker's manifest lookup. Do not disable it.
- CSS code-splitting is disabled (`cssCodeSplit: false`) — all styles land in a single `dist/css/main.[hash].css` file.
- Module preload is disabled (`modulePreload: false`) — the site loads one flat JS bundle, not a module graph.
- The `draggable-infinite-slider-standalone.js` module is intended to be served separately (via the `/draggable-slider.js` alias) for pages that only need the slider without the full `main.js` bundle. It is **not** imported by `main.js`.
- Flodesk form text customization in `main.js` uses a retry loop (up to 10 × 500ms attempts) because the Flodesk embed loads asynchronously after `DOMContentLoaded`.

## What Not to Do

- **Do not import GSAP or any GSAP plugin.** They are globals registered by Webflow. Importing them will create a second GSAP instance and break animations.
- **Do not run `npm run deploy` without first verifying the build output** — this deploys directly to production.
- **Do not add CSS that targets Webflow class names like `.w-*` or `.wf-*`** — these are internal Webflow classes and may change.
- **Do not split the CSS output** — `cssCodeSplit: false` is intentional; the Worker alias `/main.css` expects a single CSS file.
- **Do not disable the Vite manifest** (`build.manifest: true`) — the Worker depends on it to resolve hashed filenames.
- **Do not commit `dist/`** — it is build output and should be regenerated before each deploy.
- **Do not add new npm runtime dependencies without considering bundle size** — the final JS bundle is served to every page visitor.
