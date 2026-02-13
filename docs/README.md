# cbwigs

Code for cbwigs.co.il

# GSAP Animations for Webflow

A comprehensive development setup for creating GSAP animations and interactive features for Webflow projects, deployed via Cloudflare Workers.

## 🏗️ Architecture

### Webflow Integration

- This is a **Webflow project** - HTML structure and base styles managed in Webflow
- Custom JavaScript/CSS files are injected via Webflow's custom code embeds
- Files are hosted on **Cloudflare Workers** and referenced in Webflow

### Global Dependencies

**IMPORTANT**: GSAP and its plugins are **already loaded globally** on the Webflow site:

- **GSAP** (GreenSock Animation Platform) - available as `gsap` global
- **GSAP Flip Plugin** - available as `Flip` global
- **GSAP ScrollTrigger Plugin** - available globally
- **GSAP SplitText, CustomEase, Draggable, InertiaPlugin** - available globally

⚠️ **Do NOT import GSAP or its plugins in JavaScript files** - access them as global variables from the window object.

### Deployment Architecture

1. Code is built using **Vite**
2. Built assets are deployed to **Cloudflare Workers** (configured via `wrangler.toml`)
3. Cloudflare serves minified/bundled JavaScript and CSS files
4. Webflow pages reference these Cloudflare-hosted URLs with cache-busting hashes

## 🚀 Features & Modules

### Animation & Effects

- **Text Reveal** (`textreveal.js`) - Animated text reveals using SplitText
- **Content Reveal Scroll** (`contentrevealscroll.js`) - Scroll-triggered content animations
- **Parallax Images** (`parallax-image.js`) - Smooth parallax scrolling effects
- **Image Trail Cursor** (`image-trail-following-cursor.js`) - Cursor-following image trail
- **Layout Grid Flip** (`layout-grid-flip.js`) - GSAP Flip-based layout animations
- **Fade Effects** - Custom fade effect implementations

### Sliders & Carousels

- **GSAP Slider** (`gsap-slider.js`) - Custom GSAP-based slider
- **Swiper Slider** (`swipeslider.js`) - Integration with Swiper.js library
- **Draggable Infinite Slider** (`draggable-infinite-slider.js`) - Infinite draggable slider with RTL support
  - Standalone version available for separate deployment

### UI Components

- **Accordion** (`accordion.js`) - Expandable/collapsible content sections
- **Flip Counter** (`flip-counter.js`) - Animated number flip counters
- **Copy Email to Clipboard** (`copy-email-to-clipboard-button.js`) - Email copy functionality
- **Leading Zero** (`leading-zero.js`) - Adds leading zeros to numbers (e.g., accordion counts)
- **Dynamic Current Year** (`dynamic-current-year.js`) - Auto-updates year in footer/copyright

### Navigation

- **Multilevel Navigation** (`multilevel-navigation.js`) - Complex multi-level navigation system
- **Side Navigation** - Side panel navigation with scroll triggers
- Sticky navigation scroll classes

### Video & Lightbox

- **YouTube Player** (`youtube-player.js`) - Custom YouTube player integration
- **YouTube Lightbox** (`youtube-lightbox.js`) - Modal lightbox for YouTube videos
- **Lightbox Setup** (`lightbox-setup.js`) - General lightbox configuration

### Internationalization

- **Locale Switch** (`locale-switch.js`) - Language switching functionality
- **RTL Support** - Full right-to-left language support (Hebrew, Arabic)
- **Flodesk Integration** - Custom privacy policy text for Hebrew/English

## 📁 Project Structure

