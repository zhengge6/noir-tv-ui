import type { NoirApi } from "@noir-tv-ui/core";
import "@noir-tv-ui/core";

/** The shared core runtime (window.NOIR), or undefined during SSR. */
export function noir(): NoirApi | undefined {
  return typeof window !== "undefined" ? window.NOIR : undefined;
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
