# YouTube Lightbox Modal Player - Webflow Setup Guide

## Overview
This component creates a modal lightbox that plays YouTube videos when you click a play button in your hero section. The video autoplays in a centered modal overlay.

---

## Webflow Structure Setup

### 1. Section Container
**Class:** `section-hero-lightbox`
- This is your main section wrapper
- **Custom Attribute:** `data-youtube-id` = `"YOUR_VIDEO_ID_HERE"`
  - Example: `data-youtube-id="dQw4w9WgXcQ"`
  - You can use:
    - Just the video ID: `dQw4w9WgXcQ`
    - Full URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
    - Short URL: `https://youtu.be/dQw4w9WgXcQ`

### 2. Component Wrapper
**Class:** `section_hero_lightbox_component`
- Container for the entire hero component

### 3. Hero Wrapper
**Class:** `hero_lightbox-wrapper`
- Contains two main elements:
  - `hero_lightbox` (the video preview area)
  - `hero_content` (any text/content overlay)

### 4. Video Preview Area
**Class:** `hero_lightbox`
- Contains:
  - **Thumbnail:** `hero_lightbox-thumbnail` (an image element)
  - **Play Icon:** `lightbox-play-icon` (clickable trigger)
  - **Overlay:** `video-overlay-layer` (optional dark overlay)

### 5. Play Icon (Clickable Trigger)
**Class:** `lightbox-play-icon`
- This is the clickable element that triggers the video
- Contains:
  - **SVG Icon:** Class `icon-embed-large`
  - Make sure this is visible and positioned center of thumbnail

---

## Complete HTML Structure

```html
<section class="section-hero-lightbox" data-youtube-id="dQw4w9WgXcQ">
  <div class="section_hero_lightbox_component">
    <div class="hero_lightbox-wrapper">
      
      <!-- Video Preview Area -->
      <div class="hero_lightbox">
        <img src="thumbnail.jpg" class="hero_lightbox-thumbnail" alt="">
        <div class="video-overlay-layer"></div>
        <div class="lightbox-play-icon">
          <svg class="icon-embed-large" viewBox="0 0 24 24">
            <path d="M8 5.14v13.72L19 12L8 5.14z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      
      <!-- Content Overlay (optional) -->
      <div class="hero_content">
        <h1>Your Hero Title</h1>
        <p>Your hero description</p>
      </div>
      
    </div>
  </div>
</section>
```

---

## Styling Recommendations

### 1. Hero Lightbox Container
```css
.hero_lightbox {
  position: relative;
  width: 100%;
  height: 60vh; /* or your preferred height */
  overflow: hidden;
  cursor: pointer;
}
```

### 2. Thumbnail
```css
.hero_lightbox-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1s ease;
}

.hero_lightbox:hover .hero_lightbox-thumbnail {
  transform: scale(1.05);
}
```

### 3. Video Overlay Layer
```css
.video-overlay-layer {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}
```

### 4. Play Icon
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
}

.lightbox-play-icon:hover {
  transform: translate(-50%, -50%) scale(1.1);
  background: rgba(255, 255, 255, 0.3);
}