```
src/
├── js/                            # JavaScript modules
│   ├── main.js                    # Main entry point - imports all modules
│   ├── textreveal.js              # Text reveal animations
│   ├── contentrevealscroll.js     # Scroll reveal animations
│   ├── gsap-slider.js             # GSAP-based slider
│   ├── accordion.js               # Accordion component
│   ├── leading-zero.js            # Leading zero formatter
│   ├── swipeslider.js             # Swiper.js integration
│   ├── flip-counter.js            # Flip counter animation
│   ├── image-trail-following-cursor.js  # Cursor trail effect
│   ├── youtube-lightbox.js        # YouTube lightbox modal
│   ├── youtube-player.js          # YouTube player
│   ├── layout-grid-flip.js        # Layout flip animations
│   ├── copy-email-to-clipboard-button.js  # Clipboard functionality
│   ├── multilevel-navigation.js   # Navigation system
│   ├── parallax-image.js          # Parallax effects
│   ├── draggable-infinite-slider.js  # Draggable slider
│   ├── draggable-infinite-slider-standalone.js  # Standalone version
│   ├── dynamic-current-year.js    # Auto current year
│   ├── lightbox-setup.js          # Lightbox config
│   ├── locale-switch.js           # Language switching
│   └── flodesk.js                 # Flodesk customization
├── styles/                        # CSS modules
│   ├── main.css                   # Main styles (imports all CSS)
│   ├── animations.css             # Animation definitions
│   ├── accordion.css
│   ├── flip-counter.css
│   ├── draggable-infinite-slider.css
│   ├── parallax-image.css
│   └── [other component styles]
└── *.html                         # Demo/test pages for local development

docs/                              # Feature documentation
├── README.md                      # This file
├── PROJECT_CONTEXT.md             # Architecture overview
├── DRAGGABLE_SLIDER_WEBFLOW.md    # Slider setup guide
├── PARALLAX_IMAGE_DOCUMENTATION.md
├── YOUTUBE_PLAYER_DOCUMENTATION.md
├── RTL_SUPPORT.md                 # RTL implementation
├── SWIPER_GUIDE.md
└── [20+ other feature docs]

dist/                              # Built files (generated)
├── js/                            # Minified JavaScript with hashes
├── css/                           # Minified CSS with hashes
└── .vite/manifest.json            # Build manifest for Workers

external/
└── src/
    └── worker.js                  # Cloudflare Workers script

vite.config.js                     # Vite build configuration
wrangler.toml                      # Cloudflare Workers config
postcss.config.js                  # PostCSS plugins
eslint.config.js                   # ESLint configuration
package.json                       # Dependencies and scripts
```

## 🛠️ Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm
- Cloudflare account (for deployment)
- Wrangler CLI (installed via npm)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd cbwigs
```

2. **Install dependencies**

```bash
npm install
```

This installs:

- **Build Tools**: Vite, Terser, PostCSS
- **CSS**: Autoprefixer, cssnano, postcss-nesting
- **Linting**: ESLint, Stylelint, Prettier
- **Git Hooks**: Husky, lint-staged
- **Deployment**: Wrangler (Cloudflare Workers)
- **Runtime**: Swiper (only external dependency)

3. **Initialize Husky** (if needed)

```bash
npm run prepare
```

This sets up pre-commit hooks for automatic linting.

## 🏃‍♂️ Development

### Start Development Server

```bash
npm run dev
# or
npm start
```

This starts Vite dev server at `http://localhost:3000` with:

- Hot module replacement (HMR)
- CSS modules
- Live reloading
- Demo HTML pages for testing

### Development Workflow

1. Create/modify modules in `src/js/` and `src/styles/`
2. Add demo HTML in `src/` for local testing
3. Test locally before deploying
4. Lint and format code before committing

## 🏗️ Build for Production

### Build Assets

```bash
npm run build
```

This creates optimized files in `dist/`:

- `dist/js/main.[hash].js` - Bundled JavaScript with cache-busting hash
- `dist/css/main.[hash].css` - Minified CSS with hash
- `dist/.vite/manifest.json` - Build manifest for Workers redirect

**Build features:**

- Code minification with Terser
- CSS minification with cssnano
- Tree-shaking
- Content-based hashing for cache busting
- No code splitting (single bundle)
- Source maps disabled for production

