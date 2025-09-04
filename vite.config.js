import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // Main entry points for different animations
        textreveal: resolve(__dirname, 'src/js/textreveal.js'),
        // Add more animation entry points here as needed
        // scrollanimations: resolve(__dirname, 'src/js/scrollanimations.js'),
        // interactions: resolve(__dirname, 'src/js/interactions.js'),
        
        // CSS files
        main: resolve(__dirname, 'src/styles/main.css'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name.endsWith('.css') ? 'css/[name].min.css' : 'js/[name].min.js';
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
        chunkFileNames: 'js/[name]-[hash].js',
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
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