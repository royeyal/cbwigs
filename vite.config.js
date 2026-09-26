import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const src = path => resolve(root, 'src', path);

const assetFileNames = asset => {
  if (asset.name && asset.name.endsWith('.css')) {
    return 'css/[name].[hash][extname]';
  }
  return 'assets/[name].[hash][extname]';
};

// Webflow embeds these files as classic <script> tags, so each bundle must be wrapped in
// its own scope (IIFE). Unwrapped ES output leaks its minified top-level names onto window,
// which overwrote jQuery's `$` on the live site.
const format = 'iife';

// Main bundle: one flat JS file + one CSS file, served via /main.js and /main.css.
const mainBuild = {
  outDir: '../dist',
  manifest: true, // <-- critical for the Worker redirect
  cssCodeSplit: false, // Don't split CSS
  emptyOutDir: true,
  rollupOptions: {
    input: {
      main: src('js/main.js')
    },
    output: {
      format,
      // Keep your subfolders AND add a content hash for cache-busting
      entryFileNames: chunk =>
        chunk.name === 'main'
          ? 'js/[name].[hash].js'
          : 'assets/[name].[hash].js',
      chunkFileNames: 'assets/[name].[hash].js',
      assetFileNames,
      manualChunks: undefined // Disable code-splitting
    }
  }
};

// Standalone files for pages that don't load main.js, served via /draggable-slider.js,
// /parallax-image.js and /parallax-image.css. Built in a second pass (`--mode standalone`)
// because they share modules with main.js; a single multi-entry build would split that
// shared code into chunks and main.js would stop being one flat file.
const standaloneBuild = {
  outDir: '../dist',
  manifest: '.vite/manifest.standalone.json', // Read by the Worker alongside manifest.json
  cssCodeSplit: true, // parallax-image.css gets its own file
  emptyOutDir: false, // Keep the main build's output
  rollupOptions: {
    input: {
      'draggable-slider': src('js/draggable-infinite-slider-standalone.js'),
      'parallax-image': src('js/parallax-image-standalone.js'),
      'parallax-image-css': src('styles/parallax-image.css')
    },
    output: {
      // Rolldown only allows format 'iife' for a single input, so wrap each file in a
      // function scope instead. These entries have no imports/exports; if one ever did,
      // the wrapped code would not parse and terser would fail the build.
      banner: '(function(){',
      footer: '})();',
      entryFileNames: 'js/[name].[hash].js',
      chunkFileNames: 'assets/[name].[hash].js',
      assetFileNames
    }
  }
};

export default defineConfig(({ mode }) => ({
  root: 'src',
  build: {
    ...(mode === 'standalone' ? standaloneBuild : mainBuild),
    modulePreload: false, // Disable module preload
    minify: 'terser',
    terserOptions: {
      compress: {
        // Strip debug logging from production bundles; keep console.warn/error
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        drop_debugger: true
      },
      format: {
        comments: false
      }
    },
    sourcemap: false
  },
  css: {
    postcss: './postcss.config.js'
  },
  server: {
    port: 3000,
    open: true
  }
}));
