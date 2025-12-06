# Using YouTube Lightbox and YouTube Player Together

## Overview
You can use both `youtube-lightbox.js` and `youtube-player.js` on the same page without conflicts. They serve different purposes:

- **youtube-lightbox.js**: Modal popup for hero sections (click play → opens modal)
- **youtube-player.js**: Inline video players (click thumbnail → plays in place)

---

## HTML Setup Examples

### 1. YouTube Lightbox (Modal) - For Hero Sections

```html
<section class="section-hero-lightbox" data-youtube-id="dQw4w9WgXcQ">
  <div class="section_hero_lightbox_component">
    <div class="hero_lightbox-wrapper">
      <div class="hero_lightbox">
        <img src="thumbnail.jpg" class="hero_lightbox-thumbnail" alt="">
        <div class="video-overlay-layer"></div>
        <div class="lightbox-play-icon">
          <svg class="icon-embed-large" viewBox="0 0 24 24">
            <path d="M8 5.14v13.72L19 12L8 5.14z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      <div class="hero_content">
        <h1>Hero Title</h1>
      </div>
    </div>
  </div>
</section>
```

**Key Classes for Lightbox:**
- `section-hero-lightbox` - Required on section
- `lightbox-play-icon` - Required on clickable trigger
- `data-youtube-id` - Add to section, hero_lightbox, or play icon

---

### 2. YouTube Player (Inline) - For Content Areas

```html
<div class="youtube-player" data-youtube-id="dQw4w9WgXcQ">
  <!-- Player will auto-generate here -->
</div>
```

**For YouTube Shorts (9:16 aspect ratio):**
```html
<div class="youtube-player youtube-short" data-youtube-id="SHORT_VIDEO_ID">
  <!-- Short video player -->
</div>
```

**Key Attributes for Inline Player:**
- `youtube-player` - Required class
- `data-youtube-id` - Required attribute with video ID
- `youtube-short` - Optional, for vertical videos

---

## Complete Page Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Both YouTube Players</title>
</head>
<body>

  <!-- LIGHTBOX MODAL IN HERO -->
  <section class="section-hero-lightbox" data-youtube-id="dQw4w9WgXcQ">
    <div class="section_hero_lightbox_component">
      <div class="hero_lightbox-wrapper">
        <div class="hero_lightbox">
          <img src="thumbnail.jpg" class="hero_lightbox-thumbnail" alt="">
          <div class="video-overlay-layer"></div>
          <div class="lightbox-play-icon">
            <svg class="icon-embed-large" viewBox="0 0 24 24">
              <path d="M8 5.14v13.72L19 12L8 5.14z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- INLINE PLAYER IN CONTENT -->
  <section class="content-section">
    <h2>Watch Our Video</h2>
    <div class="youtube-player" data-youtube-id="jNQXAC9IVRw">
      <!-- Inline player appears here -->
    </div>
  </section>

  <!-- ANOTHER INLINE PLAYER -->
  <section class="content-section">
    <h2>YouTube Short</h2>
    <div class="youtube-player youtube-short" data-youtube-id="SHORT_ID">
      <!-- Vertical short player -->
    </div>
  </section>

  <!-- Your main.js bundle loads both scripts -->
  <script src="your-main-bundle.js"></script>
