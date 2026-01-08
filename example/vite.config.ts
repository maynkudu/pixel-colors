import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/pixel-colors",
  resolve: {
    alias: {
      "pixel-colors": path.resolve(__dirname, "../src/index.ts"),
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 3000,
    fs: {
      // Allow Vite to serve files from one level up (the library src)
      allow: [".."],
    },
  },
});
