import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { compression } from "vite-plugin-compression2";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    emptyOutDir: true,
    minify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      treeshake: true,
    },
  },

  plugins: [
    tailwindcss(),
    react(),
    compression({
      include: [/\.js$/, /\.css$/],
      threshold: 1400,
    }),
  ],
});
