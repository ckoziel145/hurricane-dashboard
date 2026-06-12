import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative base so the build works at any path (GitHub Pages project sites
  // are served from /<repo>/, Vercel/Netlify from /).
  base: "./",
  plugins: [react()],
});
