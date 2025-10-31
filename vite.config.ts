import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // When deploying to GitHub Pages under a repo subpath, set GITHUB_PAGES=true at build time
  // so assets are emitted with the correct base (e.g., /minihiring-app/)
  base: process.env.GITHUB_PAGES === 'true' || process.env.GH_PAGES === 'true' ? '/minihiring-app/' : '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
