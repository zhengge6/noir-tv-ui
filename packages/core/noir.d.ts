/** Type declarations for @noir-tv-ui/core (noir.js / noir.mjs). */
export interface NoirBackStack {
  /** Push a new level (e.g. "detail"). Adds `#tag` to the URL so Android WebView hosts see a new entry. */
  push(tag: string): void;
  /** Replace the current level (sibling tabs). */
  replace(tag: string): void;
  /** Pop one level; with a tag, only if that level is on top (prevents double pops). */
  back(tag?: string): void;
  /** Pop every level and return home. */
  home(): void;
  /** The tag on top ("" = home). */
  top(): string;
  /** Number of pushed levels. */
  depth(): number;
  /** Remove the popstate listener (call on unmount). */
  destroy(): void;
}
export interface NoirInput { init(opts?: { tv?: boolean }): void; isKeyboard(): boolean; }
export type NoirDirection = "left" | "right" | "up" | "down";
export interface NoirFocus {
  selector: string;
  init(): void;
  move(dir: NoirDirection): void;
  to(el: Element): void;
}
export interface NoirSheet { open(fill?: (modal: HTMLElement) => void): void; close(fromPop?: boolean): void; isOpen(): boolean; }
export interface NoirConfirm { open(text: string, onYes: () => void): void; close(ok?: boolean, fromPop?: boolean): void; isOpen(): boolean; }
export interface NoirApi {
  version: string;
  input: NoirInput;
  backStack(onLevel: (tag: string) => void): NoirBackStack;
  focus: NoirFocus;
  longPress(container: Element, selector: string, cb: (el: Element) => void): void;
  manager(opts: Record<string, unknown>): { open(preselect?: string): void; render(focusId?: string): void };
  sheet(modal: HTMLElement, nav?: NoirBackStack): NoirSheet;
  confirm(el: HTMLElement, nav?: NoirBackStack): NoirConfirm;
  toast(msg: string, ms?: number): void;
}
declare const NOIR: NoirApi | undefined;
export default NOIR;
export declare const input: NoirInput | undefined;
export declare const backStack: NoirApi["backStack"] | undefined;
export declare const focus: NoirFocus | undefined;
export declare const longPress: NoirApi["longPress"] | undefined;
export declare const manager: NoirApi["manager"] | undefined;
export declare const sheet: NoirApi["sheet"] | undefined;
export declare const confirm: NoirApi["confirm"] | undefined;
export declare const toast: NoirApi["toast"] | undefined;
declare global { interface Window { NOIR?: NoirApi } }
