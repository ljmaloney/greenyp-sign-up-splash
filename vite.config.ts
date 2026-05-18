import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
      allowedHosts: [
          "localhost",
          "greenyp-fe-tst-alb-1524420982.us-east-1.elb.amazonaws.com",
          "test.greenyp.com",
          "greenyp.com",
          "www.greenyp.com"
      ]
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
}));
