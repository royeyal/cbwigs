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
  manifest: true, // Read by the Worker to resolve the hashed filenames behind /main.js and /main.css
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

export default defineConfig({
  root: 'src',
  build: {
    ...mainBuild,
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
});
