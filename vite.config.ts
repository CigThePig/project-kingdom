import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const basePath = process.env.VITE_BASE_PATH ?? '/project-kingdom/'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
      },
      manifest: {
        name: 'Crown & Council',
        short_name: 'Crown & Council',
        description: 'A mobile-first kingdom management card game',
        theme_color: '#1a1714',
        background_color: '#1a1714',
        display: 'standalone',
        start_url: basePath,
        scope: basePath,
        icons: [],
      },
    }),
  ],
  base: basePath,
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'game-data': [
            './src/data/events/index.ts',
            './src/data/events/effects.ts',
            './src/data/decrees/index.ts',
            './src/data/decrees/effects.ts',
            './src/data/storylines/index.ts',
            './src/data/storylines/effects.ts',
            './src/data/text/events.ts',
            './src/data/text/labels.ts',
          ],
          'scenarios': [
            './src/data/scenarios/default.ts',
            './src/data/scenarios/fractured-inheritance.ts',
            './src/data/scenarios/merchants-gambit.ts',
            './src/data/scenarios/frozen-march.ts',
            './src/data/scenarios/faithful-kingdom.ts',
          ],
        },
      },
    },
  },
})
