import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/doctors': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/patients': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/referrals': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/notifications': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          antd: ['antd', '@ant-design/icons'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
})