### PostCSS Processing

The build automatically processes CSS with:

- **postcss-nesting** - CSS nesting support
- **autoprefixer** - Browser vendor prefixes
- **cssnano** - CSS compression

## � Deployment

### Deploy to Cloudflare Workers

**Prerequisites:**

- Cloudflare account
- Wrangler authenticated (`npx wrangler login`)

**Deploy command:**

```bash
npm run deploy
```

This runs:

1. `npm run build` - Builds assets
2. `npx wrangler deploy` - Deploys to Cloudflare Workers

### Cloudflare Workers Configuration

The Worker (`external/src/worker.js`) provides:

- **Manifest-based routing** - Uses `.vite/manifest.json` to find hashed files
- **Friendly URLs** - Maps `/main.js` → `/js/main.[hash].js`
- **CORS headers** - Allows cross-origin requests from Webflow
- **Cache busting** - Automatic via content hashes
- **Multiple entry points** - Supports main.js, draggable-slider.js, parallax-image.js, etc.

The worker automatically redirects requests like:

- `/main.js` → actual hashed file `js/main.[hash].js`
- `/main.css` → actual hashed file `css/main.[hash].css`
- `/draggable-slider.js` → standalone slider file

This allows Webflow to use stable URLs while benefiting from cache-busting.

## 🎯 Webflow Integration

### Add Scripts to Webflow

In Webflow's **Project Settings > Custom Code** or **Page Settings > Before `</body>` tag**:

```html
<!-- Main JavaScript Bundle -->
<script src="https://YOUR-WORKER-URL.workers.dev/main.js"></script>

<!-- Main CSS Styles -->
<link rel="stylesheet" href="https://YOUR-WORKER-URL.workers.dev/main.css" />
```

Replace `YOUR-WORKER-URL` with your Cloudflare Workers URL.

### Standalone Components

For specific features only (e.g., slider on specific pages):

```html
<!-- Draggable Infinite Slider (standalone) -->
<script src="https://YOUR-WORKER-URL.workers.dev/draggable-slider.js"></script>

<!-- Parallax Images (standalone) -->
<script src="https://YOUR-WORKER-URL.workers.dev/parallax-image.js"></script>
<link
  rel="stylesheet"
  href="https://YOUR-WORKER-URL.workers.dev/parallax-image.css"
/>
```

### GSAP Global Loading

**CRITICAL**: In Webflow, load GSAP and plugins **before** your custom code:

```html
<!-- In Project Settings > Custom Code > Head Code -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/Flip.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/SplitText.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/Draggable.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/InertiaPlugin.min.js"></script>

<!-- Then load your custom code -->
<script src="https://YOUR-WORKER-URL.workers.dev/main.js"></script>
```

### Using Features in Webflow

Most features use **data attributes** for initialization:

#### Text Reveal

```html
<h1 data-split="heading" data-split-reveal="lines">Your heading</h1>
```

#### Current Year

```html
<span data-current-year></span>
<!-- Automatically updates to current year (2026) -->
```

#### Parallax Image

```html
<div data-parallax-image>
  <img src="image.jpg" alt="Parallax image" />
</div>
```

#### Flip Counter

```html
<div data-flip-counter="1000" data-flip-duration="2000"></div>
```

#### Copy Email Button

```html
<button data-copy-email="contact@example.com">Copy Email</button>
```

#### Leading Zero (Accordion)

```html
<span data-leading-zero>5</span>
<!-- Displays as: 05 -->
```

See individual documentation files in `docs/` for complete setup guides.

## 🧹 Code Quality

### Linting & Formatting

**Lint JavaScript:**

```bash
npm run lint
```

**Lint CSS:**

```bash
npm run lint:css
```

**Format all files:**

```bash
npm run format
```

### Automated Git Hooks

Husky and lint-staged run automatically on commit:

- ESLint checks JavaScript
- Stylelint checks CSS
- Prettier formats code
- Commits are blocked if errors exist

