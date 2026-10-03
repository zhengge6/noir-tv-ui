# NOIR TV UI documentation

- [Core (vanilla)](#core-vanilla)
- [React](#react)
- [Vue](#vue)
- [Theming](#theming)
- [Brand assets](#brand-assets)

All three packages render the same markup and CSS classes from [`packages/core/noir.css`](../packages/core/noir.css),
so a screen built with React looks identical to one built with Vue or plain HTML.

## Core (vanilla)

Include `tokens.css`, `noir.css` and `noir.js`. The script defines `window.NOIR`. Bundlers can `import NOIR from "@noir-tv-ui/core"`
(the ES module entry runs the same script and re-exports its helpers, and it is safe to import during SSR).

| API | Description |
|---|---|
| `NOIR.input.init({ tv })` | Adds `html.kbd` on the first arrow key or Tab and removes it on touch or mouse. `tv: true` forces `html.tv`. Installed once. |
| `NOIR.input.isKeyboard()` | `true` when keyboard or remote visuals are active. |
| `NOIR.focus.init()` | Arrow keys move focus geometrically. Skips events that are already `defaultPrevented`. Installed once. |
| `NOIR.focus.move(dir)` / `NOIR.focus.to(el)` | Move focus programmatically; `to` also scrolls rows and the page so the element is visible. |
| `NOIR.backStack(onLevel)` | Returns `{ push, replace, back, home, top, depth, destroy }`. `onLevel(tag)` runs on `popstate` with the level now on top (`""` = home). |
| `NOIR.sheet(modalEl, nav?)` | `{ open(fill?), close(fromPop?), isOpen() }` for a `.noir-modal`. Pushes `#detail` when given a back stack. |
| `NOIR.confirm(el, nav?)` | `{ open(text, onYes), close(ok?, fromPop?), isOpen() }` for a `.noir-confirm`. Its own back level. |
| `NOIR.longPress(container, selector, cb)` | Touch long-press (500 ms) and remote OK held for 600 ms or more. |
| `NOIR.manager(opts)` | Management mode: × per card, multi-select, select all, delete with confirm. See [`demo/index.html`](../demo/index.html). |
| `NOIR.toast(message, ms?)` | Small transient message. |

## React

`@noir-tv-ui/react` (React 18 or 19). Import the core CSS once in your entry file.

| Export | Props / signature |
|---|---|
| `NavBar` | `items: { id, label, dot? }[]`, `active?`, `onSelect?(id)`, `brand?`, `onBrand?()`, `actions?` |
| `IconButton` | Button props. Put an inline `<svg>` inside. |
| `Hero` | `title`, `art?` (CSS background), `badge?`, `tagline?`, `score?`, `pill?`, `description?`, `actions?` |
| `PosterRows` | Wrapper that lets rows overlap the hero. |
| `PosterRow` | `title`, `subtitle?`, `action?`, children are cards |
| `PosterGrid` | Responsive grid wrapper. |
| `PosterCard` | `title`, `posterTitle?`, `art?`, `image?`, `watch?: "none" \| "progress" \| "finished" \| "updated"`, `progress?: 0–100`, `updateLabel?`, `rank?: 1–10`, plus button props |
| `Pill` | `variant?: "play" \| "ghost" \| "glass" \| "danger"`, `on?`, `icon?`, `autoFocusOnOpen?`, plus button props |
| `Chip` | `on?`, plus button props |
| `BottomSheet` | `open`, `onClose()`, `title`, `art?`, `image?`, `actions?`, `closeLabel?`, children are the body |
| `useBackStack(onLevel?)` | `{ level, push, replace, back, home, depth }`; `level` re-renders on push, replace and system back |
| `useDpadFocus({ tv? })` | Installs `NOIR.input` and `NOIR.focus` once |
| `toast(message, ms?)` | Core toast |

Typical flow: `nav.push("detail")` opens, `<BottomSheet open={nav.level === "detail"} onClose={() => nav.back("detail")}>`
closes, and Android system back pops the same entry. For tabs, `push` the first sub-page and `replace` between siblings.

## Vue

`@noir-tv-ui/vue` (Vue 3.3+). The components are written with `defineComponent` and render functions, so they need no SFC compiler.

| Export | Props / events / slots |
|---|---|
| `NavBar` | props `items`, `active`, `brand`; events `select(id)`, `brand`; slots `brand`, `actions` |
| `IconButton` | default slot |
| `Hero` | props `title`, `art`, `badge`, `tagline`, `score`, `pill`, `description`; slots `title`, `actions` |
| `PosterRows`, `PosterGrid` | default slot |
| `PosterRow` | props `title`, `subtitle`; slots `default`, `action` |
| `PosterCard` | props `title`, `posterTitle`, `art`, `image`, `watch`, `progress`, `updateLabel`, `rank`; event `select` |
| `Pill` | props `variant`, `on`, `autofocusOnOpen`; slots `default`, `icon` |
| `Chip` | prop `on`; default slot |
| `BottomSheet` | props `open`, `title`, `art`, `image`, `closeLabel`; event `close`; slots `default`, `actions` |
| `useBackStack(onLevel?)` | `{ level: Readonly<Ref<string>>, push, replace, back, home, depth }` |
| `useDpadFocus({ tv? })` | Installs `NOIR.input` and `NOIR.focus` once (on mount) |
| `toast(message, ms?)` | Core toast |
| `NoirPlugin` | `app.use(NoirPlugin)` registers `NoirPosterCard`, `NoirHero` and the rest globally |

Native listeners such as `@click` fall through to the root `<button>` of `Pill`, `Chip` and `IconButton`.

## Theming

Override tokens on `:root` (or any container):

```css
:root {
  --noir-brand: #7c5cff;
  --noir-brand-glow: rgba(124, 92, 255, .6);
  --noir-radius-poster: 10px;
  --noir-font-display: "Your Display Face", var(--noir-font-body);
}
```

See [`packages/core/fonts/README.md`](../packages/core/fonts/README.md) for subsetting and self-hosting the CJK display font.

## Brand assets

See [`brand/README.md`](../brand/README.md).
