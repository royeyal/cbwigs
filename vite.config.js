import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    manifest: true,           // <-- critical for the Worker redirect
    cssCodeSplit: true,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(
          fileURLToPath(new URL('.', import.meta.url)),
          'src/js/main.js'
        ),
        'draggable-slider': resolve(
          fileURLToPath(new URL('.', import.meta.url)),
          'src/js/draggable-infinite-slider-standalone.js'
        )
      },
      output: {
        // Keep your subfolders AND add a content hash for cache-busting
        entryFileNames: (chunk) => {
          // For the main entry file, put it in js/ folder
          if (chunk.name === 'main' || chunk.name === 'draggable-slider') {
            return 'js/[name].[hash].js';
          }
          return 'assets/[name].[hash].js';
        },
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (asset) => {
          if (asset.name && asset.name.endsWith('.css')) {
            return 'css/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Temporarily keep console logs
        drop_debugger: true,
        // pure_funcs: ['console.log', 'console.info', 'console.debug'] // Commented out
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
