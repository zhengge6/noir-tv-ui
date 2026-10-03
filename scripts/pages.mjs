#!/usr/bin/env node
// Copies the example builds into demo/react and demo/vue for GitHub Pages (run `npm run pages`).
import { cpSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const [src, dest] of [["examples/react-vite/dist", "demo/react"], ["examples/vue-vite/dist", "demo/vue"]]) {
  const from = join(root, src), to = join(root, dest);
  if (!existsSync(from)) throw new Error(`missing ${src}; run npm run build first`);
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
  console.log(`${src} -> ${dest}`);
}
