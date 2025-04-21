import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/orders': {
        target: 'https://6804a7f279cb28fb3f5b7c04.mockapi.io/orders',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
