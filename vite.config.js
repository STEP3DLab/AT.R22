import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//https://step3dlab.github.io/AT.R22//
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
