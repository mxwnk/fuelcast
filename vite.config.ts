import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://mxwnk.github.io/fuelcast/ on GitHub Pages
  base: '/fuelcast/',
  plugins: [react(), tailwindcss()],
})
