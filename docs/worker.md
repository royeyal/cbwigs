# Cloudflare Worker

Serves the built bundle to the Webflow site at URLs that never change, so a deploy goes live without touching Webflow.

| | |
|---|---|
| Source | `external/src/worker.js`, `src/public/_headers` (copied to `dist/_headers`), `wrangler.toml` |
| Deployed as | `cbwigs-assets` → `https://cbwigs-assets.roy-eyal.workers.dev` |
| Used on | Every page: site-wide head code links `/main.css`, footer code loads `/js/main.js` |
| Depends on | The Vite manifest (`dist/.vite/manifest.json`, needs `build.manifest: true`) and the `ASSETS` binding to `dist/` |

## Requests

| Path | Handled by | Response |
|---|---|---|
| `/main.js`, `/js/main.js` | Worker | Contents of the current `dist/js/main.[hash].js` (no redirect) |
| `/main.css`, `/css/main.css` | Worker | Contents of the current `dist/css/style.[hash].css` |
| A file that exists in `dist/` (e.g. `/js/main.[hash].js`) | Static-assets layer; the Worker never runs | Headers from `_headers` |
| Anything else | Worker | The assets layer's 404, with `no-cache` |
| `OPTIONS` (any path) | Worker | Empty CORS preflight response |

For an alias, the Worker reads the manifest on each request and looks up the entry by key: `js/main.js` for JS (Vite's root is `src/`, so the key has no `src/`; the Worker reaches it on its last preferred key) and `style.css` for CSS. If no key matches, it falls back to any manifest entry with a CSS file, then to any file whose name contains `main`.

## Headers

| Response | `Cache-Control` | CORS |
|---|---|---|
| Aliases | `public, max-age=0, must-revalidate`: browsers revalidate on every load, so a deploy shows up at once | `Access-Control-Allow-Origin: *` (set by the Worker) |
| Hashed `/js/*`, `/css/*` | `public, max-age=31536000, immutable` (from `_headers`) | `Access-Control-Allow-Origin: *` (from `_headers`) |
| 404s from the Worker | `no-cache` | `*` |

`_headers` applies only to files served straight from `dist/`, never to the Worker's responses, which is why the Worker sets the alias headers itself. Webflow must keep linking the aliases: a hashed URL would pin that build for a year.

## Deploying

Merging to `main` deploys through Cloudflare Workers Builds; other branches get a preview version. See **Deploy** and **Verifying a Change** in [`AGENTS.md`](../AGENTS.md). The Worker keeps no state; don't add logic that assumes it does.
