import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // Single JS entry point that includes all animations
        'js/main': resolve(
          fileURLToPath(new URL('.', import.meta.url)),
          'src/js/main.js'
        ),

        // CSS files
        'css/main': resolve(
          fileURLToPath(new URL('.', import.meta.url)),
          'src/styles/main.css'
        )
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: assetInfo => {
          if (assetInfo.name?.endsWith('.css')) {
            return '[name].css';
          }
          return 'assets/[name][extname]';
        },
        chunkFileNames: 'js/[name]-[hash].js'
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
