import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // 用相對路徑，部署到任何子路徑（例如 GitHub Pages）都能用
  base: './',
  server: { host: true },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: '家庭闖關村',
        short_name: '闖關村',
        description: '把考卷變成冒險任務，一起蓋村莊！',
        lang: 'zh-TW',
        display: 'standalone',
        orientation: 'any',
        background_color: '#fff8ec',
        theme_color: '#ff8a3d',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
