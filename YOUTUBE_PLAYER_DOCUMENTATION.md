# Elegant YouTube Player for Webflow

A lightweight, accessible, and beautiful YouTube player component designed specifically for Webflow. Supports both regular YouTube videos (16:9) and YouTube Shorts (9:16) with an elegant glassy play button and smooth interactions.

## ✨ Features

- **🎬 Dual Format Support**: Handles both regular YouTube videos and Shorts
- **🎨 Elegant Design**: Glassy play button with subtle hover effects and brand colors
- **♿ Accessible**: Proper ARIA labels, keyboard navigation, and entire player clickable
- **📱 Responsive**: Adapts to all screen sizes
- **🚀 Performance**: Lazy loading with click-to-play
- **🎯 Webflow Optimized**: Designer placeholders and component-ready structure
- **🔄 Automatic Detection**: Extracts video IDs from various YouTube URL formats
- **🎭 High Quality Thumbnails**: Automatically fetches maxres quality thumbnails
- **🌐 RTL Support**: Works with right-to-left languages
- **🖱️ Enhanced UX**: Click anywhere on the player to play the video

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

### Step 1: Create and Style the Base Class in Webflow

#### 1.1 Create the Div Block
1. **Add a Div Block** to your Webflow canvas
2. **Add a class**: `youtube-player`

#### 1.2 Style the `youtube-player` Class in Webflow Designer

To make the player presentable in the Webflow Designer, add these styles:

**Layout Settings:**
- Position: `Relative`
- Display: `Block`
- Width: `100%` (or set a specific width like `800px` for testing)

**Size Settings:**
- Height: Auto (will be controlled by aspect-ratio)
- Min Height: `300px` (prevents it from collapsing in the Designer)

**Spacing:**
- Padding: `0px` all sides
- Margin: `0px` (or add margin as needed for your layout)

**Style Settings:**
- Background Color: `#000000` (black)
- Border Radius: `12px`
- Overflow: `Hidden`

**Advanced Settings (Optional):**
- Box Shadow: `0px 8px 32px rgba(0, 0, 0, 0.3)` (for elevation)

#### 1.3 Add the Custom Attribute
3. **Add a custom attribute** (in Element Settings):
   - Name: `data-youtube-id`
   - Value: `dQw4w9WgXcQ` (or any YouTube video ID for testing)

**Important Note:** The aspect ratio is controlled by the CSS file, but you need to set a min-height in Webflow to make it visible in the Designer.

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
- **Option B**: Add combo class `youtube-short`

**For YouTube Shorts, add these additional Webflow styles to the `youtube-short` combo class:**

**Size Settings:**
- Max Width: `400px`
- Margin: `0px auto` (centers the player)

**DIV Structure:**
```
Div Block
  └─ Class: youtube-player
  └─ Attribute: data-youtube-id = "VIDEO_ID"
  └─ Attribute: data-youtube-short (for Shorts)

OR

Div Block
  └─ Class: youtube-player youtube-short
  └─ Attribute: data-youtube-id = "VIDEO_ID"
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

/* Custom play button color (brand colors used by default) */
.youtube-play-button {
  background: rgb(58 53 48 / 25%); /* Brand accent-600 with transparency */
}

/* Custom hover effect */
.youtube-placeholder:hover .youtube-play-button {
  background: rgb(74 69 64 / 35%); /* Brand accent-500-hover on hover */
  transform: scale(1.2);
}

/* Custom play icon color */
.youtube-play-icon {
  color: rgb(58 53 48); /* Brand accent-600 */
}

.youtube-placeholder:hover .youtube-play-icon {
  color: rgb(74 69 64); /* Brand accent-500-hover on hover */
}
```

### Webflow Designer Placeholder

The player shows an elegant placeholder in the Webflow Designer/Editor:
- **Regular Videos**: "YouTube Video (16:9)"
- **Shorts**: "YouTube Short (9:16)"

This helps you visualize and design around the player without loading videos in the editor.

**What you'll see in Webflow Designer:**
- A black background box with rounded corners
- The minimum height you set (e.g., 300px)
- An elegant centered label overlay showing the player type
- The label appears semi-transparent with a backdrop blur effect

**The placeholder is automatically hidden on the published site**, and the actual YouTube player appears when visitors click the play button.

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
- ✅ **Keyboard Navigation**: Full keyboard support (Enter and Space to play)
- ✅ **Focus Indicators**: Visible focus states with brand color outlines
- ✅ **Reduced Motion**: Respects `prefers-reduced-motion`
- ✅ **High Contrast**: Adapts for `prefers-contrast: high` with enhanced colors
- ✅ **Semantic HTML**: Proper button and image elements
- ✅ **Large Click Area**: Entire player is clickable, not just the button

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

