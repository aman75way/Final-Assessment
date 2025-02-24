import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        exportType: "named",
        ref: true,
        svgo: false,
        titleProp: true,
      },
    }),
    react(),
  ],
  define: {
    "process.env": {}, // Ensures compatibility with some dependencies
  },
  server: {
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
