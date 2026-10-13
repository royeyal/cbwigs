# Copy Email Button

A button that copies an email address to the clipboard and shows a "copied" state.

| | |
|---|---|
| Source | `src/js/copy-email-to-clipboard-button.js`, `src/styles/copy-email-to-clipboard-button.css` |
| Loaded by | `main.js` → `initCopyEmailClipboard()` |
| Used on | `/contact-us` (and `/en`) |
| Depends on | Clipboard API (HTTPS only) |

## Webflow setup

```
.copy-email-button  [data-copy-email="name@example.com"]   ← optional; else the text below is used
├── .copy-email-icon__wrap
└── … .copy-email-text__el ×3                               ← stacked labels: address / (unused) / copied
    └── [data-copy-email-element]                          ← element whose text is the address
```

Either `data-copy-email` on the button or a `[data-copy-email-element]` inside it must exist. If neither does, the click throws.

## Behavior

- Hover and keyboard focus use the shared button fill (see [button-hover.md](button-hover.md)); the label stays on the address.
- Click, Enter or Space copies the address and sets `data-copy-button="copied"` on the button. The button stays filled and the label stack moves to its third line ("הועתק!" / "Copied!").
- The state resets on mouse-leave or blur. The `aria-label` switches between "Copy email to clipboard" and "Email copied to clipboard!" (English only).
