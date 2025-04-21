import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    manifest: true,
    outDir: "technote/static/dist",
    rollupOptions: {
      // overwrite default .html entry
      input: "src/web-client/main.jsx",
    },
    copyPublicDir: false,
  },
  server: {
    origin: "http://localhost:5173",
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@helpers": path.resolve(__dirname, "./src/web-client/app/helpers"),
      "@modules": path.resolve(__dirname, "./src/web-client/modules"),
      "@ui": path.resolve(__dirname, "./src/web-client/ui"),
      "@utils": path.resolve(__dirname, "./src/web-client/utils"),
    },
  },
});
