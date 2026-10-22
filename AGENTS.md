# AGENTS.md

## Project Overview

This project provides custom JavaScript and CSS for **cbwigs.co.il**, a Hebrew/English bilingual Webflow e-commerce site selling wigs. The code is authored locally, bundled with Vite, and served via a Cloudflare Worker that resolves hashed asset filenames from Vite's manifest. Webflow pages reference the Cloudflare-hosted URLs directly via custom code embeds — the HTML structure is entirely managed inside Webflow, not in this repo.

The Webflow site is live at **https://www.cbwigs.co.il** (the domain moved from the old WordPress site; checked 2026-10-21) and is also served at **https://cbwigs.webflow.io**. Both load the production Worker, so anything deployed to production is live immediately.

## Stack

- **Runtime**: Browser; source is vanilla ES modules, shipped as classic-script IIFE bundles (see **Architecture Notes**); no Node.js runtime code
- **Build Node.js**: 24, pinned in `.node-version` (Cloudflare Workers Builds reads it; cssnano 9 fails on Node 20)
- **Build tool**: Vite (ESM, manifest mode)
- **Runtime dependencies**: none; every bundled module is this repo's own code (GSAP comes from Webflow as globals)
- **Deployment target**: Cloudflare Workers (static assets via `ASSETS` binding)
- **Worker tooling**: `wrangler` CLI; compatibility date `2025-09-06`
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
│   │   └── snap-slider.js        # Native scroll-snap slider (/hairbun); replaced Swiper
│   ├── styles/                   # CSS modules
│   │   ├── main.css              # Imported by main.js; aggregates all CSS
│   │   └── *.css                 # Per-feature stylesheets
│   ├── public/_headers           # Static-asset response headers; Vite copies it to dist/_headers
│   └── *.html                    # Local demo/test pages (not deployed)
├── .github/workflows/
│   └── prune-branches.yml        # Daily: deletes branches idle 14+ days with no open PR
├── external/
│   └── src/
│       └── worker.js             # Cloudflare Worker — manifest-based asset router
├── docs/                         # One <component>.md per source module; docs/README.md is the index (and GitHub front page)
├── dist/                         # Vite build output (committed; manifest is gitignored)
│   ├── js/main.[hash].js
│   ├── css/style.[hash].css
│   └── .vite/manifest.json       # Read by the Worker
├── vite.config.js
├── wrangler.toml
├── eslint.config.js
├── postcss.config.js
├── check-parallax.js             # Standalone Node script (not part of Vite build)
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
npm run build    # vite build → ./dist (JS → dist/js/, CSS → dist/css/, manifest → dist/.vite/)
npm run clean    # rm -rf dist
```

### Test / Lint
```bash
npm run lint        # ESLint src/ --fix
npm run lint:css    # Stylelint src/**/*.css --fix
npm run format      # Prettier on src/**/*.{js,css}
npm run preview     # Vite preview server for the built dist/
```
ESLint, Stylelint and `prettier --check` all pass with zero errors on `main`; keep it that way. When a Stylelint rule is a genuine false positive (e.g. `no-descending-specificity` between selectors that target different elements), use a scoped `stylelint-disable … -- <reason>` / `stylelint-enable` pair, not a config change.

### Deploy
Deploys run automatically through Cloudflare Workers Builds (Git integration), so **merging to `main` is a production deploy**:

| Push to | Build command | Then | Result |
|---|---|---|---|
| `main` | `npm ci && npm run build` | `npx wrangler deploy` | Production: `https://cbwigs-assets.roy-eyal.workers.dev` |
| any other branch | `npm ci && npm run build` | `npx wrangler versions upload` | Preview only: `https://<first 8 chars of version ID>-cbwigs-assets.roy-eyal.workers.dev` (printed as "Version Preview URL" in the build log) |

The result appears on the PR as the **Workers Builds: cbwigs-assets** check. The GitHub check has no log text; read the log in the Cloudflare dashboard or via the API (see **Verifying a Change**).

