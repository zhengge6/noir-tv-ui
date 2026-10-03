import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" so the build also works from a sub-folder (GitHub Pages: /noir-tv-ui/demo/react/)
export default defineConfig({ base: "./", plugins: [react()] });
