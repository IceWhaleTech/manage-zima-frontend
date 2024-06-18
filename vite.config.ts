import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      // 代理所有以 /api 开头的请求
      '/api': {
        // target: 'http://localhost:3102/', // 替换为你的目标 API
        target: 'https://manage.icewhale.io', // 替换为你的目标 API
        // target: 'https://www.zimaspace.com', // 替换为你的目标 API
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // 去掉 /api 前缀
      }
    }
  }
})