Branches are disposable: a daily GitHub Action (`.github/workflows/prune-branches.yml`) deletes every remote branch except `main` whose last commit is more than 14 days old and that has no open PR. A merged PR keeps its history, and a deleted branch can be restored from its PR page. Run it by hand from the Actions tab, with **dry_run** to list what it would delete.

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

The Worker reads `dist/.vite/manifest.json` at request time to resolve hashed filenames. Stable URL aliases (`/main.js`, `/js/main.js`, `/main.css`, `/css/main.css`) serve the matching hashed file's contents directly (no redirect), with `Access-Control-Allow-Origin: *`.

Requests for a path that exists in `dist/` (e.g. `/js/main.[hash].js`) are served by Cloudflare's static-assets layer **without running the Worker**; their headers come from `src/public/_headers` (copied to `dist/_headers`): hashed `/js/*` and `/css/*` files are cached for a year (`immutable`) with CORS. `_headers` is not applied to the Worker's responses, so the Worker sets the alias headers itself. The Worker only handles the aliases above and paths that don't match a file (`no-cache` 404s). Webflow pages must reference the aliases, not hashed paths — a hashed URL would keep serving that exact build for a year.

## Webflow Specifics

- **Site ID**: `68b19e69d4dbfaf52f92045b`
- **Workspace ID**: `69637b73ed5f53706ed27832`
- Webflow manages all HTML structure and base styles; this repo only provides JS/CSS loaded via custom code embeds
- **How pages load this repo's files**: `<link rel="stylesheet" href="…workers.dev/main.css">` in the head, and `<script src="…workers.dev/js/main.js">` at the end of the body — a classic script (no `type="module"`), after jQuery, `webflow.js` and GSAP with Flip, ScrollTrigger, SplitText, Draggable, InertiaPlugin and CustomEase (Webflow controls these versions).
- **Where those embeds are configured**: Site settings → Custom code (site-level freeform code, not registered scripts). Head: the `main.css` link plus the Flodesk loader script; footer: the `main.js` script. Deploying new JS/CSS needs no Webflow publish — the aliases always serve the latest build — but changing the embed code itself only goes live after the site is published.
- A Flodesk signup form is embedded in the site footer, so it is on every page.
- **Webflow MCP access**: through the hosted claude.ai Webflow connector (OAuth), authorized for the cbwigs workspace (site `CBWigs`, short name `cbwigs`). The connector only sees workspaces chosen at authorization; if the site ID returns 404, the connector needs re-authorizing, not a different ID. Reading site custom code (`data_scripts_tool` → `get_site_freeform_code`) is safe; writing it or publishing changes the live site, so confirm with the user first.
- The site is bilingual: Hebrew is the primary locale (`lang="he"`, no path prefix) and English is secondary (`lang="en-US"`, under `/en`). Code reads `document.documentElement.lang` at runtime — match with `startsWith('he')` / `startsWith('en')`, never equality with `'en'`
- Hebrew is RTL; CSS and JS must account for both LTR and RTL layouts

## Code Conventions

