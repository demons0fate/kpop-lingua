#!/usr/bin/env python3
"""Переносит данные из lessons.js / cards.js / rules.js / VOCAB в data/*.json.

Запуск:  python3 scripts/export_data.py

После миграции источник правды — файлы data/*.json, а старые JS можно удалить.
Скрипт это понимает: если исходников уже нет, он просто проверяет JSON на месте.
"""

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
LESSONS_DIR = DATA / "lessons"


def node(expr, sources=()):
    """Выполняет JS-выражение в одном vm-контексте и возвращает Python-объект."""
    code = "const vm=require('vm'),fs=require('fs');const ctx=vm.createContext({console});"
    for name in sources:
        code += "vm.runInContext(fs.readFileSync(%r,'utf8'),ctx);" % str(name)
    code += "process.stdout.write(JSON.stringify(vm.runInContext('(' + %r + ')',ctx)));" % expr
    res = subprocess.run(["node", "-e", code], cwd=ROOT, capture_output=True, text=True)
    if res.returncode != 0:
        sys.exit("Ошибка Node при чтении %s:\n%s" % (", ".join(sources), res.stderr.strip()))
    return json.loads(res.stdout or "null")


def read_vocab():
    """Достаёт массив VOCAB из инлайн-скрипта index.html (если он ещё там)."""
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    match = re.search(r"const VOCAB = (\[[\s\S]*?\n\]);", html)
    return node(match.group(1)) if match else None


def read_json(path, default=None):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return default


def dump(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("  + %s (%.1f КБ)" % (path.relative_to(ROOT), path.stat().st_size / 1024))


def verify():
    required = ["modules.json", "lessons-index.json", "cards.json", "vocab.json", "rules.json"]
    missing = [name for name in required if not (DATA / name).exists()]
    if not list(LESSONS_DIR.glob("lesson-*.json")):
        missing.append("lessons/*.json")
    if missing:
        sys.exit("Не хватает JSON: " + ", ".join(missing))
    print("Миграция уже выполнена: данные лежат в data/, старых JS-файлов нет.")


def main():
    has_lessons = (ROOT / "lessons.js").exists()
    has_cards = (ROOT / "cards.js").exists()
    rules_js = ROOT / "rules.js"
    has_rules = rules_js.exists() and "const RULES" in rules_js.read_text(encoding="utf-8")

    if not has_lessons and not has_cards:
        verify()
        return

    if not (has_lessons and has_cards):
        sys.exit("Для миграции нужны оба файла: lessons.js и cards.js.")

    print("Читаю данные из lessons.js, cards.js, rules.js и index.html...")
    modules = read_json(DATA / "modules.json", {"modules": []})
    lessons = node("LESSONS", ["lessons.js"]) or []
    eras = node("ERAS", ["cards.js"]) or []
    cards = node("CARDS", ["cards.js"]) or []
    rules = node("RULES", ["rules.js"]) if has_rules else None
    if rules is None:
        rules = read_json(DATA / "rules.json", {}).get("items", [])
    vocab = read_vocab()
    if vocab is None:
        vocab = read_json(DATA / "vocab.json", {}).get("items", [])

    module_of = {}
    for module in modules.get("modules", []):
        for lesson_id in module.get("lessonIds", []):
            module_of[lesson_id] = module["id"]

    index = []
    for lesson in lessons:
        lesson_id = lesson["id"]
        entry = {
            key: lesson[key]
            for key in ("id", "title", "desc", "coins", "xp", "isExam", "cardId")
            if key in lesson
        }
        entry["moduleId"] = module_of.get(lesson_id, "misc")
        entry["steps"] = len(lesson.get("steps", []))
        entry["file"] = "data/lessons/lesson-%02d.json" % lesson_id
        index.append(entry)
        dump(LESSONS_DIR / ("lesson-%02d.json" % lesson_id), lesson)

    dump(DATA / "lessons-index.json", {"version": 2, "lessons": index})
    dump(DATA / "cards.json", {"version": 2, "eras": eras, "cards": cards})
    dump(DATA / "rules.json", {"version": 2, "items": rules})
    dump(DATA / "vocab.json", {"version": 2, "items": vocab})
    dump(DATA / "modules.json", {"version": 2, "modules": modules.get("modules", [])})

    print(
        "\nГотово: %d уроков, %d карт, %d правил, %d слов."
        % (len(index), len(cards), len(rules), len(vocab))
    )


if __name__ == "__main__":
    main()
