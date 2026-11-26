import { defineConfig } from "vite";

// GitHub Pages project site: https://ginka-kaisya.github.io/portfoli/
const pagesBase = "/portfoli/";

export default defineConfig({
  base: pagesBase,
  server: {
    host: "0.0.0.0",
    port: 47281,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 47281,
    strictPort: true,
  },
});