### ESLint Configuration

The project uses ESLint with:

- ES2022 syntax
- Module imports
- Global variables configured (gsap, ScrollTrigger, Flip, Swiper, YT, etc.)
- No console warnings
- Required const/let (no var)
- Arrow functions preferred
- Single quotes enforced

### Stylelint Configuration

Standard CSS linting with:

- stylelint-config-standard
- Auto-fixing enabled
- PostCSS nesting support

## 📝 Adding New Features

### Creating a New Module

1. **Create the module file**

```javascript
// src/js/my-new-feature.js

// Access GSAP from global (don't import!)
export function initMyNewFeature() {
  const elements = document.querySelectorAll('[data-my-feature]');

  // Defensive check - return if no elements
  if (!elements.length) return;

  elements.forEach(element => {
    // Use gsap as global variable
    gsap.to(element, {
      opacity: 1,
      duration: 1
    });
  });
}
```

2. **Create corresponding CSS**

```css
/* src/styles/my-new-feature.css */

[data-my-feature] {
  opacity: 0;
  transition: opacity 0.3s ease;
}
```

3. **Import in main.js**

```javascript
// src/js/main.js

import { initMyNewFeature } from './my-new-feature.js';
import '../styles/my-new-feature.css';

// In DOMContentLoaded event:
initMyNewFeature();

// In exports:
export {
  // ... other exports
  initMyNewFeature
};
```

4. **Create CSS import**

```css
/* src/styles/main.css */

@import './my-new-feature.css';
```

5. **Build and test**

```bash
npm run build
npm run preview
```

6. **Document the feature**
   Create `docs/MY_NEW_FEATURE_DOCUMENTATION.md` with usage instructions.

## 🎨 Common Patterns

### Module Structure Pattern

```javascript
// Don't import GSAP - use globals!
// import gsap from 'gsap'; // ❌ WRONG

export function initFeature() {
  // 1. Query elements using data attributes
  const elements = document.querySelectorAll('[data-feature]');

  // 2. Defensive check - return early if no elements
  if (!elements.length) return;

  // 3. Use GSAP from global scope
  gsap.to(elements, {
    /* animation */
  });

  // 4. ScrollTrigger example (also global)
  ScrollTrigger.create({
    trigger: elements[0]
    // ... config
  });
}
```

### Data Attribute Conventions

Webflow uses data attributes for functionality:

- `[data-feature]` - Main container/trigger
- `[data-feature="variant"]` - Variant/type specification
- `[data-feature-option]` - Child elements or options
- `.is-active`, `.is-open` - State classes

### RTL Support Pattern

```javascript
// Check if page is RTL
const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

// Adjust behavior for RTL
const direction = isRTL ? 'rtl' : 'ltr';
```

### Responsive Breakpoints

Match Webflow's breakpoints:

- Desktop: > 991px
- Tablet: 768px - 991px
- Mobile Landscape: 478px - 767px
- Mobile Portrait: < 478px

```javascript
const isMobile = window.innerWidth < 768;
const isDesktop = window.innerWidth > 991;
```

## 📋 Available Scripts

| Script                       | Description                                     |
| ---------------------------- | ----------------------------------------------- |
| `npm start` or `npm run dev` | Start Vite development server at localhost:3000 |
| `npm run build`              | Build production-ready files to dist/           |
| `npm run preview`            | Preview production build locally                |
| `npm run deploy`             | Build and deploy to Cloudflare Workers          |
| `npm run lint`               | Lint JavaScript files with ESLint (auto-fix)    |
| `npm run lint:css`           | Lint CSS files with Stylelint (auto-fix)        |
| `npm run format`             | Format all files with Prettier                  |
| `npm run prepare`            | Setup Husky git hooks                           |
| `npm run clean`              | Remove dist folder                              |

## 📚 Documentation

Comprehensive documentation for each feature is available in `docs/`:

### Slider & Carousel