- **Module format**: ESM (`"type": "module"` in package.json); use `import`/`export` throughout
- **No TypeScript** — plain `.js` files only
- **GSAP globals**: `gsap`, `ScrollTrigger`, `SplitText`, `Draggable`, `InertiaPlugin`, `Flip`, `CustomEase` are loaded globally by Webflow. **Never import them.** Declared as `readonly` globals in ESLint config.
- **DOM selection**: Use `data-*` attributes for selectors, not class names, following Webflow convention. One deliberate exception: `textreveal.js` reveals every `h2.heading-style-h1` / `h2.heading-style-h2` automatically, so section titles need no attribute (see `docs/text-reveal.md`). Don't add a per-element attribute requirement back for something that applies to a whole class of elements
- **Defensive init**: Every `init*()` function must check for element existence before running (e.g. `if (!elements.length) return;`)
- **Entry pattern**: Feature files export a named `init*()` function that `main.js` imports and calls inside its `DOMContentLoaded` listener, and do not also initialize themselves. Use this pattern for new features. Exceptions: `youtube-player.js`, `lightbox-setup.js`, and `locale-switch.js` register their own `DOMContentLoaded` listener and are imported for side effects only.
- **Quotes**: single; **semi**: always; **indent**: 2 spaces; **no trailing commas** (enforced by Prettier via `.prettierrc`; don't add formatting rules to ESLint — they fight Prettier in the pre-commit hook)
- **CSS**: PostCSS nesting syntax is supported; avoid conflicting with Webflow-generated class names; prefer specific selectors
- **Docs**: every module in `src/js/` and every CSS-only feature in `src/styles/` is covered by a doc in `docs/` (header table: source, loaded by, pages, dependencies), and `docs/README.md` maps components to docs. Update the doc in the same change as the code

## Architecture Notes

- The Worker is purely a static asset router. Do not add server-side logic that assumes persistent state. It sets `Cache-Control: public, max-age=0, must-revalidate` on alias responses explicitly, so browsers revalidate on every load and pick up a deploy immediately; don't let the year-long cache headers of the hashed files reach the aliases.
- Vite manifest mode is critical: `build.manifest: true` in vite.config.js is what enables the Worker's manifest lookup. Do not disable it.
- In the main build, CSS code-splitting is disabled (`cssCodeSplit: false`) — all styles land in a single `dist/css/style.[hash].css` file.
- Module preload is disabled (`modulePreload: false`) — the site loads one flat JS bundle, not a module graph.
- Webflow embeds the bundles as classic `<script>` tags (not `type="module"`), so the bundle is wrapped in its own function scope (`format: 'iife'`). Unwrapped output puts its minified top-level names on `window`, where they overwrite page globals such as jQuery's `$`.
- Production builds strip `console.log`/`info`/`debug` (terser `pure_funcs`); use `console.warn`/`console.error` for anything that should reach the browser console.
- Flodesk form localization lives in `flodesk.js` (`initFlodeskPrivacyText`, called from `main.js`). It retries up to 10 × 500ms because the embed renders after `DOMContentLoaded`, then observes only the Flodesk `<form>` for validation messages. Don't observe `document.body`: sliders, SplitText and GSAP mutate the DOM constantly, so a page-wide observer runs its callback all the time.

## What Not to Do

- **Do not import GSAP or any GSAP plugin.** They are globals registered by Webflow. Importing them will create a second GSAP instance and break animations.
- **Do not merge to `main` (or run `npm run deploy`) without verifying the change first** — both deploy to production, and the live site picks it up immediately. Verify on the PR's preview URL (see **Verifying a Change**).
- **Do not add CSS that targets Webflow class names like `.w-*` or `.wf-*`** — these are internal Webflow classes and may change. The existing exceptions are deliberate: `.w-richtext a` (rich-text links have no other hook) and `.wf-design-mode` / `.w-editor` (placeholders shown only in the Designer).
- **Do not split the main build's CSS output** — `cssCodeSplit: false` is intentional; the Worker alias `/main.css` expects a single CSS file.
- **Do not disable the Vite manifest** (`build.manifest: true`) — the Worker depends on it to resolve hashed filenames.
- **Do not commit source changes without the matching `dist/`** — `dist/` is tracked in git, so run `npm run build` and commit the rebuilt `dist/` with the source change — everything except the gitignored `.vite/` manifests, including `dist/_headers` when `src/public/` changes. Keeping `dist/` in git is an owner decision: the site itself loads from the Worker, which Workers Builds rebuilds on every deploy, and nothing on the staging pages or in `docs/` loads `dist/` from the repo.
- **Do not add new npm runtime dependencies without considering bundle size** — the final JS bundle is served to every page visitor.
- **Do not rely on top-level declarations to make something global** — the bundles are minified and wrapped in a function scope, so top-level names never reach `window`. Expose anything page code must call as an explicit `window.name = …` inside the bundle, as `youtube-player.js` does.
