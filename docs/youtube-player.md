# YouTube Player (inline)

Turns a `div` into a click-to-play YouTube embed: thumbnail and a glass play button first, the real player only after a click. Supports 16:9 videos and 9:16 Shorts. For the hero modal, see [youtube-lightbox.md](youtube-lightbox.md).

| | |
|---|---|
| Source | `src/js/youtube-player.js`, `src/styles/youtube-player.css` |
| Loaded by | `main.js` imports it for side effects; it initializes itself on `DOMContentLoaded` and again via `Webflow.push` |
| Used on | `/hairbun`, `/my-original`, the six `/events/*` pages (and `/en` versions) |
| Depends on | YouTube IFrame API (loaded by the script) |
| Demo | `src/youtube-player-demo.html` |

## Webflow setup

```html
<div class="youtube-player" data-youtube-id="VIDEO_ID" data-youtube-short="false"></div>
```

| Attribute | Value |
|---|---|
| `data-youtube-id` | 11-character ID, or a `watch?v=`, `youtu.be/`, `/shorts/` or `/embed/` URL |
| `data-youtube-short` | `"false"` → 16:9 video. Anything else, **or no attribute at all** → 9:16 Short |

Always set `data-youtube-short` explicitly. The default is Short, which surprises people (all live pages set it). In a Webflow component, bind both attributes to component properties.

Suggested `youtube-player` class settings in the Designer: relative position, 100% width, black background, 12px radius, `overflow: hidden` (keeps the play button inside). For Shorts, add the `youtube-short` combo class with `max-width: 400px` and auto side margins to center it. In the Designer and Editor (`.wf-design-mode`, `.w-editor`) the CSS shows a labelled placeholder with the right aspect ratio.

## Behavior

- The script adds `.youtube-video` or `.youtube-short`, marks the element `data-youtube-initialized`, and injects a thumbnail (`maxresdefault`, falling back to `hqdefault`) with a play button.
- Clicking (or Enter/Space on the button) creates the IFrame player in `.youtube-iframe-container` and autoplays.
- The stop button (`.youtube-stop-button`) or `Escape` anywhere on the page destroys the player and restores the thumbnail.
- CSS respects `prefers-reduced-motion` and `prefers-contrast: more`.

## JavaScript API

The module exposes a singleton for content added after load:

```js
window.youtubePlayer().reinitialize();            // pick up new [data-youtube-id] elements
window.youtubePlayer().destroyPlayer(container);  // one player
window.youtubePlayer().destroyAllPlayers();
```

## Using it next to the lightbox

Both modules can be on one page (`/hairbun`, `/my-original`). They share one copy of the YouTube API: the lightbox chains its ready-callback onto the player's. Keep their attributes apart: `data-youtube-id` here, `data-youtube-lightbox-id` on hero sections.

## Known issues

- The YouTube API script (`iframe_api` plus `www-widgetapi.js`) loads on every page, including the ~26 pages with no video, because the constructor loads it before checking for players.
