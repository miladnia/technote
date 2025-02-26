import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
    strictPort: true,
  },
})
