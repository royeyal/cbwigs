# cbwigs
Code for cbwigs.co.il

# GSAP Animations for Webflow

A modern development setup for creating GSAP animations for Webflow projects with PostCSS and automated linting.

## 🚀 Features

- **Vite** for fast development and optimized builds
- **GSAP** animations and interactions
- **PostCSS** with Autoprefixer and CSS minification
- **ESLint + Prettier** for code quality
- **Stylelint** for CSS linting
- **Husky** for Git hooks and pre-commit linting
- **Optimized builds** for Webflow integration

## 📁 Project Structure

```
src/
├── js/                 # JavaScript animations
│   └── textreveal.js   # Text reveal animation
├── styles/             # CSS files
│   └── main.css        # Main styles
└── index.html          # Development HTML (optional)

dist/                   # Built files for production
├── js/                 # Minified JavaScript
└── css/                # Minified CSS
```

## 🛠️ Setup

1. Install dependencies:
```bash
npm install
```

2. Initialize Husky (if needed):
```bash
npm run prepare
```

## 🏃‍♂️ Development

Start the development server:
```bash
npm run dev
```

## 🏗️ Build for Production

Build minified files for Webflow:
```bash
npm run build
```

This creates optimized files in the `dist/` folder:
- `dist/js/main.js` - Single bundled JavaScript file with all animations
- `dist/css/main.css` - Minified CSS

## 📝 Adding New Animations

1. Create a new JavaScript file in `src/js/`
2. Import and initialize it in `src/js/main.js`
3. Create corresponding CSS in `src/styles/`
4. Build and upload to Webflow

## 🎯 Webflow Integration

1. Run `npm run build`
2. Upload files from `dist/js/` and `dist/css/` to Webflow
3. Add script tags in Webflow's custom code section

Example:
```html
<script src="https://your-site.webflow.io/js/main.js"></script>
<link rel="stylesheet" href="https://your-site.webflow.io/css/main.css">
```

## 🧹 Code Quality

- `npm run lint` - Lint JavaScript
- `npm run lint:css` - Lint CSS
- `npm run format` - Format all files

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint JavaScript files
- `npm run lint:css` - Lint CSS files
- `npm run format` - Format code with Prettier
- `npm run clean` - Remove dist folder

## 🎨 Animation Usage

### Text Reveal Animation

Add the `data-split` attribute to any heading:

```html
<h1 data-split="heading" data-split-reveal="lines">Your heading</h1>
```

Options for `data-split-reveal`:
- `lines` - Animate by lines
- `words` - Animate by words
- `chars` - Animate by characters
