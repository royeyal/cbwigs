# AGENTS.md

## Project Overview

This project provides custom JavaScript and CSS for **cbwigs.co.il**, a Hebrew/English bilingual Webflow e-commerce site selling wigs. The code is authored locally, bundled with Vite, and served via a Cloudflare Worker that resolves hashed asset filenames from Vite's manifest. Webflow pages reference the Cloudflare-hosted URLs directly via custom code embeds — the HTML structure is entirely managed inside Webflow, not in this repo.

The Webflow site is served at **https://cbwigs.webflow.io**. As of 2026-09-26, `cbwigs.co.il` itself still serves the old WordPress site, so test on `cbwigs.webflow.io`. It loads the **production** Worker, so anything deployed to production is live there immediately.

## Stack

- **Runtime**: Browser; source is vanilla ES modules, shipped as classic-script IIFE bundles (see **Architecture Notes**); no Node.js runtime code
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
│   │   ├── draggable-infinite-slider-standalone.js  # Standalone entry → /draggable-slider.js
│   │   ├── parallax-image-standalone.js             # Standalone entry → /parallax-image.js
│   │   └── swipeslider.js        # Uses bundled Swiper
│   ├── styles/                   # CSS modules
│   │   ├── main.css              # Imported by main.js; aggregates all CSS
│   │   └── *.css                 # Per-feature stylesheets
│   ├── public/_headers           # Static-asset response headers; Vite copies it to dist/_headers
│   └── *.html                    # Local demo/test pages (not deployed)
├── external/
│   └── src/
│       └── worker.js             # Cloudflare Worker — manifest-based asset router
├── docs/                         # Feature documentation (Markdown)
├── dist/                         # Vite build output (committed; manifest is gitignored)
│   ├── js/main.[hash].js         # + draggable-slider.[hash].js, parallax-image.[hash].js
│   ├── css/style.[hash].css      # + parallax-image-css.[hash].css
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
Deploys run automatically through Cloudflare Workers Builds (Git integration), so **merging to `main` is a production deploy**:

| Push to | Build command | Then | Result |
|---|---|---|---|
| `main` | `npm ci && npm run build` | `npx wrangler deploy` | Production: `https://cbwigs-assets.roy-eyal.workers.dev` |
| any other branch | `npm ci && npm run build` | `npx wrangler versions upload` | Preview only: `https://<first 8 chars of version ID>-cbwigs-assets.roy-eyal.workers.dev` (printed as "Version Preview URL" in the build log) |

The result appears on the PR as the **Workers Builds: cbwigs-assets** check. The GitHub check has no log text; read the log in the Cloudflare dashboard or via the API (see **Verifying a Change**).

Manual deploy (rarely needed; also production):
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
ESLint, Stylelint and `prettier --check` all pass with zero errors on `main`; keep it that way. When a Stylelint rule is a genuine false positive (e.g. `no-descending-specificity` between selectors that target different elements), use a scoped `stylelint-disable … -- <reason>` / `stylelint-enable` pair, not a config change.

## Verifying a Change
1. `npm run build`, then confirm `dist/` matches the source (the pre-commit hook reformats staged files, so rebuild after committing and check `git status` is clean).
2. Push a branch and open a PR; wait for the Workers Builds check and take the preview URL from its log.
3. Test the preview against the real staging page, not just the demo HTML: fetch `https://cbwigs.webflow.io/` HTML, replace `https://cbwigs-assets.roy-eyal.workers.dev` with the preview host, and load it in a same-origin `<iframe srcdoc>` (add `<base href="https://cbwigs.webflow.io/">`). Every Webflow script (jQuery, `webflow.js`, GSAP) runs first, exactly as in production, in a fresh `window`. Don't use `document.write` for this — it keeps the previous page's globals and listeners.
4. After merging, confirm the production build succeeded, that each alias's bytes match the committed `dist/` file, and — when touching the Worker or `_headers` — that `curl -D -` shows the expected `Cache-Control` and `Access-Control-Allow-Origin` on both an alias and a hashed file.

Build logs: `GET https://api.cloudflare.com/client/v4/accounts/c84d1e6f99329d834a7cb284c20292dd/builds/builds/<build_uuid>/logs` with `Authorization: Bearer $CLOUDFLARE_API_TOKEN`. List recent builds with `…/builds/workers/190b662d178641b5b047b293b312d17f/builds`.

