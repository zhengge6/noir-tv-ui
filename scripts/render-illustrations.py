#!/usr/bin/env python3
"""Render docs/illustrations/*.html to docs/assets/*.png with headless Chrome (Playwright).

Each page declares its output on <body>: data-out="name.png" data-w="1440" data-h="880" data-dsf="1.25".
Usage: pip install playwright && python3 scripts/render-illustrations.py [page.html ...]
Pages load fonts from the system (Inter, Geist Mono) and Google Fonts (ZCOOL QingKe HuangYou).
"""
import asyncio, pathlib, re, sys
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "docs" / "illustrations", ROOT / "docs" / "assets"

def meta(path):
    m = re.search(r'<body[^>]*data-out="([^"]+)"[^>]*data-w="(\d+)"[^>]*data-h="(\d+)"[^>]*data-dsf="([\d.]+)"', path.read_text())
    return (m.group(1), int(m.group(2)), int(m.group(3)), float(m.group(4))) if m else None

async def main(names):
    pages = [SRC / n for n in names] if names else sorted(SRC.glob("*.html"))
    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch(channel="chrome", args=["--allow-file-access-from-files"])
        except Exception:
            browser = await p.chromium.launch(args=["--allow-file-access-from-files"])
        for page_path in pages:
            m = meta(page_path)
            if not m:
                continue
            out, w, h, dsf = m
            pg = await browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=dsf)
            await pg.goto(page_path.as_uri())
            await pg.wait_for_load_state("networkidle")
            await pg.evaluate("document.fonts.ready")
            for fr in pg.frames:
                try: await fr.evaluate("document.fonts.ready")
                except Exception: pass
            await pg.wait_for_timeout(700)
            await pg.screenshot(path=str(OUT / out))
            await pg.close()
            print(f"{page_path.name} -> docs/assets/{out} ({int(w * dsf)}x{int(h * dsf)})")
        await browser.close()

asyncio.run(main(sys.argv[1:]))
