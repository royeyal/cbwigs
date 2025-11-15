# Draggable Infinite Slider - Link Structure

## Changes Made

Each slide is now wrapped in an anchor tag (`<a>`) with the class `slide-link`, making the entire slide clickable.

## HTML Structure

### Complete Slide Structure
```html
<div data-slider="slide" class="slider-slide">
  <a href="#" class="slide-link">
    <div class="slide-inner">
      <img src="..." alt="..." class="slide-img">
      <div class="slide-caption">
        <div class="caption-dot"></div>
        <p class="caption">Layout nº001</p>
      </div>
    </div>
  </a>
</div>
```

### Hierarchy Breakdown
```
.slider-slide (data-slider="slide")          ← Slide container (positioned by GSAP)
  └── a.slide-link                           ← NEW: Link wrapper (href="#")
        └── .slide-inner                     ← Visual container (border-radius, overflow)
              ├── img.slide-img              ← Slide image (object-fit: cover)
              └── .slide-caption             ← Caption overlay (absolute positioned)
                    ├── .caption-dot         ← Decorative dot
                    └── p.caption            ← Caption text
```

## CSS Classes

### `.slide-link` (NEW)
```css
.slide-link {
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
}
```

**Purpose:** 
- Makes the entire slide area clickable
- Removes default link styling (underline)
- Inherits text color from parent
- Takes full width/height of slide container

### Existing Classes (Unchanged)
- `.slider-slide` - Outer slide container with `data-slider="slide"` attribute
- `.slide-inner` - Contains the image and caption with border-radius
- `.slide-img` - The image element
- `.slide-caption` - Caption overlay
- `.caption-dot` - Decorative dot
- `.caption` - Caption text

## Webflow Implementation

### In Webflow Designer:

1. **Slide Structure:**
   ```
   Div Block (.slider-slide) [data-slider="slide"]
   └── Link Block (.slide-link) [href="#"]
         └── Div Block (.slide-inner)
               ├── Image (.slide-img)
               └── Div Block (.slide-caption)
                     ├── Div Block (.caption-dot)
                     └── Paragraph (.caption)
   ```

2. **Setting the Link URLs:**
   - In Webflow, select each `.slide-link` element
   - Change `href="#"` to your desired destination
   - Can link to pages, sections, or external URLs

3. **Drag vs Click Behavior:**
   - The slider script automatically handles drag vs click
   - Short clicks trigger the link
   - Dragging moves the slider without triggering the link
   - This is built into the GSAP Draggable plugin

## Accessibility

The structure maintains good accessibility:
- ✅ Links are keyboard accessible
- ✅ Screen readers can navigate links
- ✅ Alt text on images preserved
- ✅ ARIA labels on navigation buttons

## Link Behavior

**Default Behavior:**
- All links currently point to `href="#"` (same page)
- Replace `#` with actual URLs in Webflow

**Interactive Behavior:**
- Click without drag: Opens link
- Drag: Slides carousel (link not triggered)
- Draggable plugin handles the distinction automatically

## Styling Tips

### Hover Effects
Add hover states to `.slide-link`:
```css
.slide-link:hover .slide-img {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

.slide-link:hover .slide-caption {
  background-color: rgba(239, 238, 236, 0.95);
}
```

### Focus States (Keyboard Accessibility)
```css
.slide-link:focus {
  outline: 2px solid #131313;
  outline-offset: 4px;
}
```

## Notes

- Each slide is now independently linkable
- Links work alongside the dragging functionality
- The `.active` class is still applied to the current slide by JavaScript
- Link blocks in Webflow behave identically to this structure