## Cloudflare Specifics

- **Worker name**: `cbwigs-assets` — `https://cbwigs-assets.roy-eyal.workers.dev` (no custom domain)
- **Account ID**: `c84d1e6f99329d834a7cb284c20292dd`
- **Main entry**: `external/src/worker.js`
- **Assets binding**: `ASSETS` → serves files from `./dist`
- **Compatibility date**: `2025-09-06`
- **No KV namespaces, D1, or custom routes configured**
- **Build Node version**: comes only from `.node-version`. Don't add a `NODE_VERSION` build variable to either Workers Builds trigger — it overrides `.node-version`.

The Worker reads and merges `dist/.vite/manifest.json` and `dist/.vite/manifest.standalone.json` at request time to resolve hashed filenames. Stable URL aliases (`/main.js`, `/js/main.js`, `/main.css`, `/css/main.css`, `/draggable-slider.js`, `/js/draggable-slider.js`, `/parallax-image.js`, `/parallax-image.css`) serve the matching hashed file's contents directly (no redirect), with `Access-Control-Allow-Origin: *`.

Requests for a path that exists in `dist/` (e.g. `/js/main.[hash].js`) are served by Cloudflare's static-assets layer **without running the Worker**; their headers come from `src/public/_headers` (copied to `dist/_headers`): hashed `/js/*` and `/css/*` files are cached for a year (`immutable`) with CORS. `_headers` is not applied to the Worker's responses, so the Worker sets the alias headers itself. The Worker only handles the aliases above and paths that don't match a file (`no-cache` 404s). Webflow pages must reference the aliases, not hashed paths — a hashed URL would keep serving that exact build for a year.

## Webflow Specifics

- **Site ID**: `68b19e69d4dbfaf52f92045b`
- **Workspace ID**: `69637b73ed5f53706ed27832`
- Webflow manages all HTML structure and base styles; this repo only provides JS/CSS loaded via custom code embeds
- **How pages load this repo's files**: `<link rel="stylesheet" href="…workers.dev/main.css">` in the head, and `<script src="…workers.dev/js/main.js">` at the end of the body — a **classic** script (no `type="module"`), after jQuery, `webflow.js` and GSAP with Flip, ScrollTrigger, SplitText, Draggable, InertiaPlugin and CustomEase (Webflow controls these versions).
- **Where those embeds are configured**: Site settings → Custom code (site-level freeform code, not registered scripts). Head: the `main.css` link plus the Flodesk loader script; footer: the `main.js` script. Deploying new JS/CSS needs **no** Webflow publish — the aliases always serve the latest build — but changing the embed code itself only goes live after the site is published.
- A Flodesk signup form is embedded in the site footer, so it is on every page.
- **Webflow MCP access**: through the hosted claude.ai Webflow connector (OAuth), authorized for the cbwigs workspace (site `CBWigs`, short name `cbwigs`). The connector only sees workspaces chosen at authorization; if the site ID returns 404, the connector needs re-authorizing, not a different ID. Reading site custom code (`data_scripts_tool` → `get_site_freeform_code`) is safe; writing it or publishing changes the live site, so confirm with the user first.
- The site is bilingual: Hebrew is the primary locale (`lang="he"`, no path prefix) and English is secondary (`lang="en-US"`, under `/en`). Code reads `document.documentElement.lang` at runtime — match with `startsWith('he')` / `startsWith('en')`, never equality with `'en'`
- Hebrew is RTL; CSS and JS must account for both LTR and RTL layouts

## Code Conventions

