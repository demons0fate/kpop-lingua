#!/usr/bin/env python3
"""Сжимает тяжёлые PNG-рамки карт в лёгкий WebP.

Запуск: python3 scripts/optimize_frames.py
Скрипт идемпотентный: повторный запуск просто пересоберёт .webp из .png,
а если PNG уже удалены — сообщит, что всё готово.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
FRAMES = ROOT / "img" / "frames"
MAX_WIDTH = 360
QUALITY = 64


def main():
    pngs = sorted(FRAMES.glob("*.png"))
    if not pngs:
        webps = sorted(FRAMES.glob("*.webp"))
        print("PNG-рамок нет. WebP на месте: %d шт." % len(webps))
        return

    for png in pngs:
        image = Image.open(png).convert("RGBA")
        if image.width > MAX_WIDTH:
            height = round(image.height * MAX_WIDTH / image.width)
            image = image.resize((MAX_WIDTH, height), Image.LANCZOS)
        out = png.with_suffix(".webp")
        image.save(out, "WEBP", quality=QUALITY, method=6, alpha_quality=90)
        old_kb = png.stat().st_size / 1024
        new_kb = out.stat().st_size / 1024
        print(
            "  %-11s %6.1f КБ -> %5.1f КБ (%d%%)"
            % (out.name, old_kb, new_kb, round(new_kb / old_kb * 100))
        )
        png.unlink()

    total = sum(p.stat().st_size for p in FRAMES.glob("*.webp")) / 1024
    print("Готово. Суммарный вес рамок: %.1f КБ" % total)


if __name__ == "__main__":
    main()
