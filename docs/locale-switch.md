# Locale Switch

Makes the "English" / "עברית" item in the navbar link to the same page in the other language.

| | |
|---|---|
| Source | `src/js/locale-switch.js` |
| Loaded by | `main.js` imports it for side effects; it initializes itself on `DOMContentLoaded` |
| Used on | Every page (navbar) |
| Depends on | Webflow Localization's `<link rel="alternate" hreflang>` tags |

## Webflow setup

A link with `data-locale-switch="true"` containing a `.nav-link__label` span. Its `href` in Webflow doesn't matter; the script overwrites it.

## Behavior

1. Reads the `hreflang` alternates Webflow puts in `<head>` (ignoring `x-default`) and picks the one whose language differs from `<html lang>`.
2. Sets the link `href` to that URL and the label to the **target** language: `English` on Hebrew pages, `עברית` on English pages.
3. If there are no alternates, it falls back to adding or removing the `/en` path prefix.

Edit the labels at the top of the file (`LABEL_EN`, `LABEL_HE`).
