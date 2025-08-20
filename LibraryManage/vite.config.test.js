import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * This is a test configuration for Vite that points to the test server
 * for library attendance API endpoints.
 * 
 * To use this configuration, run:
 * npm run dev -- --config vite.config.test.js
 */
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://libman.ethiccode.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/api/, '/api'),
      },
      // Test configuration for library attendance API
      '/api/library': {
        target: 'http://localhost:5050',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
