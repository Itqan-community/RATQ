# quran-analysis

A standalone Quran semantic search and analysis tool written in Rust. Ported from the original [QuranAnalysis](https://github.com/karimouda/qurananalysis) PHP project.

## Features

- **Semantic search** across Arabic and English Quran text with TF-IDF scoring
- **Question answering** — detects question type (who/what/when/how many) and returns relevant verses
- **Word analysis** — frequency counts, morphological roots via QAC corpus
- **Ontology exploration** — navigate the Quranic concept graph (OWL-based)
- **Corpus statistics** — sura/verse/word counts, top frequent words
- **Fully offline** — no network calls, all data bundled locally

## Building

```bash
cargo build --release
```

## Usage

```bash
# Arabic search
cargo run -- search "الله"

# English search
cargo run -- search "mercy" --lang en

# JSON output
cargo run -- search "محمد" --format json --limit 5

# Question answering
cargo run -- answer "من خلق السماوات"
cargo run -- answer "who created man?" --lang en

# Word analysis
cargo run -- analyze "كتاب"

# Ontology concept lookup
cargo run -- ontology "الله" --relations

# Corpus statistics
cargo run -- stats
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `--data-dir <path>` | Path to the data directory | `data` |
| `--lang <ar\|en>` | Language (search/answer) | auto-detect |
| `--limit <n>` | Maximum results | 10 (search), 3 (answer) |
| `--format <text\|json>` | Output format (search only) | text |
| `--relations` | Show relations (ontology only) | false |

## Data Files

Place these in the `data/` directory:

| File | Description |
|------|-------------|
| `quran-simple-clean.txt` | Simple Arabic text (pipe-delimited) |
| `en.sahih` | Sahih International English translation |
| `quranic-corpus-morphology-0.4.txt` | QAC morphology table |
| `qa.ontology.v1.owl` | Quranic concept ontology (OWL/RDF) |
| `quran-stop-words.strict.l1.ar` | Arabic stop words (level 1) |
| `english-stop-words.en` | English stop words |

## Architecture

```text
src/
├── main.rs              # CLI entry point (clap)
├── lib.rs               # Public API
├── core/                # Arabic normalization, similarity, transliteration
├── data/                # Quran text, QAC morphology, data loader
├── search/              # Inverted index, TF-IDF scoring, query parsing
├── ontology/            # OWL parser, concept graph
├── qa/                  # Question type detection, answer scoring
├── nlp/                 # POS tagger, stopwords, WordNet
└── analysis/            # Word frequency, corpus statistics
```

## Testing

```bash
cargo test
```

98 tests covering core utilities, data parsing, search, NLP, ontology, and QA.

## License

MIT