.icon-embed-large {
  width: 40px;
  height: 40px;
  color: white;
}
```

### 5. Hero Content (Optional)
```css
.hero_content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  color: white;
  text-align: center;
  pointer-events: none; /* Prevent blocking play icon clicks */
}
```

---

## Step-by-Step Webflow Setup

1. **Create Section**
   - Add a Section element
   - Class: `section-hero-lightbox`
   - Go to Settings → Custom Attributes
   - Add: `data-youtube-id` with your video ID

2. **Add Component Wrapper**
   - Inside section, add a Div
   - Class: `section_hero_lightbox_component`

3. **Add Hero Wrapper**
   - Inside component, add a Div
   - Class: `hero_lightbox-wrapper`
   - Set display to relative or flex

4. **Create Video Preview Area**
   - Inside wrapper, add a Div
   - Class: `hero_lightbox`
   - Set position: relative
   - Set dimensions (width: 100%, height: 60vh or as needed)

5. **Add Thumbnail Image**
   - Inside `hero_lightbox`, add an Image
   - Class: `hero_lightbox-thumbnail`
   - Upload your video thumbnail or use YouTube thumbnail URL:
     - `https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg`

6. **Add Overlay Layer (Optional)**
   - Inside `hero_lightbox`, add a Div
   - Class: `video-overlay-layer`
   - Position: absolute, inset: 0
   - Background: rgba(0,0,0,0.3)

7. **Add Play Icon**
   - Inside `hero_lightbox`, add a Div
   - Class: `lightbox-play-icon`
   - Position: absolute
   - Center it: top 50%, left 50%, transform: translate(-50%, -50%)

8. **Add SVG Icon**
   - Inside `lightbox-play-icon`, add an Embed element
   - Class: `icon-embed-large`
   - Paste this SVG code:
   ```html
   <svg class="icon-embed-large" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M8 5.14v13.72L19 12L8 5.14z" fill="currentColor"/>
   </svg>
   ```

9. **Add Content (Optional)**
   - Inside `hero_lightbox-wrapper`, add a Div
   - Class: `hero_content`
   - Add your heading, text, etc.
   - Set pointer-events: none in styles

---

## Testing

1. **Publish your Webflow site**
2. **Click the play icon** - modal should open
3. **Video should autoplay**
4. **Click backdrop or X button** - modal should close
5. **Press ESC key** - modal should close

---

## Troubleshooting

### Video doesn't play
- Check that `data-youtube-id` attribute is correctly set
- Verify the YouTube video ID is valid (11 characters)
- Check browser console for errors

### Play icon not clickable
- Ensure `lightbox-play-icon` class is spelled correctly
- Check that no other element is covering it (z-index)
- Verify `hero_content` has `pointer-events: none`

### Modal doesn't appear
- Check that `section-hero-lightbox` class exists
- Verify the script is loaded (check Network tab)
- Make sure both classes exist: `section-hero-lightbox` AND `lightbox-play-icon`

### Multiple videos on same page
- Each section needs its own unique `data-youtube-id`
- Each section must have both required classes
- Script will create separate triggers for each section

---

## Advanced: Multiple Videos

You can have multiple hero lightbox sections on the same page:

```html
<!-- Video 1 -->
<section class="section-hero-lightbox" data-youtube-id="VIDEO_ID_1">
  <!-- Structure here -->
</section>

<!-- Video 2 -->
<section class="section-hero-lightbox" data-youtube-id="VIDEO_ID_2">
  <!-- Structure here -->
</section>
```

Each will work independently with its own video ID.

---

## Alternative: Data Attribute on Play Icon

If you prefer, you can add the `data-youtube-id` directly to the play icon instead of the section:

```html
<div class="lightbox-play-icon" data-youtube-id="dQw4w9WgXcQ">
  <svg class="icon-embed-large">...</svg>
</div>
```

The script checks multiple locations for the video ID:
1. Section (`section-hero-lightbox`)
2. Hero lightbox div (`hero_lightbox`)
3. Play icon (`lightbox-play-icon`)

---

## Features

✅ Auto-plays video on click
✅ Responsive modal (90vw, max 1200px wide)
✅ 16:9 aspect ratio maintained
✅ Backdrop click closes modal
✅ Close button (X) in top-right
✅ ESC key closes modal
✅ Body scroll locked when open
✅ Smooth animations
✅ Keyboard accessible (Tab, Enter, Space)
✅ Multiple videos on same page supported
✅ Works with Webflow interactions

---

## Support

The script automatically:
- Loads YouTube IFrame API
- Handles multiple trigger formats
- Manages modal state
- Cleans up players when closed
- Re-initializes on Webflow page transitions