</body>
</html>
```

---

## Debugging Console Output

When you load a page with both players, you'll see detailed console logs:

### Lightbox Initialization:
```
[YouTube Lightbox] Initializing...
[YouTube Lightbox] Loading YouTube API...
[YouTube Lightbox] Starting initialization sequence
[YouTube Lightbox] Found 1 hero sections
[YouTube Lightbox] Section 1: Found hero_lightbox
[YouTube Lightbox] Section 1: Found play icon
[YouTube Lightbox] Section 1: Raw video ID: dQw4w9WgXcQ
[YouTube Lightbox] Section 1: Extracted video ID: dQw4w9WgXcQ
[YouTube Lightbox] Section 1: Setup complete
```

### When Clicking Play Icon:
```
[YouTube Lightbox] Play icon clicked for video: dQw4w9WgXcQ
[YouTube Lightbox] Opening lightbox with video ID: dQw4w9WgXcQ
[YouTube Lightbox] Creating modal
[YouTube Lightbox] Showing modal
[YouTube Lightbox] Creating YouTube player
[YouTube Lightbox] Player ready
```

### Troubleshooting Tips:

**If you don't see initialization logs:**
- Check browser console for errors
- Verify main.js is loaded
- Check Network tab for script loading

**If "Found 0 hero sections" appears:**
- Section missing class `section-hero-lightbox`
- Check spelling (case-sensitive)

**If "No .hero_lightbox found":**
- Missing `hero_lightbox` div inside section
- Check HTML structure

**If "No .lightbox-play-icon found":**
- Missing play icon div
- Check class name spelling

**If "No YouTube ID found":**
- Missing `data-youtube-id` attribute
- Check attribute is on section, hero_lightbox, or play icon
- Verify video ID format (11 characters or valid URL)

**If "Play icon clicked" shows but modal doesn't open:**
- Check for JavaScript errors
- Verify YouTube API loaded successfully
- Check CSS for modal (might be hidden)

---

## API Compatibility

Both scripts safely share the YouTube IFrame API:

1. **youtube-player.js** loads first (as it's a class that auto-initializes)
2. **youtube-lightbox.js** detects existing API and preserves callbacks
3. Both scripts can coexist without conflicts

The lightbox script includes special logic to:
- Detect if API is already loaded
- Preserve existing `onYouTubeIframeAPIReady` callback
- Only load API script once

---

## Styling Guidelines

### Lightbox Modal Styling (Already Included)
```css
.youtube-lightbox-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  /* Full styling in youtube-lightbox.css */
}
```

### Hero Play Icon Styling
```css
.lightbox-play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
}

.lightbox-play-icon:hover {
  transform: translate(-50%, -50%) scale(1.1);
  background: rgba(255, 255, 255, 0.3);
}
```

### Inline Player Container Styling
```css
.youtube-player {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  /* Aspect ratio maintained by script */
}

.youtube-short {
  max-width: 400px;
  /* Vertical aspect ratio for shorts */
}
```

---

## When to Use Which?

### Use Lightbox Modal When:
✅ Hero section with large video
✅ Full-screen video experience desired
✅ Video is main focus of page
✅ Want dramatic reveal effect
✅ Need modal overlay

### Use Inline Player When:
✅ Multiple videos on same page
✅ Video is supplementary content
✅ Want video in content flow
✅ Need YouTube Shorts support
✅ Prefer minimal UI changes

---

## Performance Notes

- YouTube API loads only once for both scripts
- Lightbox creates modal on first use (lazy loading)
- Inline players lazy-load thumbnails
- Both scripts check for elements before initializing
- No performance penalty for unused features

---

## Common Mistakes to Avoid

❌ **Don't** use same video ID format for both:
```html
<!-- Wrong: Same class names -->
<div class="youtube-player lightbox-play-icon" data-youtube-id="...">
```

✅ **Do** use correct classes for each type:
```html
<!-- Correct: Lightbox -->
<section class="section-hero-lightbox" data-youtube-id="...">
  <div class="lightbox-play-icon">...</div>
</section>

<!-- Correct: Inline -->
<div class="youtube-player" data-youtube-id="..."></div>
```

❌ **Don't** add `pointer-events: none` to play icon:
```css
/* Wrong: Blocks clicks */
.lightbox-play-icon { pointer-events: none; }
```

✅ **Do** add it only to hero content:
```css
/* Correct: Content doesn't block clicks */
.hero_content { pointer-events: none; }
```

---

## Webflow-Specific Notes

1. **Both scripts auto-initialize** on page load
2. **Both reinitialize** on Webflow page transitions
3. **Add video IDs** via custom attributes panel
4. **Preview in published site** (not in Designer)
5. **Check console** for initialization logs

---

## Need Help?

Check console logs with these patterns:
- `[YouTube Lightbox]` - Modal player logs
- Look for initialization sequence
- Check for error messages
- Verify video ID extraction
- Confirm click event registration

All logs are prefixed for easy filtering in browser console.
