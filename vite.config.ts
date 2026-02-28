import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.API_URL

  return {
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
    server: {
      allowedHosts: [new URL(target).hostname],
      proxy: {
        '/auth': {
          target: target,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: target,
          changeOrigin: true,
          secure: false,
          headers: {
            Referer: target,
            Origin: target,
          },
          rewrite: (path) => path,
        },
        // Added proxy for general assets if they are relative
        '/assets': {
          target: target,
          changeOrigin: true,
          secure: false,
        },
        '/media': {
          target: target,
          changeOrigin: true,
          secure: false,
        },
        '/static': {
          target: target,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
