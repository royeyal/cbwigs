# Dynamic Current Year

Writes the current year into any element with `data-current-year`. Used for the footer copyright line.

| | |
|---|---|
| Source | `src/js/dynamic-current-year.js` |
| Loaded by | `main.js` → `initDynamicCurrentYear()` |
| Used on | Every page (footer) |
| Depends on | Nothing |

## Webflow setup

Add `data-current-year` (no value) to a text span. Put a sensible year in the Designer as fallback text; the script replaces it on load.
