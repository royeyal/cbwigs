# Elegant YouTube Player for Webflow

A lightweight, accessible, and beautiful YouTube player component designed specifically for Webflow. Supports both regular YouTube videos (16:9) and YouTube Shorts (9:16) with an elegant glassy play button and smooth interactions.

## ✨ Features

- **🎬 Dual Format Support**: Handles both regular YouTube videos and Shorts
- **🎨 Elegant Design**: Glassy play button with subtle hover effects
- **♿ Accessible**: Proper ARIA labels and keyboard navigation
- **📱 Responsive**: Adapts to all screen sizes
- **🚀 Performance**: Lazy loading with click-to-play
- **🎯 Webflow Optimized**: Designer placeholders and component-ready structure
- **🔄 Automatic Detection**: Extracts video IDs from various YouTube URL formats
- **🎭 High Quality Thumbnails**: Automatically fetches maxres quality thumbnails
- **🌐 RTL Support**: Works with right-to-left languages

## 📦 Installation

### 1. Add the CSS to your Webflow project

Copy the contents of `youtube-player.css` and paste it into your Webflow project's **Custom Code** section (Project Settings → Custom Code → Head Code) wrapped in `<style>` tags:

```html
<style>
  /* Paste youtube-player.css contents here */
</style>
```

### 2. Add the JavaScript to your Webflow project

Copy the contents of `youtube-player.js` and paste it into your Webflow project's **Custom Code** section (Project Settings → Custom Code → Footer Code) wrapped in `<script>` tags:

```html
<script>
  // Paste youtube-player.js contents here
</script>
```

Alternatively, if using a build system (Vite, Webpack, etc.), import the files:

```javascript
import './styles/youtube-player.css';
import './js/youtube-player.js';
```

## 🏗️ Webflow Structure

### Basic HTML Structure

```html
<div class="youtube-player" data-youtube-id="VIDEO_ID_HERE">
  <!-- Player content will be automatically injected here -->
</div>
```

### For YouTube Shorts (9:16)

Add the `data-youtube-short` attribute or `youtube-short` class:

```html
<div class="youtube-player" data-youtube-id="VIDEO_ID_HERE" data-youtube-short>
  <!-- This will render in 9:16 aspect ratio -->
</div>
```

## 🎯 Creating a Webflow Component

### Step 1: Create the Base Structure

1. **Add a Div Block** to your Webflow canvas
2. **Add a class**: `youtube-player`
3. **Add a custom attribute**:
   - Name: `data-youtube-id`
   - Value: `dQw4w9WgXcQ` (or any YouTube video ID for testing)

### Step 2: Configure for Regular Videos (16:9)

This is the default behavior. No additional configuration needed.

**DIV Structure:**
```
Div Block
  └─ Class: youtube-player
  └─ Attribute: data-youtube-id = "VIDEO_ID"
```

### Step 3: Configure for YouTube Shorts (9:16)

Add one of these:
- **Option A**: Add attribute `data-youtube-short` (no value needed)
- **Option B**: Add class `youtube-short`

**DIV Structure:**
```
Div Block
  └─ Class: youtube-player
  └─ Attribute: data-youtube-id = "VIDEO_ID"
  └─ Attribute: data-youtube-short (for Shorts)
```

### Step 4: Create a Webflow Component

1. Select your `youtube-player` div
2. Right-click → **Create Component**
3. Name it: "YouTube Player" or "YouTube Short"
4. **Add Component Properties**:
   - Property Name: `videoId`
   - Type: `Text`
   - Bind to: `data-youtube-id` attribute

Now you can reuse this component and simply change the `videoId` property!

## 🎨 Customization

### Video ID Input Formats

The script accepts multiple formats:

| Format | Example |
|--------|---------|
| Video ID only | `dQw4w9WgXcQ` |
| Full URL | `https://www.youtube.com/watch?v=dQw4w9WgXcQ` |
| Short URL | `https://youtu.be/dQw4w9WgXcQ` |
| Shorts URL | `https://www.youtube.com/shorts/dQw4w9WgXcQ` |
| Embed URL | `https://www.youtube.com/embed/dQw4w9WgXcQ` |

**Best Practice**: Use just the **Video ID** (11 characters) for cleaner code.

### Styling Customization

You can customize the player appearance by overriding CSS variables or targeting specific classes:

```css
/* Custom border radius */
.youtube-player {
  border-radius: 20px;
}

/* Custom play button size */
.youtube-play-button {
  width: 100px;
  height: 100px;
}

/* Custom play button color */
.youtube-play-button {
  background: rgba(255, 0, 0, 0.2);
}

/* Custom hover effect */
.youtube-play-button:hover {
  background: rgba(255, 0, 0, 0.3);
  transform: scale(1.15);
}
```

### Webflow Designer Placeholder

The player shows an elegant placeholder in the Webflow Designer/Editor:
- **Regular Videos**: "YouTube Video (16:9)"
- **Shorts**: "YouTube Short (9:16)"