- [DRAGGABLE_SLIDER_WEBFLOW.md](DRAGGABLE_SLIDER_WEBFLOW.md) - Draggable slider setup
- [DRAGGABLE_SLIDER_LINKS.md](DRAGGABLE_SLIDER_LINKS.md) - Adding links to slider
- [DRAGGABLE_SLIDER_PLAY_BUTTON.md](DRAGGABLE_SLIDER_PLAY_BUTTON.md) - Play/pause functionality
- [INFINITE_LOOP_DOCUMENTATION.md](INFINITE_LOOP_DOCUMENTATION.md) - Infinite loop setup
- [SWIPER_GUIDE.md](SWIPER_GUIDE.md) - Swiper.js integration

### Effects & Animations

- [PARALLAX_IMAGE_DOCUMENTATION.md](PARALLAX_IMAGE_DOCUMENTATION.md) - Parallax setup
- [FLIP_COUNTER_DOCUMENTATION.md](FLIP_COUNTER_DOCUMENTATION.md) - Counter animations
- [FADE_EFFECT_UX_DOCUMENTATION.md](FADE_EFFECT_UX_DOCUMENTATION.md) - Fade effects
- [SPACING_FIX_DOCUMENTATION.md](SPACING_FIX_DOCUMENTATION.md) - Spacing fixes
- [HARDCODED_MARGINS_DOCUMENTATION.md](HARDCODED_MARGINS_DOCUMENTATION.md) - Margin handling

### Navigation

- [SIDE_NAVIGATION_DOCUMENTATION.md](SIDE_NAVIGATION_DOCUMENTATION.md) - Side nav setup
- [NAVIGATION_POSITIONING_FIX.md](NAVIGATION_POSITIONING_FIX.md) - Position fixes
- [STICKY_NAV_SCROLL_CLASS.md](STICKY_NAV_SCROLL_CLASS.md) - Sticky nav classes

### Video & Lightbox

- [YOUTUBE_PLAYER_DOCUMENTATION.md](YOUTUBE_PLAYER_DOCUMENTATION.md) - YouTube player
- [YOUTUBE_LIGHTBOX_SETUP.md](YOUTUBE_LIGHTBOX_SETUP.md) - Lightbox integration
- [YOUTUBE_BOTH_PLAYERS.md](YOUTUBE_BOTH_PLAYERS.md) - Multiple player types
- [YOUTUBE_PLAYER_CHANGELOG.md](YOUTUBE_PLAYER_CHANGELOG.md) - Version history
- [LIGHTBOX_SETUP_DOCUMENTATION.md](LIGHTBOX_SETUP_DOCUMENTATION.md) - General lightbox

### Internationalization

- [RTL_SUPPORT.md](RTL_SUPPORT.md) - Right-to-left language support
- [RTL_IMPLEMENTATION_SUMMARY.md](RTL_IMPLEMENTATION_SUMMARY.md) - RTL implementation

### Setup & Integration

- [WEBFLOW_CLASS_SETUP_GUIDE.md](WEBFLOW_CLASS_SETUP_GUIDE.md) - Webflow class naming
- [RELUME_CONTAINER_INTEGRATION.md](RELUME_CONTAINER_INTEGRATION.md) - Relume integration
- [BRAND_COLORS.md](BRAND_COLORS.md) - Brand color palette

### Architecture

- [PROJECT_CONTEXT.md](../PROJECT_CONTEXT.md) - Full architecture overview

## 🔧 Technical Details

### Dependencies

**Production:**

- `swiper` (^12.0.2) - Swiper.js carousel library

**Development:**

