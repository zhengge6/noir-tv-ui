import type { App } from "vue";
import { BottomSheet, Chip, Hero, IconButton, NavBar, Pill, PosterCard, PosterGrid, PosterRow, PosterRows } from "./components.js";

export { BottomSheet, Chip, Hero, IconButton, NavBar, Pill, PosterCard, PosterGrid, PosterRow, PosterRows };
export type { PillVariant, WatchState, NavItem } from "./components.js";
export { useBackStack, useDpadFocus, toast } from "./composables.js";
export type { BackStack } from "./composables.js";
export { noir } from "./noir.js";

/** Optional plugin: registers every component globally as Noir<Name> (e.g. <NoirPosterCard>). */
export const NoirPlugin = {
  install(app: App) {
    const all = { BottomSheet, Chip, Hero, IconButton, NavBar, Pill, PosterCard, PosterGrid, PosterRow, PosterRows };
    for (const [name, c] of Object.entries(all)) app.component("Noir" + name, c);
  },
};
