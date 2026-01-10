# Parallax Image Effect - Webflow Setup Guide

## Overview
This script creates a smooth parallax scrolling effect on images within cards using GSAP ScrollTrigger. The effect is triggered by a custom data attribute, making it easy to apply selectively in Webflow.

## Visual Effect
As the user scrolls, images move vertically at a different speed than the rest of the content, creating a depth and motion effect.

## Prerequisites
- GSAP library (included in the project)
- ScrollTrigger plugin (included in the project)

## Webflow Setup

### 1. Structure Requirements
Your cards should follow this structure:
```
.collection-grid
  └── .card
      └── .card__media
          └── .card__img
```

### 2. Add the Custom Attribute

**On the `.card` element** (or `.card__media` if you prefer), add a custom attribute:

**Attribute Name:** `data-parallax-image`  
**Attribute Value:** (leave empty or set to `true`)

#### In Webflow:
1. Select the `.card` element (or `.card__media`)
2. In the Settings panel (D key), scroll to "Custom Attributes"
3. Click "+ Add Custom Attribute"
4. Name: `data-parallax-image`
5. Value: (leave blank or enter `true`)

### 3. Set Image Dimensions
The `.card__media` element must have defined dimensions:

**Option A - Fixed Height:**
```
.card__media
  - Width: 100%
  - Height: 300px (or your desired height)
  - Overflow: Hidden
```

**Option B - Aspect Ratio:**
```
.card__media
  - Width: 100%
  - Aspect Ratio: 16 / 9 (or your desired ratio)
  - Overflow: Hidden
```

### 4. Image Settings
Configure the `.card__img`:
```
.card__img
  - Width: 100%
  - Height: 100%
  - Object Fit: Cover
  - Object Position: Center
```

## Advanced Options

### Custom Speed
Control the parallax intensity with `data-parallax-speed`:

**Attribute Name:** `data-parallax-speed`  
**Attribute Value:** `30` (default) - higher values = more movement

Examples:
- `15` - subtle effect
- `30` - medium effect (default)
- `50` - dramatic effect

### Direction Control
Change the parallax direction with `data-parallax-direction`:

**Attribute Name:** `data-parallax-direction`  
**Attribute Value:** `down` (default) or `up`

- `down` - image moves down as you scroll (default)
- `up` - image moves up as you scroll (inverted)

### Example with All Attributes:
```html
<div class="card" 
     data-parallax-image 
     data-parallax-speed="40" 
     data-parallax-direction="down">
  <div class="card__media">
    <img class="card__img" src="..." alt="...">
  </div>
</div>
```

## Disable on Mobile (Optional)

If you want to disable the parallax effect on mobile devices:

1. Add an additional class `parallax-disable-mobile` to the element with `data-parallax-image`
2. The CSS will automatically disable the effect on screens 768px and below

## Collection Lists in Webflow

When using with CMS Collection Lists:

1. Select the Collection Item wrapper (usually `.card`)
2. Add the `data-parallax-image` attribute once
3. The effect will automatically apply to all items in the collection

## Dynamic Content

If you're loading content dynamically (e.g., with filters or infinite scroll), refresh the parallax instances:

```javascript
import { refreshParallaxImages } from './js/parallax-image.js';

// After loading new content
refreshParallaxImages();
```

## Troubleshooting

### Images aren't moving
- Verify the `.card__media` has `overflow: hidden` set
- Check that the element has the `data-parallax-image` attribute
- Ensure `.card__img` exists inside the container
- Check browser console for warnings

### Images show white edges while scrolling
- The image is automatically scaled to 1.2x to prevent edge reveal
- Ensure your images have sufficient resolution
- Center the important part of the image using Object Position

### Effect is too subtle/intense
- Adjust the `data-parallax-speed` attribute
- Default is `30`, try values between `15` (subtle) and `60` (dramatic)

### Performance issues
- Limit the number of parallax images on a single page
- Use appropriately sized/compressed images
- Consider disabling on mobile with `parallax-disable-mobile` class

## Script Loading

The script auto-initializes on page load. Make sure it's included in your page:

```html
<script type="module" src="/src/js/parallax-image.js"></script>
```

Or import it in your main.js:
```javascript
import './parallax-image.js';
```

## CSS Loading

Include the parallax-image.css in your page or import it in your main CSS:

```css
@import './parallax-image.css';
```

## Best Practices

1. **Image Quality**: Use high-resolution images to account for the 1.2x scale
2. **Aspect Ratios**: Maintain consistent aspect ratios across cards for visual harmony
3. **Performance**: Don't overuse - apply selectively to hero images or featured content
4. **Testing**: Always test on various devices and screen sizes
5. **Loading**: Consider lazy loading images that are below the fold

## Browser Support

- Modern browsers with CSS transform support
- IE11+ (with GSAP polyfills)
- Mobile Safari, Chrome, Firefox, Edge

## Examples

### Basic Implementation
```html
<div class="collection-grid">
  <div class="card" data-parallax-image>
    <div class="card__media">
      <img class="card__img" src="image.jpg" alt="Description">
    </div>
    <div class="card__content">
      <!-- Card content -->
    </div>
  </div>
</div>
```

### With Custom Speed
```html
<div class="card" data-parallax-image data-parallax-speed="50">
  <div class="card__media">
    <img class="card__img" src="image.jpg" alt="Description">
  </div>
</div>
```

### Upward Motion
```html
<div class="card" data-parallax-image data-parallax-direction="up">
  <div class="card__media">
    <img class="card__img" src="image.jpg" alt="Description">
  </div>
</div>
```