- `vite` (^7.3.1) - Build tool and dev server
- `@eslint/js` (^9.14.0) - ESLint core
- `autoprefixer` (^10.4.20) - CSS vendor prefixes
- `cssnano` (^7.0.6) - CSS minifier
- `postcss` (^8.4.47) - CSS processor
- `postcss-nesting` (^14.0.0) - CSS nesting support
- `terser` (^5.44.0) - JavaScript minifier
- `eslint` (^9.14.0) - JavaScript linter
- `eslint-config-prettier` (^9.1.0) - Prettier integration
- `eslint-plugin-prettier` (^5.2.1) - Prettier as ESLint rule
- `stylelint` (^16.10.0) - CSS linter
- `stylelint-config-standard` (^36.0.1) - Standard CSS rules
- `prettier` (^3.3.3) - Code formatter
- `husky` (^9.1.6) - Git hooks
- `lint-staged` (^15.2.10) - Pre-commit linting
- `wrangler` (^4.58.0) - Cloudflare Workers CLI

### Build Configuration

**Vite (`vite.config.js`):**

- Entry point: `src/js/main.js`
- Output: `dist/js/main.[hash].js`
- CSS: Bundled in `dist/css/main.[hash].css`
- Manifest: Generated at `dist/.vite/manifest.json`
- Minification: Terser with console logs kept
- Code splitting: Disabled (single bundle)
- Module preload: Disabled

**PostCSS (`postcss.config.js`):**

- postcss-nesting - CSS nesting
- autoprefixer - Browser prefixes
- cssnano - Minification

**Wrangler (`wrangler.toml`):**

- Worker name: `cbwigs-assets`
- Worker script: `external/src/worker.js`
- Assets directory: `dist/`
- Compatibility date: 2025-09-06

## 🐛 Troubleshooting

### GSAP not found errors

- **Issue:** `gsap is not defined`
- **Solution:** Ensure GSAP is loaded globally in Webflow **before** your custom scripts

### Styles not applying

- **Issue:** CSS not loading or being overridden
- **Solution:** Check CSS load order in Webflow. Increase selector specificity if needed.

### Features not initializing

- **Issue:** Animations/effects not running
- **Solution:** Most features check for element existence. Verify data attributes are correct in Webflow.

### RTL issues

- **Issue:** Layout broken in RTL mode
- **Solution:** Check `dir="rtl"` attribute on `<html>` element. Review RTL documentation.

### Cloudflare deployment fails

- **Issue:** Wrangler deployment errors
- **Solution:**
  - Run `npx wrangler login` to authenticate
  - Check `wrangler.toml` configuration
  - Ensure build completed successfully

### Cache issues

- **Issue:** Changes not appearing after deployment
- **Solution:** Content hashes handle cache-busting automatically. Clear Webflow's cache in project settings.

## ⚡ Performance Notes

- **Bundle size:** Single JS bundle ~100-200KB (minified)
- **CSS size:** Single CSS file ~50-100KB (minified)
- **GSAP:** Loaded globally (~60KB), not included in bundle
- **Swiper:** Only dependency included in bundle (~40KB)
- **Loading:** All scripts should use `defer` or load before `</body>`
- **Lazy loading:** Implement for images used in animations

## 🌍 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Latest 2 versions

ES2022 features used, ensure Webflow audience supports modern browsers.

## 📄 License

MIT

---

## 🚀 Quick Start for New Developers

1. **Clone and install:**

   ```bash
   git clone <repo>
   cd cbwigs
   npm install
   ```

2. **Start development:**

   ```bash
   npm run dev
   ```

3. **Make changes:**
   - Edit files in `src/js/` and `src/styles/`
   - Test in demo HTML files
   - Follow data-attribute patterns

4. **Deploy:**

   ```bash
   npm run deploy
   ```

5. **Update Webflow if needed:**
   - Scripts already point to Cloudflare Workers
   - Changes go live automatically after deployment

## 🤝 Contributing

When adding new features:

1. Follow existing code patterns
2. Use GSAP as global (don't import)
3. Add defensive element checks
4. Create demo HTML for testing
5. Document in `docs/` folder
6. Update this README if needed
7. Run linting before committing

---

**For questions or issues, refer to the comprehensive documentation in the `docs/` folder.**
