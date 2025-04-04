import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    manifest: true,
    outDir: 'app/static/dist',
    rollupOptions: {
      // overwrite default .html entry
      input: 'src/web-client/main.jsx',
    },
    copyPublicDir: false,
  },
  server: {
    origin: 'http://localhost:5173',
    port: 5173,
    strictPort: true,
  },
})
