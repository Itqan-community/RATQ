#!/usr/bin/env python3
"""Extract root→lemma and lemma→root mappings from Quranic Corpus morphology data.

Reads quranic-corpus-morphology-0.4.txt and outputs two JSON files:
  - data/roots.json:  { root: [lemma1, lemma2, ...] }
  - data/lemmas.json: { lemma: root }

The root keys use Buckwalter transliteration as in the corpus.
"""

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

MORPHOLOGY_FILE = Path(__file__).parent / ".." / "quran-analysis" / "data" / "quranic-corpus-morphology-0.4.txt"
DATA_DIR = Path(__file__).parent / "data"


def extract_field(features: str, field: str) -> str | None:
    """Extract a field value from the FEATURES column."""
    pattern = rf"{field}:([^|]+)"
    m = re.search(pattern, features)
    return m.group(1) if m else None


def main():
    roots: dict[str, set[str]] = defaultdict(set)
    lemmas: dict[str, str] = {}

    with open(MORPHOLOGY_FILE, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or line.startswith("LOCATION"):
                continue

            parts = line.split("\t")
            if len(parts) < 4:
                continue

            features = parts[3]
            root = extract_field(features, "ROOT")
            lemma = extract_field(features, "LEM")

            if root and lemma:
                # Clean lemma (remove special chars like {, }, ~, `, etc.)
                roots[root].add(lemma)
                lemmas[lemma] = root

    # Convert sets to sorted lists for JSON serialization
    roots_json = {k: sorted(v) for k, v in sorted(roots.items())}

    DATA_DIR.mkdir(exist_ok=True)

    with open(DATA_DIR / "roots.json", "w", encoding="utf-8") as f:
        json.dump(roots_json, f, ensure_ascii=False, indent=2)

    with open(DATA_DIR / "lemmas.json", "w", encoding="utf-8") as f:
        json.dump(dict(sorted(lemmas.items())), f, ensure_ascii=False, indent=2)

    print(f"Extracted {len(roots_json)} roots and {len(lemmas)} lemmas")
    print(f"Written to {DATA_DIR / 'roots.json'} and {DATA_DIR / 'lemmas.json'}")


if __name__ == "__main__":
    main()
