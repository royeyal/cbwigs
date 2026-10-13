# Relume Container Overrides

CSS-only. Overrides Webflow's values for three Relume layout classes on every page. `main.css` loads after the Webflow stylesheet, so these values win.

| | |
|---|---|
| Source | `src/styles/relume-container.css` |
| Loaded by | `main.css` |
| Used on | Every page |

| Class | < 478px | ≥ 478px | ≥ 768px | ≥ 992px |
|---|---|---|---|---|
| `.padding-global` (left/right) | 1.25rem | 2rem | 2.5rem | 2.5rem |
| `.padding-section-large` (top/bottom) | 5rem | 5rem | 7rem | 9rem |
| `.container-large` | `max-width: 80rem`, centered | | | |

Webflow's own values differ (for example `.padding-global` is 5% there), so **removing this file changes the layout site-wide**. If you want Webflow to be the single source of truth, copy these values into the classes in the Designer first, then delete the file.
