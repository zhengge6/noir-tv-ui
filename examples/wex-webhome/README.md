# WEX WebHome — production homepage showcase

A single-file **Douban-driven streaming homepage** for [webhtv](https://github.com/webhtv/webhtv)
(FongMi-based Android TV app), built with the NOIR TV UI design language.

- **One file, ES5-only** — no build step, no framework, compatible with Chromium 51+ WebViews.
- **Netflix / Apple TV style hero** — rounded sharp card on the right, cinematic gradient
  light field, stateless uniform random pick from a pre-cached catalog, slow opacity crossfade.
- **iOS floating islands** — search capsule top-left, centered nav capsule, gradient-blur glass,
  hide-on-scroll / focus, segmented white active pill.
- **TV-first D-pad** — index-based focus navigation (no global geometry scans), per-row focus
  memory, key-repeat throttle, one `#hash` per level, back-to-top marker that never leaks into
  the app's back stack.
- **Native SDK integration** — `fm.search` / `fm.vod` / `fm.history` / `fm.cache` / `fm.openKeep`
  / `fm.preloadArtwork`, stale-while-revalidate caches, poster cache for empty `vodPic`.

## Files

| File | Purpose |
|---|---|
| `home.html` | The complete homepage (markup + CSS + JS in one file) |
| `fonts/wext-v1.woff2` | "WEXTitle" display-font subset (ZCOOL QingKe HuangYou, SIL OFL) |

## Running

Open `home.html` directly to see the shell (it shows a "browse mode" hint), or serve it inside
webhtv with the WEX relay config — data comes from the Douban rexxar API through the app's
`fm.req` bridge (or a `../db` relay in plain browsers).

> Data endpoints, images and the TV remote keymap are provided by the host environment;
> this showcase ships only the UI layer.
