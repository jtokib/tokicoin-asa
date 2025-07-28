import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    devSourcemap: true
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
})