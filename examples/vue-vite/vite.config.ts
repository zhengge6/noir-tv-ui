import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// base "./" so the build also works from a sub-folder (GitHub Pages: /noir-tv-ui/demo/vue/)
export default defineConfig({ base: "./", plugins: [vue()] });
