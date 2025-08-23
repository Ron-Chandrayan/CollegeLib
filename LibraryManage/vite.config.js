import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://libman.ethiccode.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/api/, '/api'),
      },
      '/altapi': {
        target: 'https://library-sies-92fbc1e81669.herokuapp.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/altapi/, '/api'),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});