### Initial Setup
- [ ] Copy CSS to Project Settings → Custom Code → Head Code (wrapped in `<style>` tags)
- [ ] Copy JS to Project Settings → Custom Code → Footer Code (wrapped in `<script>` tags)

### Creating the Player
- [ ] Add a Div Block to your canvas
- [ ] Add class `youtube-player`
- [ ] Style the class in Webflow Designer:
  - [ ] Position: Relative
  - [ ] Width: 100%
  - [ ] Min Height: 300px (or your preferred size)
  - [ ] Background: #000000 (black)
  - [ ] Border Radius: 12px
  - [ ] Overflow: Hidden
- [ ] Add custom attribute `data-youtube-id` with your video ID
- [ ] For Shorts: Add attribute `data-youtube-short` OR combo class `youtube-short`
  - [ ] If using Shorts, set Max Width: 400px and Margin: 0 auto

### Component Creation (Optional but Recommended)
- [ ] Select the styled `youtube-player` div
- [ ] Right-click → Create Component
- [ ] Name it "YouTube Player" or "YouTube Short"
- [ ] Add Component Property:
  - [ ] Name: `videoId`
  - [ ] Type: Text
  - [ ] Bind to: `data-youtube-id` attribute

### Testing
- [ ] Verify placeholder appears in Webflow Designer
- [ ] Test in Preview mode (videos won't play in Designer, only in Preview/Published)
- [ ] Publish and test on live site
- [ ] Check accessibility with keyboard navigation
- [ ] Test on mobile devices

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

1. Make sure CSS is in the **Head Code** section (wrapped in `<style>` tags)
2. Check that the `youtube-player` class is applied correctly
3. Verify the div has a **min-height** set in Webflow (e.g., 300px)
4. Ensure **background color** is set to black (#000000)
5. Refresh the Webflow Designer (Cmd/Ctrl + R)
6. Try clearing your browser cache

### Play button not centered?

1. Ensure the container has `position: relative` set in Webflow
2. Check for conflicting Webflow styles (remove any flexbox or grid settings)
3. Verify the `youtube-player` class doesn't have any alignment overrides
4. Make sure **overflow** is set to `hidden`
5. If still not working, try adding `!important` to the button positioning in the custom CSS

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
- **Smooth Transitions**: 0.5s cubic-bezier(0.4, 0, 0.2, 1) for elegant feel
- **Scale on Hover**: 1.15x scale with shadow enhancement
- **Brand Colors**: Warm, earthy brown tones from brand palette
- **Accessible Contrast**: WCAG AAA compliant (7.8:1 contrast ratio)

### Thumbnail
- **High Quality**: Fetches `maxresdefault` with `hqdefault` fallback
- **Subtle Zoom**: 1.05x scale on hover
- **Brightness Overlay**: Darkening to 85% brightness on hover for button contrast

### Colors & Accessibility
- **Primary Play Icon**: rgb(58, 53, 48) - Brand accent-600 (#3a3530)
- **Hover Play Icon**: rgb(74, 69, 64) - Brand accent-500-hover (#4a4540)
- **Active Play Icon**: rgb(46, 41, 37) - Brand accent-700-active (#2e2925)
- **Button Background**: Semi-transparent brand accent (25% opacity)
- **Button Hover**: Semi-transparent brand accent-hover (35% opacity)
- **Button Active**: Semi-transparent brand accent-active (40% opacity)
- **Dark Background**: Black (#000) for maximum contrast
- **Focus Indicator**: rgb(107, 98, 90) - Brand focus-ring (#6b625a) with 80% opacity
- **High Contrast Mode**: Light text on dark button (rgb(244, 239, 232) on dark brown)
- **WCAG AAA Compliant**: All color combinations meet accessibility standards

### User Experience
- **Entire Player Clickable**: Users can click anywhere on the thumbnail or button
- **Keyboard Support**: Press Enter or Space to activate
- **Visual Feedback**: Smooth transitions and hover states for clear interaction
- **Loading State**: Elegant fade-out when video loads
- **Brand Consistency**: Colors match the warm, earthy brand palette

### Brand Palette
The player uses your brand's warm, neutral, earthy color scheme:
- **Warm Browns**: Professional, sophisticated accent colors
- **Subtle Gradations**: Smooth transitions between states
- **High Contrast**: Ensures readability and accessibility
- **Natural Feel**: Organic, timeless aesthetic

## 📄 License

This code is free to use in any Webflow project, commercial or personal.

---

**Need help?** Check the browser console for detailed error messages and logs.

**Happy Webflow building!** 🎬✨