- **Module format**: ESM (`"type": "module"` in package.json); use `import`/`export` throughout
- **No TypeScript** — plain `.js` files only
- **GSAP globals**: `gsap`, `ScrollTrigger`, `SplitText`, `Draggable`, `InertiaPlugin`, `Flip`, `CustomEase` are loaded globally by Webflow. **Never import them.** Declared as `readonly` globals in ESLint config.
- **Swiper**: Imported as an ES module from the `swiper` package — the only bundled runtime dependency
- **DOM selection**: Use `data-*` attributes for selectors, not class names, following Webflow convention
- **Defensive init**: Every `init*()` function must check for element existence before running (e.g. `if (!elements.length) return;`)
- **Entry pattern**: Feature files export a named `init*()` function that `main.js` imports and calls inside its `DOMContentLoaded` listener, and do not also initialize themselves. Use this pattern for new features. Exceptions: `youtube-player.js`, `lightbox-setup.js`, and `locale-switch.js` register their own `DOMContentLoaded` listener and are imported for side effects only.
- **Quotes**: single; **semi**: always; **indent**: 2 spaces; **no trailing commas** (enforced by Prettier via `.prettierrc`; don't add formatting rules to ESLint — they fight Prettier in the pre-commit hook)
- **CSS**: PostCSS nesting syntax is supported; avoid conflicting with Webflow-generated class names; prefer specific selectors

## Architecture Notes

- The Worker is purely a static asset router. Do not add server-side logic that assumes persistent state. It sets `Cache-Control: public, max-age=0, must-revalidate` on alias responses explicitly, so browsers revalidate on every load and pick up a deploy immediately; don't let the year-long cache headers of the hashed files reach the aliases.
- Vite manifest mode is critical: `build.manifest: true` in vite.config.js is what enables the Worker's manifest lookup. Do not disable it.
- In the main build, CSS code-splitting is disabled (`cssCodeSplit: false`) — all styles land in a single `dist/css/style.[hash].css` file.
- Module preload is disabled (`modulePreload: false`) — the site loads one flat JS bundle, not a module graph.
- Webflow embeds the bundles as classic `<script>` tags (not `type="module"`), so every bundle is wrapped in its own function scope (`format: 'iife'` for `main.js`, a `banner`/`footer` wrapper for the standalone pass). Unwrapped output puts its minified top-level names on `window`, where they overwrite page globals such as jQuery's `$`. Standalone entries must therefore have no `import`/`export` left after bundling.
- Production builds strip `console.log`/`info`/`debug` (terser `pure_funcs`); use `console.warn`/`console.error` for anything that should reach the browser console.
- Standalone files for pages that don't load `main.js` are built in a second pass (`--mode standalone`): `draggable-infinite-slider-standalone.js` → `/draggable-slider.js`, `parallax-image-standalone.js` → `/parallax-image.js`, `styles/parallax-image.css` → `/parallax-image.css`. Each `*-standalone.js` entry does the auto-init and exposes `window.*` helpers; the feature module it wraps must not auto-init, or pages with `main.js` would initialize it twice. They share modules with `main.js`, so they must stay out of the main build's `input` — adding them there would split the shared code into chunks and `main.js` would no longer be one flat file.
- Flodesk form localization lives in `flodesk.js` (`initFlodeskPrivacyText`, called from `main.js`). It retries up to 10 × 500ms because the embed renders after `DOMContentLoaded`, then observes only the Flodesk `<form>` for validation messages. Don't observe `document.body`: sliders, SplitText and GSAP mutate the DOM constantly, so a page-wide observer runs its callback all the time.

## What Not to Do

- **Do not import GSAP or any GSAP plugin.** They are globals registered by Webflow. Importing them will create a second GSAP instance and break animations.
- **Do not merge to `main` (or run `npm run deploy`) without verifying the change first** — both deploy to production, and `cbwigs.webflow.io` picks it up immediately. Verify on the PR's preview URL (see **Verifying a Change**).
- **Do not add CSS that targets Webflow class names like `.w-*` or `.wf-*`** — these are internal Webflow classes and may change. The existing exceptions are deliberate: `.w-richtext a` (rich-text links have no other hook) and `.wf-design-mode` / `.w-editor` (placeholders shown only in the Designer).
- **Do not split the main build's CSS output** — `cssCodeSplit: false` is intentional; the Worker alias `/main.css` expects a single CSS file.
- **Do not disable the Vite manifest** (`build.manifest: true`) — the Worker depends on it to resolve hashed filenames.
- **Do not commit source changes without the matching `dist/`** — `dist/` is tracked in git, so run `npm run build` and commit the rebuilt `dist/` with the source change — everything except the gitignored `.vite/` manifests, including `dist/_headers` when `src/public/` changes. Keeping `dist/` in git is an owner decision: the site itself loads from the Worker, which Workers Builds rebuilds on every deploy, and nothing on the staging pages or in `docs/` loads `dist/` from the repo.
- **Do not add new npm runtime dependencies without considering bundle size** — the final JS bundle is served to every page visitor.
- **Do not rely on top-level declarations to make something global** — the bundles are minified and wrapped in a function scope, so top-level names never reach `window`. Expose anything page code must call as an explicit `window.name = …` inside the bundle, as the standalone entries do.
