# Flip Counter Effect - Layout485

A ScrollTrigger-based flip-clock style counter that changes as users scroll through content sections. Features a sticky two-digit counter (0 + 1-9) that updates based on visible content.

## Features

- **Sticky Counter**: Two-digit display (always "0" + dynamic number)
- **Smooth Transitions**: Flip-clock style animations with GSAP
- **Responsive Design**: Hides counter on mobile, shows inline numbers instead
- **Dynamic Content**: Supports 3-9 content items from CMS
- **Accessibility**: Uses tabular numbers and proper semantic structure

## Installation

### 1. Import the Module

Add to your `main.js`:

```javascript
import { initFlipCounter } from './flip-counter.js';

document.addEventListener('DOMContentLoaded', () => {
  initFlipCounter();
  // ... other initializations
});
```

### 2. Import the Styles

Add to your `main.css`:

```css
@import url('./flip-counter.css');
```

## Webflow Setup

### HTML Structure

You need to create the following structure in Webflow:

```html
<div class="layout485_component">
  <!-- Left Side: Sticky Counter -->
  <div class="layout485_content-left">
    <div class="layout485_number">0</div>
    <div class="layout485_number-wrapper">
      <!-- Add numbers 1-9 based on your CMS item count -->
      <div class="layout485_number">1</div>
      <div class="layout485_number">2</div>
      <div class="layout485_number">3</div>
      <div class="layout485_number">4</div>
      <div class="layout485_number">5</div>
      <!-- Add more as needed up to 9 -->
    </div>
  </div>

  <!-- Right Side: Content Grid -->
  <div class="layout485_content-right">
    <!-- CMS Collection List Wrapper -->
    <div class="layout485_content">
      <!-- Mobile number (hidden on desktop) -->
      <div class="layout485_number">01</div>
      <h3>Content Heading</h3>
      <p>Content paragraph text...</p>
    </div>
    <!-- Repeat for each CMS item (3-9 items) -->
  </div>
</div>
```

### Webflow Classes Configuration

#### 1. `layout485_component`
- **Display**: Grid
- **Grid Template Columns**: `max-content 1fr`
- **Gap**: `2rem`
- **Position**: Relative
- **Min Height**: `100vh`

#### 2. `layout485_content-left`
- **Display**: Flex
- **Position**: Sticky
- **Top**: `20%`
- **Gap**: `0.5rem`
- **Align Items**: Flex Start
- **Font Size**: `4rem`
- **Font Weight**: `700`
- **Line Height**: `1`

#### 3. `layout485_number-wrapper`
- **Position**: Relative
- **Width**: `1em`
- **Height**: `1em`
- **Overflow**: Hidden

#### 4. `layout485_number` (in wrapper)
- **Position**: Absolute
- **Top**: `0`
- **Left**: `0`
- **Width**: `100%`
- **Height**: `100%`
- **Display**: Flex
- **Align Items**: Center
- **Justify Content**: Center

#### 5. `layout485_content-right`
- **Display**: Grid
- **Grid Template Columns**: `1fr`
- **Gap**: `4rem`

#### 6. `layout485_content`
- **Min Height**: `50vh`
- **Padding**: `2rem`

### Mobile Configuration

On mobile (≤768px breakpoint):
- Hide `.layout485_content-left` (display: none)
- Show `.layout485_content .layout485_number` (the mobile number in each content item)
- Change `.layout485_component` to single column grid

## Webflow CMS Setup

### Collection List Setup

1. **Create Collection List** inside `.layout485_content-right`
2. **Connect to your CMS Collection**
3. **Limit Items**: 3-9 items recommended
4. **Collection Item** gets class: `layout485_content`

### Dynamic Number Generation

For the mobile number in each content item, use:

```html
<div class="layout485_number">0{CMS Item Index}</div>
```

Or create a Number field in your CMS with values 01-09.

### Counter Number Generation

In `.layout485_number-wrapper`, you need to manually add number divs matching your max CMS count:

- If you have up to 5 CMS items → Add numbers 1-5
- If you have up to 9 CMS items → Add numbers 1-9

The JavaScript will automatically show the correct number based on scroll position.

## How It Works

### ScrollTrigger Logic

1. Each `.layout485_content` item triggers when it enters the viewport center
2. The corresponding number in `.layout485_number-wrapper` animates into view
3. Previous numbers move up (yPercent: -100)
4. Future numbers stay below (yPercent: calculated based on distance)
5. Smooth transitions use `power2.inOut` easing over 0.6s

### Animation States

- **Active Number**: `yPercent: 0` (visible in viewport)
- **Previous Numbers**: `yPercent: -100` (moved up, hidden)
- **Future Numbers**: `yPercent: (index - activeIndex) * 100` (waiting below)

## Customization

### Change Counter Size

In CSS or Webflow:
```css
.layout485_content-left {
  font-size: 3rem; /* Adjust size */
}
```

### Change Sticky Position

In CSS or Webflow:
```css
.layout485_content-left {
  top: 15%; /* Adjust vertical position */
}
```

### Change Animation Duration

In `flip-counter.js`:
```javascript
gsap.to(number, {
  yPercent: 0,
  duration: 0.8, // Change from 0.6
  ease: 'power2.inOut',
});
```

### Change Trigger Point

In `flip-counter.js`:
```javascript
ScrollTrigger.create({
  trigger: content,
  start: 'top top', // Change from 'top center'
  end: 'bottom center',
  // ...
});
```

### Custom Colors

Use your brand colors:
```css
.layout485_content-left {
  color: #a39486; /* Your brand color */
}
```

## Responsive Behavior

### Desktop (>768px)
- Sticky two-digit counter on left
- Content grid on right
- Flip animation active

### Mobile (≤768px)
- Sticky counter hidden
- Full-width content
- Static number shown in each content item
- No flip animation

### Tablet (768px-1024px)
- Same as desktop but with adjusted spacing
- Smaller font sizes for better fit

## Browser Support

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **GSAP Requirements**: GSAP 3.x + ScrollTrigger plugin
- **CSS Features**: Grid, Flexbox, Sticky positioning

## Performance

- **Efficient Animations**: GSAP optimizes transforms
- **Lightweight**: Minimal DOM manipulation
- **Smooth Scrolling**: Uses ScrollTrigger's optimized scroll handling
- **No Layout Shift**: Overflow hidden prevents reflow

## Accessibility

- Semantic HTML structure
- Tabular numbers for consistent width
- Proper heading hierarchy in content
- Hidden decorative counter on mobile (no content value)

## Testing

Open `test-flip-counter.html` in a browser to see the effect in action with sample content.

## Troubleshooting

### Counter Doesn't Update
- Check that GSAP and ScrollTrigger are loaded
- Verify class names match exactly
- Check browser console for errors
- Uncomment `markers: true` in ScrollTrigger to debug

### Numbers Overlap
- Ensure `.layout485_number-wrapper` has `overflow: hidden`
- Check that wrapper has fixed `width` and `height`

### Animation Jumpy
- Verify GSAP is version 3.x or higher
- Check that ScrollTrigger is properly registered
- Reduce animation duration if needed

### Mobile Number Not Showing
- Verify media query breakpoint matches your design
- Check that mobile number has correct class structure
- Ensure display rules are properly set

## Credits

- **Animation**: GSAP 3.x + ScrollTrigger
- **Technique**: Flip-clock inspired counter
- **Design Pattern**: Sticky side navigation with dynamic content

## Version History

- **v1.0.0** (2025-10-17): Initial release with flip counter effect
