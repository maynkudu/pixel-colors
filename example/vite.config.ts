import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/pixel-colors/",
  resolve: {
    alias: {
      "pixel-colors": path.resolve(__dirname, "../src/index.ts"),
    },
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 3000,
  },
});
