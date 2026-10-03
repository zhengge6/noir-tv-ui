# Contributing to NOIR TV UI

Thanks for helping. This is a small project, so the process is light.

## Setup

```bash
git clone https://github.com/zhengge6/noir-tv-ui.git && cd noir-tv-ui
npm install
npm run build                       # type-checks and builds packages and both examples
npm run dev -w example-react-vite   # or example-vue-vite
```

The vanilla demo needs no build. Open `demo/index.html` in a browser, and add `?tv=1` to force TV focus visuals.

## Ground rules

- **Core first.** Visual changes go into `packages/core` (`tokens.css` / `noir.css`). The React and Vue packages only
  render the same classes, so keep all three in sync in the same pull request.
- **Zero runtime dependencies** for every package. React and Vue are peer dependencies.
- **`noir.js` stays ES5** so it runs on old Android TV WebViews.
- **Test with a keyboard.** Arrow keys, Enter, Esc and browser back should behave as a TV remote and Android back would.
- **Demo content stays abstract**: gradient placeholders and invented titles only. No real titles, posters, logos,
  server addresses or credentials.
- Run `npm run pages` if you change an example, so the Pages demos under `demo/react` and `demo/vue` stay current.

## Pull requests

1. Open an issue first for anything larger than a small fix.
2. Keep the pull request focused, and describe what you tested (devices, WebView version, input method).
3. Add a line to `CHANGELOG.md` under an "Unreleased" heading.

By contributing, you agree that your work is released under the [MIT License](LICENSE) and that you will follow the
[Code of Conduct](CODE_OF_CONDUCT.md).
