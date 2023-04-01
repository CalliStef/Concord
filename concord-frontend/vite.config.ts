import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://0.0.0.0:5261",
      "/r": {
        target: "http://0.0.0.0:5261",
        ws: true,
      },
    },
  },
  plugins: [react()],
})
