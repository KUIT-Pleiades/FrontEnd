import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      manifest: {
        name: "Pleiades",
        short_name: "Pleiades",
        description: "Pleiades - A new way to connect",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pleiadesLogo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pleiadesLogo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
