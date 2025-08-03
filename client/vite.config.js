import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",   // Required for Render
    port: 5173,         // Or any port, Render will detect
  },
  preview: {
    host: '0.0.0.0',
    port: 4173, // or your port
    allowedHosts: ["webchat-frontend-m.onrender.com"], // ← Add your Render domain here
  },
  plugins: [react(), tailwindcss()],
})
