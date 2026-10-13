# YouTube Lightbox

Click the play icon in a hero section to open a YouTube video in a full-screen modal. For inline players, see [youtube-player.md](youtube-player.md).

| | |
|---|---|
| Source | `src/js/youtube-lightbox.js`, `src/styles/youtube-lightbox.css` |
| Loaded by | `main.js` → `initYouTubeLightbox()` |
| Used on | `/`, `/about`, `/hairbun`, `/my-original` (and `/en` versions) |
| Depends on | YouTube IFrame API (loaded by the script, only on pages with a hero video) |

## Webflow setup

```
section.section-hero-lightbox [data-youtube-lightbox-id="VIDEO_ID"]
└── … .hero_lightbox
        ├── img.hero_lightbox-thumbnail
        └── .lightbox-play-icon            ← the click target
```

- The attribute is **`data-youtube-lightbox-id`**. It can sit on the section, `.hero_lightbox` or `.lightbox-play-icon` (checked in that order). Value: an 11-character ID or a `youtube.com/watch?v=`, `youtu.be/` or `/embed/` URL.
- Don't use `data-youtube-id` here: that attribute belongs to the inline player and would embed a second player in the section.
- Multiple hero sections per page are fine; each uses its own ID.

## Behavior

- The modal (`.youtube-lightbox-modal`, built once and appended to `<body>`) contains a backdrop, a close button and the player. It autoplays with related videos limited to the same channel (`rel: 0`).
- Close with the button, a backdrop click or `Escape`. Closing destroys the player, so playback stops.
- Accessibility: the play icon gets `role="button"`, `tabindex="0"` and Enter/Space support; the modal is `role="dialog"` + `aria-modal`, traps focus, focuses the close button on open and returns focus to the play icon on close. Page scroll is locked while open.

## Styling

`youtube-lightbox.css` styles the modal (`.youtube-lightbox-modal.active` shows it), the close button and the play icon's hover state. The hero layout itself is styled in Webflow.

## Known issues

- None currently. Fixed: the API script used to load on every page; it now loads only after a play icon with a valid video ID has been set up (and is preloaded then, so the first click doesn't wait for it). Fixed: `Webflow.push` re-ran the trigger setup and added a second set of click/keydown handlers to each play icon; set-up icons are now marked `data-youtube-lightbox-initialized` and skipped.
