# Alfanous Core

A Rust port of the [Alfanous](https://github.com/Alfanous-team/alfanous) Quran semantic search engine, built as a standalone CLI tool for the RATQ project.

## Features

- **Full-text search** with SQLite FTS5 for fast, ranked results
- **Arabic normalization** — strips tashkeel, normalizes hamza/taa-marbuta/alef-maksura
- **Prefix expansion** — matches words with common Arabic prefixes (و، ف، ب، ك، ل، ال)
- **Complete Alfanous query language**:
  - `AND` (`+` or `و`): both terms must appear
  - `OR` (`|` or `أو`): either term
  - `NOT` (`-` or `ليس`): exclude term
  - `"phrase"`: exact phrase match
  - `word*`: wildcard/prefix match
  - `سورة:البقرة`: filter by sura name
  - `>>root`: search by Arabic trilateral root (uses Quranic Corpus morphology)
  - `>lemma`: search by lemma family
  - `~word`: synonym expansion (root-based)
  - `#word`: antonym expansion
  - `word^N`: boost weight
  - `%word`: spell-tolerant search
- **Root/lemma search** powered by 1642 roots and 4657 lemmas from the Quranic Arabic Corpus

## Building

Requires Rust 1.85+ (edition 2024):

```bash
cargo build --release
```

## Usage

### Search

```bash
# Simple word search
alfanous-core search -q "الصلاة"

# AND query — verses containing both terms
alfanous-core search -q "الجنة + النار"

# Phrase search
alfanous-core search -q '"بسم الله الرحمن الرحيم"'

# Root search — find all derivations of رحم (mercy)
alfanous-core search -q ">>رحم"

# Filter by sura
alfanous-core search -q "سورة:البقرة" -l 286

# Custom data file
alfanous-core search -q "الحمد" --data path/to/quran-simple-clean.txt
```

### Build persistent database

```bash
alfanous-core build --data data/quran-simple-clean.txt -o data/quran.db
```

## Data format

The Quran text file uses pipe-delimited format: `sura_id|aya_id|text` (one verse per line).

## Testing

```bash
cargo test
```

46 tests covering normalization, query parsing, root lookup, and full search integration.

## Architecture

```
src/
  normalize.rs   — Arabic text normalization pipeline
  parser/        — Recursive-descent query language parser
    lexer.rs     — Tokenizer (Arabic + Latin operators)
    mod.rs       — Parser producing QueryNode AST
  roots.rs       — Buckwalter transliteration + root/lemma lookup
  search.rs      — FTS5 query builder + search executor
  db.rs          — SQLite schema + data loader
  main.rs        — CLI (clap)
data/
  roots.json     — Root → lemma mappings (from Quranic Corpus)
  lemmas.json    — Lemma → root mappings
```

## Credits

- Morphology data from [Quranic Arabic Corpus](http://corpus.quran.com/) v0.4 (Kais Dukes, GPL)
- Quran text from [Tanzil](http://tanzil.info/) (CC BY-ND 3.0)
- Original Alfanous project by [Alfanous Team](https://github.com/Alfanous-team/alfanous)
