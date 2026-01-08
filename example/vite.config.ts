import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import compression from "vite-plugin-compression";

// Define __dirname for ESM environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png", "og-preview.png"],
      manifest: {
        name: "PixelColors — Palette Extractor",
        short_name: "PixelColors",
        description: "Extract visual DNA from images using k-Means clustering.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        // icons: [
        //   {
        //     src: "pwa-192x192.png",
        //     sizes: "192x192",
        //     type: "image/png",
        //   },
        //   {
        //     src: "pwa-512x512.png",
        //     sizes: "512x512",
        //     type: "image/png",
        //   },
        //   {
        //     src: "pwa-512x512.png",
        //     sizes: "512x512",
        //     type: "image/png",
        //     purpose: "any maskable",
        //   },
        // ],
      },
    }),
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
    compression({
      algorithm: "gzip",
      ext: ".gz",
    }),
  ],
  base: "/pixel-colors/",
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
      allow: [".."],
    },
  },
});
