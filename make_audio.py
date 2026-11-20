import asyncio
import os
import re
import edge_tts
from gtts import gTTS

os.makedirs("audio", exist_ok=True)

with open("lessons.js", "r", encoding="utf-8") as f:
    text = f.read()

items = {}
for kr, path in re.findall(r'kr:\s*"([^"]+)"[^\n]*?file:\s*"(audio/[^"]+\.mp3)"', text):
    items[path] = kr
for path, kr in re.findall(r'file:\s*"(audio/[^"]+\.mp3)"[^\n]*?audioText:\s*"([^"]+)"', text):
    items[path] = kr

async def main():
    print(f"Найдено фраз: {len(items)}")
    for path, kr in items.items():
        if os.path.exists(path):
            continue
        try:
            print(f"Edge TTS: {kr} -> {path}")
            comm = edge_tts.Communicate(kr, "ko-KR-SunHiNeural", rate="-10%")
            await comm.save(path)
            await asyncio.sleep(0.2)
        except Exception as e:
            print(f"Fallback gTTS для {path}: {e}")
            gTTS(text=kr, lang="ko").save(path)

if __name__ == "__main__":
    asyncio.run(main())
