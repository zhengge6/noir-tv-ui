# Fonts

NOIR's display face is **ZCOOL QingKe HuangYou** (站酷庆科黄油体), designed by 庆科 (Qingke) with ZCOOL.
It is licensed under the **SIL Open Font License, Version 1.1** (<https://openfontlicense.org>).

- Google Fonts: <https://fonts.google.com/specimen/ZCOOL+QingKe+HuangYou>
- The demo loads it from Google Fonts, so this repository ships no font binaries.

## Self-hosting (recommended for TV boxes and WebViews)

CJK fonts are large. To self-host, subset the font to the characters you need and split it into
`unicode-range` slices, so the browser downloads only the slices that contain on-screen glyphs:

```bash
pip install fonttools brotli
# one slice: ASCII, UI strings, and the most frequent title characters
pyftsubset ZCOOLQingKeHuangYou-Regular.ttf --text-file=core-chars.txt \
  --flavor=woff2 --output-file=noir-display-00.woff2
```

```css
@font-face {
  font-family: "NOIR Display";
  src: url("noir-display-00.woff2") format("woff2");
  font-display: swap;
  unicode-range: U+20-7E, U+4E00, U+4E0A; /* the code points in this slice */
}
```

Serve the slices with `Cache-Control: public, max-age=31536000, immutable`, and put a version in the
file names. `tokens.css` already lists `"NOIR Display"` as a fallback family.

Any redistributed or modified font must stay under the OFL. Reserved font names may not be used for
modified versions.
