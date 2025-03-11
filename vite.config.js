import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    manifest: true,
    outDir: 'static/dist',
    rollupOptions: {
      // overwrite default .html entry
      input: 'src/main.jsx',
    },
    copyPublicDir: false,
  },
  server: {
    origin: 'http://localhost:5173',
    port: 5173,
    strictPort: true,
  },
})
