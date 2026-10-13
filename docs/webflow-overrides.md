# Webflow Rich Text Overrides

Small CSS overrides for Webflow rich-text blocks.

| | |
|---|---|
| Source | `src/styles/webflow.css` |
| Loaded by | `main.css` |
| Used on | Any page with a Rich Text element (terms, accessibility, event pages) |

| Rule | Effect |
|---|---|
| `.w-richtext p` | 0.5rem bottom margin, none on the last paragraph |
| `.w-richtext a` | Accent-400 color, darkens to accent-600 on hover (the animated underline is in [underline-links.md](underline-links.md)) |
| `.w-richtext ol`, `ul`, `li` | Logical `padding-inline-start`, so list indents sit on the correct side in RTL |
