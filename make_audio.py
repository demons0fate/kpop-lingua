#!/usr/bin/env python3
"""Генерирует TTS-озвучку для всех фраз из data/*.json.

Запуск:  python3 make_audio.py
Нужны пакеты: edge-tts, gtts (см. GitHub Actions).
"""

import asyncio
import json
import os
from pathlib import Path

import edge_tts
from gtts import gTTS

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
AUDIO = ROOT / "audio"


def collect(node, items):
    """Рекурсивно собирает пары «файл → корейская фраза» из JSON данных."""
    if isinstance(node, dict):
        file_path = node.get("file") or node.get("quoteFile")
        text = node.get("audioText") or node.get("kr") or node.get("quoteKr")
        if file_path and text and str(file_path).startswith("audio/"):
            items[str(file_path)] = str(text)
        for value in node.values():
            collect(value, items)
    elif isinstance(node, list):
        for value in node:
            collect(value, items)


def load_items():
    items = {}
    if not DATA.exists():
        return items
    for path in sorted(DATA.glob("*.json")) + sorted((DATA / "lessons").glob("*.json")):
        with path.open(encoding="utf-8") as f:
            collect(json.load(f), items)
    return items


async def main():
    AUDIO.mkdir(exist_ok=True)
    os.chdir(ROOT)
    items = load_items()
    print("Найдено фраз: %d" % len(items))

    for path, korean in items.items():
        if os.path.exists(path):
            continue
        try:
            print("Edge TTS: %s -> %s" % (korean, path))
            communicate = edge_tts.Communicate(korean, "ko-KR-SunHiNeural", rate="-10%")
            await communicate.save(path)
            await asyncio.sleep(0.2)
        except Exception as error:
            print("Fallback gTTS для %s: %s" % (path, error))
            gTTS(text=korean, lang="ko").save(path)


if __name__ == "__main__":
    asyncio.run(main())
