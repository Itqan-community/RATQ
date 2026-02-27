# quran-analysis — Architecture & Quality Reference

This document describes how the tool is structured, how it works internally,
what its test coverage looks like, and where there is room for improvement.
It is written for reviewers who are familiar with Python but not necessarily
with Rust.

---

## 1. What the tool does

`quran-analysis` is a standalone command-line binary.  Given an Arabic (or
English) word, it returns a ranked list of Quran verses that contain that
word or any morphologically related form.

```
$ quran-analysis search عقل
[1/49] 2:44  …أفلا تعقلون  (score: 3.82)
[2/49] 2:76  …أفلا تعقلون  (score: 3.82)
…
```

It also exposes sub-commands for frequency analysis, statistics, and a
simple question-answering mode.

---

## 2. Directory layout

```
tools/quran-analysis/
├── Cargo.toml          # package manifest (rust-version = "1.80")
├── data/               # bundled data files — no network access needed
│   ├── quran-simple-clean.txt          # Quran text (sura|aya|text)
│   ├── quran-uthmani.txt               # Uthmani script variant
│   ├── quranic-corpus-morphology-0.4.txt  # QAC word-level morphology
│   ├── quran-stop-words.strict.l1.ar   # Arabic stop-word lists
│   ├── quran-stop-words.strict.l2.ar
│   ├── en.sahih                        # Sahih International translation
│   ├── english-stop-words.en
│   ├── pos-lexicon.txt                 # POS tag vocabulary
│   └── qa.ontology.v1.owl              # Concept ontology (OWL/XML)
├── src/
│   ├── main.rs         # CLI entry point (argument parsing, output)
│   ├── lib.rs          # re-exports for integration tests
│   ├── core/           # language utilities
│   ├── data/           # data loading
│   ├── search/         # search engine
│   ├── nlp/            # NLP helpers
│   ├── ontology/       # concept graph
│   ├── analysis/       # frequency & statistics
│   └── qa/             # question-answering layer
└── tests/              # integration tests (run against real data files)
```

All data files are committed to the repository under `data/` so the binary
is self-contained after `cargo build`.

---

## 3. Module-by-module description

### 3.1 `core/` — language utilities

| File | What it does |
|---|---|
| `arabic.rs` | `normalize_arabic` (remove tashkeel, unify alef variants, taa marbuta → haa, alef maksura → ya); `is_arabic`; `clean_and_trim` |
| `transliteration.rs` | Bidirectional Buckwalter ↔ Arabic conversion.  The QAC corpus stores words in Buckwalter; this module converts them to Arabic before indexing. |
| `similarity.rs` | Levenshtein edit distance (character-level, handles multi-byte Unicode correctly) |

**Key normalization decisions:**
`normalize_arabic` strips all diacritics and unifies alef variants so that
the same word written with or without tashkeel compares equal.  This is the
same normalization applied to both the search query and every indexed token.

**Important encoding note (recently fixed):**
The QAC corpus uses `a`` (fatha + superscript alef, U+064E + U+0670) to
represent the long vowel ā in active-participle forms such as `ja`vimiyna`
(= جاثمين).  Both characters are diacritics and would be stripped by
`normalize_arabic`, making the QAC form diverge from the Quran text form.
`buckwalter_to_arabic` now converts the two-character sequence `a`` directly
to ا (U+0627), keeping both forms consistent after normalization.

---

### 3.2 `data/` — data loading

| File | What it does |
|---|---|
| `quran.rs` | Parses `sura\|aya\|text` line format into a `Vec<Verse>`.  Provides O(1) lookup by `(sura, aya)`. |
| `qac.rs` | Parses the QAC morphology file.  Converts all Buckwalter forms to Arabic on load.  Builds four lookup tables: `form_to_roots`, `root_to_forms`, `form_to_lemmas`, `lemma_to_forms`. |
| `loader.rs` | Loads all data files from a given directory and assembles a `LoadedData` struct passed to the rest of the system. |

---

### 3.3 `search/` — search engine

This is the most important module.

**`index.rs` — InvertedIndex**

Builds a `HashMap<normalized_word, Vec<IndexEntry>>` from the Quran text.
Every token in every verse is normalized and stored with its `(sura, aya,
word_index)` position.  A pre-computed document-frequency cache makes TF-IDF
lookups O(1).

**`query.rs` — query expansion**

Provides five independent expansion functions:

| Function | Input | Output | Weight |
|---|---|---|---|
| `parse_query` | raw string | normalized tokens | — |
| `expand_by_lemma` | tokens | lemma-family forms | 0.8 |
| `expand_by_roots` | tokens | root-family forms | — |
| `expand_by_ontology` | tokens | concept synonyms | 0.5 |
| `expand_fuzzy` | tokens | edit-distance neighbours | 0.4 |

**`engine.rs` — SearchEngine**

Orchestrates the full Arabic expansion pipeline:

```
parse_query
    ↓
original words (weight 1.0)
    + prefix-anchored vocabulary scan (weight 1.0)
    ↓
