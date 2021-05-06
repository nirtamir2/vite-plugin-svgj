import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import svgj from "vite-plugin-svgj";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), svgj()],
});
