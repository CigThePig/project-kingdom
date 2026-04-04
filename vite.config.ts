import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
      },
      manifest: {
        name: 'Project Kingdom',
        short_name: 'Kingdom',
        description: 'A kingdom management simulation game',
        theme_color: '#1a1f2e',
        background_color: '#12151f',
        display: 'standalone',
        start_url: '/project-kingdom/',
        scope: '/project-kingdom/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  base: '/project-kingdom/',
})