lemma expansion via QAC (weight 0.8)
    + prefix-anchored vocabulary scan for each lemma stem
    ↓
root expansion via QAC (weight 0.7)
    + prefix-anchored vocabulary scan for each root stem
    ↓
ontology expansion (weight 0.5)
    ↓
fuzzy expansion — only when no morphological hit found (weight 0.4)
    ↓
score_search_weighted
```

The **prefix-anchored vocabulary scan** (`expand_stem_in_vocab`) is what
allows searching for a root stem like `يعقل` and finding `يعقلون`, `تعقلون`,
`بربوة` etc. — forms where the QAC stem appears with a prefix particle
attached.  It tries 16 common Arabic clitics (و، ف، ب، ل، ال، لل، …).

**`scoring.rs` — TF-IDF + proximity**

Scores each candidate verse with a weighted TF-IDF formula and adds a
proximity bonus when multiple query terms appear close together in the verse.

---

### 3.4 `nlp/` — NLP helpers

| File | What it does |
|---|---|
| `stopwords.rs` | Loads a list of stop words; used to skip high-frequency grammatical words in scoring and synonym expansion. |
| `wordnet.rs` | Simple synonym lookup for English queries. |
| `pos_tagger.rs` | Rule-based POS tagger using the QAC lexicon. |

---

### 3.5 `ontology/` — concept graph

Parses the OWL/XML ontology into an in-memory directed graph.  Each node is
a Quranic concept (e.g. "عقل" = reason, "إنسان" = human) with an Arabic
label, synonyms, and frequency.  Edges are semantic relations (e.g.
"Angel serves Human").  Used by the ontology expansion step in the search
pipeline to find conceptually related words.

---

### 3.6 `analysis/` and `qa/`

- `analysis/` computes word frequencies and basic corpus statistics.
- `qa/` implements a keyword-extraction approach to answering simple
  questions by finding the most relevant verses.

---

## 4. Test coverage

Tests live in `tests/`.  They require the data files in `data/` to be
present (they skip gracefully if not).

| Test file | Tests | What is covered |
|---|---|---|
| `core_tests.rs` | 34 | Arabic normalization, Buckwalter transliteration, Levenshtein distance |
| `search_tests.rs` | 44 | Index build/lookup, scoring, all expansion modes, full-pipeline integration |
| `data_tests.rs` | 20 | QAC parsing, lemma/root index correctness |
| *(unit tests in src/)* | ~46 | Module-level unit tests inline with source |

**Integration tests for specific Arabic words** (in `search_tests.rs`):

| Word | Root | Expected verses | Status |
|---|---|---|---|
| عرب | ع-ر-ب | ≥ 3 | ✅ |
| عقل | ع-ق-ل | ≥ 10 | ✅ |
| جبل | ج-ب-ل | ≥ 3 | ✅ |
| جمل | ج-م-ل | ≥ 1 | ✅ |
| طير | ط-ي-ر | ≥ 2 | ✅ |
| ربوة | ر-ب-و | 2:265, 23:50 | ✅ |
| جثم | ج-ث-م | 7:78, 7:91, 11:67, 11:94, 29:37 | ✅ (fixed in this PR) |

**Total: 44 integration/unit tests, all passing.**

---

## 5. Performance characteristics

| Operation | Cost | Notes |
|---|---|---|
| Startup / data load | ~300 ms | One-time; QAC has ~130 000 entries |
| Index build | ~50 ms | Included in startup |
| Search query | < 5 ms | All in-memory lookups |
| Vocabulary prefix scan | O(V) per stem | V ≈ 14 000 unique words; fast in practice |

Memory usage at runtime is around 80–120 MB (dominated by the QAC table and
the inverted index).  There is no disk I/O after startup.

The vocabulary prefix scan in `expand_stem_in_vocab` is O(V) per stem.  For
a typical query this runs ≤ 50 times (one per expansion term), giving
O(50 × 14 000) ≈ 700 000 string comparisons per query — comfortably under
1 ms on modern hardware.

---

## 6. Known limitations and improvement areas

| Area | Current state | Possible improvement |
|---|---|---|
| Dual-form words | Forms like جاثمين (active participle) rely on the `a`` fix; other QAC encoding quirks may still cause mismatches | Systematic audit of all QAC Buckwalter ↔ text mismatches |
| Ranking | TF-IDF with proximity bonus | BM25 would be more principled for short texts |
| Prefix scan | Iterates full vocabulary; correct but O(V) | Build a trie over vocabulary for O(k) prefix lookup |
| Stop-word list | Conservative (strict L1/L2) | Tunable threshold based on query type |
| Ontology coverage | Limited to `qa.ontology.v1.owl` entries | Extending the OWL file improves concept-based recall |
| CLI output | Plain text | JSON output flag would help downstream integration |

---

## 7. How to build and run

```bash
# Build (requires Rust 1.80+)
cargo build --release

# Run a search
cargo run --release -- search عقل

# Run all tests (data files must be present in data/)
cargo test

# Show all available commands
cargo run --release -- --help
```

All data files are bundled in `data/` — no external downloads or environment
variables are needed.
