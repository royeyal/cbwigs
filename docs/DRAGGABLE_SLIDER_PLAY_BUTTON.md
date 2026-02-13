# Draggable Infinite Slider - Play Button Documentation

## Changes Made

Added a centered play button to each slide, styled identically to the YouTube player's play button with brand colors and glassmorphism effects.

## Updated HTML Structure

### Complete Slide Structure with Play Button

```html
<div data-slider="slide" class="slider-slide">
  <a href="#" class="slide-link">
    <div class="slide-inner">
      <img src="..." alt="..." class="slide-img" />

      <!-- NEW: Play Button (centered) -->
      <div class="slide-play-button">
        <svg
          class="slide-play-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 5.14v13.72L19 12L8 5.14z" fill="currentColor" />
        </svg>
      </div>

      <!-- Caption (top-left corner) -->
      <div class="slide-caption">
        <div class="caption-dot"></div>
        <p class="caption">Layout nº001</p>
      </div>
    </div>
  </a>
</div>
```

### Visual Hierarchy

```
┌─ .slider-slide (data-slider="slide") ─────────────────────────┐
│                                                                 │
│  ┌─ a.slide-link (href="#") ──────────────────────────────┐   │
│  │                                                          │   │
│  │  ┌─ .slide-inner ─────────────────────────────────┐    │   │
│  │  │                                                 │    │   │
│  │  │  [Image: .slide-img - Full background]         │    │   │
│  │  │                                                 │    │   │
│  │  │  ┌─ .slide-caption ──────┐    (Top-left)      │    │   │
│  │  │  │ ● Layout nº001        │                     │    │   │
│  │  │  └───────────────────────┘                     │    │   │
│  │  │                                                 │    │   │
│  │  │               ┌──────┐                         │    │   │
│  │  │               │  ▶️   │    (Centered)          │    │   │
│  │  │               └──────┘                         │    │   │
│  │  │           .slide-play-button                   │    │   │
│  │  │                                                 │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Detailed Z-Index Layering

```
z-index: 1  → .slide-img (background)
z-index: 2  → .slide-caption (top-left)
z-index: 3  → .slide-play-button (centered, on top)
```

## CSS Classes Added

### `.slide-play-button`

**Purpose:** Circular play button container centered in the slide

**Styling:**

- 80px × 80px circle
- Glassmorphism: `backdrop-filter: blur(20px)`
- Brand color: `#a39486` (neutral-dark) with 30% opacity
- Positioned absolute at center: `top: 50%; left: 50%; transform: translate(-50%, -50%)`
- Drop shadows for depth
- Smooth transitions (0.5s cubic-bezier)
- `pointer-events: none` (clicks pass through to link)

**States:**

- **Default:** Semi-transparent glassy circle
- **Hover:** Scales to 1.15×, darker background (40% opacity)
- **Active:** Scales to 1.08×, even darker (50% opacity)
- **Glassy ring:** Appears on hover with gradient border

### `.slide-play-button::before`

**Purpose:** Animated glassy ring effect around the button

**Styling:**

- Positioned 4px outside button (`inset: -4px`)
- Gradient border effect with brand neutral color
- Opacity 0 by default, fades to 1 on hover
- Creates depth and focus effect

### `.slide-play-icon`

**Purpose:** SVG play triangle icon

**Styling:**

- 48px × 48px
- Color: `#a39486` (brand neutral-dark)
- Drop shadow for contrast against background
- Scales slightly (1.05×) on hover
- Smooth color transitions

## Brand Colors Used

All colors match the YouTube player implementation:

| Color          | Hex       | Usage                   |
| -------------- | --------- | ----------------------- |
| Neutral-dark   | `#a39486` | Icon color, button base |
| Neutral-darker | `#8c8176` | Hover states            |
| Neutral        | `#c8bfb3` | Glassy ring gradient    |
| Text-on-dark   | `#f4efe8` | Inset highlight         |
| Black          | `#000`    | Drop shadows            |

## Interaction Design

### Hover Behavior

1. **Button:** Scales up to 115%, background darkens
2. **Glassy ring:** Fades in around button
3. **Icon:** Color darkens, slight scale increase
4. **Thumbnail:** Inherited from `.slide-link:hover` (scales 1.05×, darkens)

### Click Behavior

- Button scales to 108%
- Navigates to `href` on click (currently `#`)
- Drag vs click handled by GSAP Draggable

### Accessibility

- ✅ Keyboard accessible (focus on `.slide-link`)
- ✅ Hover and focus states styled identically
- ✅ Clear visual feedback for all interactions
- ✅ SVG icon uses `currentColor` for theme flexibility

## Webflow Implementation

### Adding Play Button in Webflow:

1. **Structure in Webflow Designer:**

   ```
   Link Block (.slide-link)
   └── Div Block (.slide-inner)
         ├── Image (.slide-img)
         ├── Div Block (.slide-play-button)  ← NEW
         │     └── Embed (SVG icon)
         └── Div Block (.slide-caption)
               ├── Div Block (.caption-dot)
               └── Paragraph (.caption)
   ```

2. **SVG Embed Code:**

   ```html
   <svg
     class="slide-play-icon"
     viewBox="0 0 24 24"
     fill="none"
     xmlns="http://www.w3.org/2000/svg"
   >
     <path d="M8 5.14v13.72L19 12L8 5.14z" fill="currentColor" />
   </svg>
   ```

3. **CSS Requirements:**
   - Copy all `.slide-play-button` styles to Webflow custom CSS
   - Or import the updated `draggable-infinite-slider.css`

## Performance Notes

- **Backdrop-filter:** Modern browsers only (Safari 9+, Chrome 76+, Firefox 103+)
- **Fallback:** Button still visible without backdrop blur
- **GPU Acceleration:** `transform` and `opacity` transitions use GPU
- **SVG Optimization:** Inline SVG prevents extra HTTP request

## Technical Details

### Positioning

- **Absolute positioning:** Relative to `.slide-inner`
- **Perfect centering:** `translate(-50%, -50%)` technique
- **Maintains center on scale:** Transform origin at center

### Glassmorphism Effect

```css
background: color-mix(in oklch, #a39486 30%, transparent);
backdrop-filter: blur(20px);
```

- Semi-transparent background
- Blurs content behind the button
- Creates modern glass aesthetic

### Animation Performance

- Uses `transform` and `opacity` (GPU-accelerated)
- Smooth 0.5s cubic-bezier easing
- No layout thrashing
- 60fps animations

## Customization Options

### Change Button Size

```css
.slide-play-button {
  width: 100px; /* Default: 80px */
  height: 100px;
}

.slide-play-icon {
  width: 60px; /* Default: 48px */
  height: 60px;
}
```

### Change Colors

```css
.slide-play-button {
  background: color-mix(in oklch, #your-color 30%, transparent);
}

.slide-play-icon {
  color: #your-color;
}
```

### Disable Blur (Better Performance)

```css
.slide-play-button {
  backdrop-filter: none;
  background: color-mix(in oklch, #a39486 60%, transparent);
}
```

## Browser Support

| Feature           | Browser Support                         |
| ----------------- | --------------------------------------- |
| `color-mix()`     | Chrome 111+, Safari 16.2+, Firefox 113+ |
| `backdrop-filter` | Chrome 76+, Safari 9+, Firefox 103+     |
| CSS transforms    | All modern browsers                     |
| SVG inline        | All browsers                            |

**Fallback Strategy:** Button remains visible and functional without `color-mix()` or `backdrop-filter`, just with solid colors instead of transparency effects.