This helps you visualize and design around the player without loading videos in the editor.

## 📱 Responsive Behavior

### Regular Videos (16:9)
- Full width by default
- Maintains 16:9 aspect ratio
- Scales down on mobile

### YouTube Shorts (9:16)
- Max-width: 400px on desktop/tablet
- Centered with `margin: auto`
- Full width on mobile (< 480px)

### Play Button Sizes
- Desktop: 80×80px
- Tablet: 64×64px
- Mobile: 56×56px

## ♿ Accessibility Features

- ✅ **ARIA Labels**: Proper labels for screen readers
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Focus Indicators**: Visible focus states
- ✅ **Reduced Motion**: Respects `prefers-reduced-motion`
- ✅ **High Contrast**: Adapts for `prefers-contrast: high`
- ✅ **Semantic HTML**: Proper button and image elements

## 🔧 Advanced Usage

### Manual Initialization

If you're adding players dynamically (e.g., after AJAX load), reinitialize:

```javascript
// Reinitialize all players
window.youtubePlayer().reinitialize();
```

### Destroy a Player

```javascript
const container = document.querySelector('.youtube-player');
window.youtubePlayer().destroyPlayer(container);
```

### Destroy All Players

```javascript
window.youtubePlayer().destroyAllPlayers();
```

## 📋 Complete Webflow Setup Checklist

- [ ] Copy CSS to Project Settings → Custom Code → Head Code
- [ ] Copy JS to Project Settings → Custom Code → Footer Code
- [ ] Create a Div Block with class `youtube-player`
- [ ] Add attribute `data-youtube-id` with your video ID
- [ ] For Shorts: Add attribute `data-youtube-short` or class `youtube-short`
- [ ] Create a Webflow Component with `videoId` property
- [ ] Bind component property to `data-youtube-id` attribute
- [ ] Test in Preview mode (videos won't play in Designer)
- [ ] Publish and test on live site

## 🎯 Example Use Cases

### 1. Hero Section Video

```html
<div class="youtube-player" data-youtube-id="dQw4w9WgXcQ">
  <!-- Full-width 16:9 video -->
</div>
```

### 2. YouTube Short in Sidebar

```html
<div class="youtube-player youtube-short" data-youtube-id="shortVideoId">
  <!-- 9:16 short, max 400px wide, centered -->
</div>
```

### 3. Video Grid (3 columns)

```html
<div class="video-grid">
  <div class="youtube-player" data-youtube-id="video1"></div>
  <div class="youtube-player" data-youtube-id="video2"></div>
  <div class="youtube-player" data-youtube-id="video3"></div>
</div>
```

Add custom CSS:
```css
.video-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 768px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
}
```

## 🐛 Troubleshooting

### Videos not loading?

1. **Check the video ID**: Make sure it's exactly 11 characters
2. **Check browser console**: Look for error messages
3. **Test in Preview mode**: Videos don't play in Webflow Designer
4. **Check video privacy**: Ensure the YouTube video is public or unlisted

### Placeholder not showing in Webflow Designer?

1. Make sure CSS is in the **Head Code** section
2. Check that the `youtube-player` class is applied
3. Refresh the Webflow Designer

### Play button not centered?

1. Ensure the container has `position: relative`
2. Check for conflicting Webflow styles
3. Try adding `!important` to the button positioning

### YouTube API not loading?

1. Check browser console for network errors
2. Ensure you have internet connection
3. Check if Content Security Policy blocks YouTube

## 🚀 Performance Tips

1. **Lazy Loading**: The script uses lazy loading for thumbnails
2. **Click-to-Play**: Videos only load when users click play
3. **Single API Load**: YouTube API loads once for all players
4. **Efficient Selectors**: Uses data attributes for fast querying

## 📚 Additional Resources

- [YouTube IFrame API Documentation](https://developers.google.com/youtube/iframe_api_reference)
- [Webflow Component Documentation](https://university.webflow.com/lesson/components)
- [Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

## 🎨 Design Considerations

### Play Button
- **Glassy Effect**: Uses `backdrop-filter` for modern blur effect
- **Subtle Shadow**: Multiple box-shadows for depth
- **Smooth Transitions**: 0.3s cubic-bezier for natural feel
- **Scale on Hover**: 1.1x scale with shadow enhancement

### Thumbnail
- **High Quality**: Fetches `maxresdefault` with `hqdefault` fallback
- **Subtle Zoom**: 1.05x scale on hover
- **Brightness Overlay**: Slight darkening on hover for button contrast

### Colors
- **Red Play Icon**: YouTube brand color (#ff0000)
- **White Glassy Button**: Semi-transparent white with blur
- **Dark Background**: Black (#000) for maximum contrast

## 📄 License

This code is free to use in any Webflow project, commercial or personal.

---

**Need help?** Check the browser console for detailed error messages and logs.

**Happy Webflow building!** 🎬✨
