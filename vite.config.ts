import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // --- ADD THIS SECTION ---
  server: {
    proxy: {
      '/api': {
        target: 'https://rokafcoding.com',
        changeOrigin: true,
        secure: false,
        headers: {
          Referer: 'https://rokafcoding.com',
          Origin: 'https://rokafcoding.com',
        },
        // The backend expects /api/accounts, so we don't need to rewrite the path if the frontend requests /api/accounts
        rewrite: (path) => path,
      },
    },
  },
})