import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // 将 /api 请求代理到后端服务器
      '/api': {
        // 后端服务器地址，可通过环境变量配置
        target: process.env.VITE_API_PROXY_TARGET || 'http://121.4.203.60:8081',
        changeOrigin: true,
        // 不重写路径，保持 /api 前缀
      },
    },
  },
})
