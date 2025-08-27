import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/Ultimate-D-D-Tools/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure proper handling of dynamic imports and routing
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          state: ['zustand'],
          charts: ['recharts']
        }
      }
    }
  }
})
