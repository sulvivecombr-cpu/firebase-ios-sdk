import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    strictPort: true,
    watch: { usePolling: true },
    proxy: {
      "/firestore": {
        target: "http://firestore:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/firestore/, ""),
      },
    },
  },
});
