import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        why: resolve(__dirname, "why/index.html")
      }
    }
  }
});
