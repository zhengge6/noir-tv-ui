import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { NoirBackStack } from "@noir-tv-ui/core";
import { noir } from "./noir.js";

export interface BackStack {
  /** The level on top of the stack ("" = home). Re-renders on push, replace and system back. */
  level: string;
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
 *   <BottomSheet open={nav.level === "detail"} onClose={() => nav.back("detail")} />
 *   onClick={() => nav.push("detail")}
 */
export function useBackStack(onLevel?: (tag: string) => void): BackStack {
  const [level, setLevel] = useState("");
  const stack = useRef<NoirBackStack | null>(null);
  const cb = useRef(onLevel);
  cb.current = onLevel;

  useEffect(() => {
    const N = noir();
    if (!N) return;
    const s = N.backStack((tag) => {
      setLevel(tag);
      cb.current?.(tag);
    });
    stack.current = s;
    setLevel(s.top());
    return () => {
      s.destroy();
      if (stack.current === s) stack.current = null;
    };
  }, []);

  const push = useCallback((tag: string) => { stack.current?.push(tag); setLevel(tag); }, []);
  const replace = useCallback((tag: string) => { stack.current?.replace(tag); setLevel(tag); }, []);
  const back = useCallback((tag?: string) => { stack.current?.back(tag); }, []);
  const home = useCallback(() => { stack.current?.home(); }, []);
  const depth = useCallback(() => stack.current?.depth() ?? 0, []);

  return useMemo(() => ({ level, push, replace, back, home, depth }), [level, push, replace, back, home, depth]);
}

/**
 * Turns on TV / keyboard focus visuals and geometric arrow-key focus movement (installed once per page).
 * Pass `{ tv: true }` on TV boxes to show focus rings from the start.
 */
export function useDpadFocus(opts: { tv?: boolean } = {}): void {
  const tv = !!opts.tv;
  useEffect(() => {
    const N = noir();
    if (!N) return;
    N.input.init({ tv });
    N.focus.init();
  }, [tv]);
}

/** Show a toast using the core toast element. */
export function toast(message: string, ms?: number): void {
  noir()?.toast(message, ms);
}
