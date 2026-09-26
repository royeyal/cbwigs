# AGENTS.md

## Project Overview

This project provides custom JavaScript and CSS for **cbwigs.co.il**, a Hebrew/English bilingual Webflow e-commerce site selling wigs. The code is authored locally, bundled with Vite, and served via a Cloudflare Worker that resolves hashed asset filenames from Vite's manifest. Webflow pages reference the Cloudflare-hosted URLs directly via custom code embeds — the HTML structure is entirely managed inside Webflow, not in this repo.

## Stack

- **Runtime**: Browser (vanilla ES modules); no Node.js runtime code
- **Build Node.js**: 24, pinned in `.node-version` (Cloudflare Workers Builds reads it; cssnano 9 fails on Node 20)
- **Build tool**: Vite (ESM, manifest mode) — two passes: the main bundle, then standalone files (`--mode standalone`)
- **Bundled dependency**: Swiper (imported as ES module)
- **Deployment target**: Cloudflare Workers (static assets via `ASSETS` binding)
- **Worker runtime**: `wrangler`, compatibility date `2025-09-06`
- **CSS processing**: PostCSS with postcss-nesting, autoprefixer, cssnano
- **Linting**: ESLint (flat config, code-quality rules only), Stylelint, Prettier (owns all formatting; `eslint-config-prettier` turns off ESLint's formatting rules)
- **Pre-commit hooks**: Husky + lint-staged

Dependency versions live in `package.json`.

## Project Structure

```
cbwigs/
├── src/                          # All source code (Vite root)
│   ├── js/                       # One module per feature, plus:
│   │   ├── main.js               # Single entry point — imports all modules + CSS
│   │   ├── draggable-infinite-slider-standalone.js  # Standalone build (no main.js)
│   │   └── swipeslider.js        # Uses bundled Swiper
│   ├── styles/                   # CSS modules
│   │   ├── main.css              # Imported by main.js; aggregates all CSS
│   │   └── *.css                 # Per-feature stylesheets
│   └── *.html                    # Local demo/test pages (not deployed)
├── external/
│   └── src/
│       └── worker.js             # Cloudflare Worker — manifest-based asset router
├── docs/                         # Feature documentation (Markdown)
├── dist/                         # Vite build output (committed; manifest is gitignored)
│   ├── js/main.[hash].js
│   ├── css/style.[hash].css
│   └── .vite/manifest*.json      # manifest.json + manifest.standalone.json, read by the Worker
├── vite.config.js
├── wrangler.toml
├── eslint.config.js
├── postcss.config.js
├── check-parallax.js             # Standalone Node script (not part of Vite build)
├── webflow-swiper.js             # Standalone Swiper reference/init script
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
npm run build    # vite build && vite build --mode standalone → ./dist (JS → dist/js/, CSS → dist/css/, manifests → dist/.vite/)
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
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token — authenticates calls to the Cloudflare API (used by `wrangler` when running `npm run deploy` to publish the Worker) |

Create `.env` in the repo root with this variable before deploying (there is no template file). Never put token values in tracked files.

Webflow access for AI tools goes through the hosted Webflow connector (OAuth); there is no local Webflow MCP server or Webflow API token in this repo.

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

The Worker reads and merges `dist/.vite/manifest.json` and `dist/.vite/manifest.standalone.json` at request time to resolve hashed filenames. Stable URL aliases (`/main.js`, `/js/main.js`, `/main.css`, `/css/main.css`, `/draggable-slider.js`, `/js/draggable-slider.js`, `/parallax-image.js`, `/parallax-image.css`) serve the matching hashed file's contents directly (no redirect). All responses include `Access-Control-Allow-Origin: *`.

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
- **Entry pattern**: Feature files export a named `init*()` function that `main.js` imports and calls inside its `DOMContentLoaded` listener, and do not also initialize themselves. Use this pattern for new features. Exceptions: `youtube-player.js`, `lightbox-setup.js`, and `locale-switch.js` register their own `DOMContentLoaded` listener and are imported for side effects only.
- **Quotes**: single; **semi**: always; **indent**: 2 spaces; **no trailing commas** (enforced by Prettier via `.prettierrc`; don't add formatting rules to ESLint — they fight Prettier in the pre-commit hook)
- **CSS**: PostCSS nesting syntax is supported; avoid conflicting with Webflow-generated class names; prefer specific selectors

## Architecture Notes

- The Worker is purely a static asset router — it never caches responses for non-hashed paths (`no-cache`). Do not add server-side logic that assumes persistent state.
- Vite manifest mode is critical: `build.manifest: true` in vite.config.js is what enables the Worker's manifest lookup. Do not disable it.
- In the main build, CSS code-splitting is disabled (`cssCodeSplit: false`) — all styles land in a single `dist/css/style.[hash].css` file.
- Module preload is disabled (`modulePreload: false`) — the site loads one flat JS bundle, not a module graph.
- Webflow embeds the bundles as classic `<script>` tags (not `type="module"`), so every bundle is wrapped in its own function scope (`format: 'iife'` for `main.js`, a `banner`/`footer` wrapper for the standalone pass). Unwrapped output leaks minified top-level names onto `window` and once overwrote jQuery's `$`. Standalone entries must therefore have no `import`/`export` left after bundling.
- Production builds strip `console.log`/`info`/`debug` (terser `pure_funcs`); use `console.warn`/`console.error` for anything that should reach the browser console.
- Standalone files for pages that don't load `main.js` are built in a second pass (`--mode standalone`): `draggable-infinite-slider-standalone.js` → `/draggable-slider.js`, `parallax-image-standalone.js` → `/parallax-image.js`, `styles/parallax-image.css` → `/parallax-image.css`. Each `*-standalone.js` entry does the auto-init and exposes `window.*` helpers; the feature module it wraps must not auto-init, or pages with `main.js` would initialize it twice. They share modules with `main.js`, so they must stay out of the main build's `input` — adding them there would split the shared code into chunks and `main.js` would no longer be one flat file.
- Flodesk form text customization in `main.js` uses a retry loop (up to 10 × 500ms attempts) because the Flodesk embed loads asynchronously after `DOMContentLoaded`.

## What Not to Do

- **Do not import GSAP or any GSAP plugin.** They are globals registered by Webflow. Importing them will create a second GSAP instance and break animations.
- **Do not run `npm run deploy` without first verifying the build output** — this deploys directly to production.
- **Do not add CSS that targets Webflow class names like `.w-*` or `.wf-*`** — these are internal Webflow classes and may change.
- **Do not split the main build's CSS output** — `cssCodeSplit: false` is intentional; the Worker alias `/main.css` expects a single CSS file.
- **Do not disable the Vite manifest** (`build.manifest: true`) — the Worker depends on it to resolve hashed filenames.
- **Do not commit source changes without the matching `dist/`** — `dist/` is tracked in git (served via jsDelivr), so run `npm run build` and commit the rebuilt `dist/js` and `dist/css` with the source change. Cloudflare Workers Builds rebuilds on its own, so the committed copy only matters for the CDN.
- **Do not add new npm runtime dependencies without considering bundle size** — the final JS bundle is served to every page visitor.
