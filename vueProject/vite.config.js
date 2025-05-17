import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // 將所有 /api 開頭的請求，代理到本地的 3001 埠
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,   // 修改 host header 以符合目標伺服器
        secure: false,        // 如果後端是 HTTPS，且使用自簽憑證時可設 false
        // 可選：重寫路徑，刪除 /api 前綴
        // rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
