/*!
 * NOIR TV UI — ES module entry. Runs noir.js (which defines window.NOIR) and re-exports its helpers,
 * so bundlers (Vite, webpack, Rollup) and the React / Vue packages share one implementation.
 * Safe to import during SSR: every export is undefined until it runs in a browser.
 */
import "./noir.js";

const NOIR = typeof window !== "undefined" ? window.NOIR : undefined;
export default NOIR;
export const input = NOIR && NOIR.input;
export const backStack = NOIR && NOIR.backStack;
export const focus = NOIR && NOIR.focus;
export const longPress = NOIR && NOIR.longPress;
export const manager = NOIR && NOIR.manager;
export const sheet = NOIR && NOIR.sheet;
export const confirm = NOIR && NOIR.confirm;
export const toast = NOIR && NOIR.toast;
