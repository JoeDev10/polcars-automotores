import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  // En GitHub Pages la web vive en /polcars-automotores/ (npm run build:pages)
  base: mode === 'pages' ? '/polcars-automotores/' : '/',
  // Escucha en IPv4 e IPv6 (y en la red local, para probar desde el celular)
  server: { host: true, port: 5173 },
}))
