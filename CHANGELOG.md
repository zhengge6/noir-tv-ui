# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed
- README header uses the dark NOIR lockup (`brand/readme-logo.png`) in both light and dark mode.
- All README illustrations redrawn in the brand language (deep black, eclipse ring, rounded tiles): home concept,
  phone screens, design-token sheet, and new banners for watch states, D-pad focus and the back stack.
  Their sources are HTML pages in `docs/illustrations`, rendered with `scripts/render-illustrations.py`.

### Fixed
- `.noir-hero-vig`: the bottom fade now sits above the side vignette, so there is no visible seam where the hero meets the rows.

## [0.2.0] - 2026-10-03

### Added
- **Monorepo layout** with npm workspaces: `packages/core`, `packages/react`, `packages/vue`.
- **`@noir-tv-ui/react`**: typed `NavBar`, `IconButton`, `Hero`, `PosterRows`, `PosterRow`, `PosterGrid`, `PosterCard`
  (watch-state and TOP10 rank props), `Pill`, `Chip` and `BottomSheet`, plus the `useBackStack` and `useDpadFocus` hooks and `toast`.
- **`@noir-tv-ui/vue`**: the same components built with `defineComponent`, the `useBackStack` and `useDpadFocus` composables, and an optional `NoirPlugin`.
- **Examples**: `examples/react-vite` and `examples/vue-vite`, also published to GitHub Pages at `demo/react/` and `demo/vue/`.
- **Core ES module entry** (`noir.mjs`) and TypeScript declarations (`noir.d.ts`).
- **Brand kit**: a hand-built SVG mark, the wordmark, dark and light lockups, and a social preview (`brand/`).
- Docs, CONTRIBUTING, Code of Conduct, and issue and pull request templates.

### Changed
- `tokens.css`, `noir.css`, `noir.js` and `fonts/` moved to `packages/core/`. The Pages demo now loads them from there.
- `NOIR.backStack()` returns `destroy()` to remove its `popstate` listener.
- `NOIR.input.init()` and `NOIR.focus.init()` install their listeners only once. Focus ignores key events that are already `defaultPrevented`.
- `noir.js` no longer throws when evaluated outside a browser (SSR).

## [0.1.0] - 2026-10-03

### Added
- Initial release: design tokens, components (top nav, hero, poster rows, TOP10 numerals, watch-state badges, pills,
  chips, detail sheet, grid, management mode, confirm, toast), D-pad focus, WebView-safe back stack and the demo.

[0.2.0]: https://github.com/zhengge6/noir-tv-ui/compare/93ddd1a...main
[0.1.0]: https://github.com/zhengge6/noir-tv-ui/commit/93ddd1a
