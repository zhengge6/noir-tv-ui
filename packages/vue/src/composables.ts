import { onBeforeUnmount, onMounted, readonly, ref } from "vue";
import type { Ref } from "vue";
import type { NoirBackStack } from "@noir-tv-ui/core";
import { noir } from "./noir.js";

export interface BackStack {
  /** The level on top of the stack ("" = home). Updates on push, replace and system back. */
  level: Readonly<Ref<string>>;
  push(tag: string): void;
  replace(tag: string): void;
  /** Pop one level; with a tag, only when that level is on top. */
  back(tag?: string): void;
  home(): void;
  depth(): number;
}

/**
 * WebView-safe back stack. Every level gets its own `#hash` history entry, so Android hosts that compare
 * URLs (including the fragment) pop one level on system back instead of leaving the page.
 *
 *   const nav = useBackStack();
 *   <BottomSheet :open="nav.level.value === 'detail'" @close="nav.back('detail')" />
 */
export function useBackStack(onLevel?: (tag: string) => void): BackStack {
  const level = ref("");
  let stack: NoirBackStack | null = null;

  onMounted(() => {
    const N = noir();
    if (!N) return;
    stack = N.backStack((tag) => { level.value = tag; onLevel?.(tag); });
    level.value = stack.top();
  });
  onBeforeUnmount(() => { stack?.destroy(); stack = null; });

  return {
    level: readonly(level),
    push(tag) { stack?.push(tag); level.value = tag; },
    replace(tag) { stack?.replace(tag); level.value = tag; },
    back(tag) { stack?.back(tag); },
    home() { stack?.home(); },
    depth() { return stack?.depth() ?? 0; },
  };
}

/** Turns on TV / keyboard focus visuals and geometric arrow-key focus (installed once per page). */
export function useDpadFocus(opts: { tv?: boolean } = {}): void {
  onMounted(() => {
    const N = noir();
    if (!N) return;
    N.input.init({ tv: !!opts.tv });
    N.focus.init();
  });
}

/** Show a toast using the core toast element. */
export function toast(message: string, ms?: number): void {
  noir()?.toast(message, ms);
}
