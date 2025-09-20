// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/AT.R22/',   // ← имя репозитория ТОЧНО с тем же регистром
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
})
