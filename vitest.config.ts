import { defineConfig } from 'vitest/config'

// 測試只跑純邏輯和資料檢查，不需要瀏覽器環境，也不載入 PWA 外掛
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
