#!/usr/bin/env python3
"""Сжимает тяжёлые PNG-рамки карт из Figma в лёгкий WebP.

Запуск: python3 scripts/optimize_frames.py
Скрипт идемпотентный: повторный запуск просто пересоберёт .webp из .png,
а если PNG уже удалены — сообщит, что всё готово.

Рамки в Figma выгружены как 600x800 (3:4) — оставляем нативное разрешение,
чтобы линии и свечение оставались резкими на retina-экранах.
При quality=85 файлы весят ~55–80 КБ (цель ТЗ: 50–120 КБ).
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
FRAMES = ROOT / "img" / "frames"
MAX_WIDTH = 600
QUALITY = 85
ALPHA_QUALITY = 90


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
        image.save(out, "WEBP", quality=QUALITY, method=6, alpha_quality=ALPHA_QUALITY)
        old_kb = png.stat().st_size / 1024
        new_kb = out.stat().st_size / 1024
        print(
            "  %-17s %6.1f КБ -> %5.1f КБ (%d%%)"
            % (out.name, old_kb, new_kb, round(new_kb / old_kb * 100))
        )
        png.unlink()

    # Старые временные рамки (одинаковая заглушка на все ранги) больше не нужны.
    for legacy in ("silver.webp", "gold.webp", "platinum.webp", "neon.webp"):
        stale = FRAMES / legacy
        if stale.exists():
            stale.unlink()
            print("  Удалена старая заглушка: %s" % legacy)

    total = sum(p.stat().st_size for p in FRAMES.glob("*.webp")) / 1024
    print("Готово. Суммарный вес рамок: %.1f КБ" % total)


if __name__ == "__main__":
    main()
