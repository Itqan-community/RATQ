# QuranAnalysis Rust Port

## Issue
RATQ #15 — Encapsulate QuranAnalysis into standalone app (150 pts)
Assigned to Tamoura by @hassaanalansary

## Approach
Port karimouda/qurananalysis (PHP) to Rust as a standalone CLI + library.
Lives in `tools/quran-analysis/` within the RATQ repo.

## Data Files Needed (from karimouda/qurananalysis)
- `data/quran-simple-clean.txt` — pipe-delimited `sura|aya|text`
- `data/quran-uthmani.txt` — pipe-delimited `sura|aya|text`
- `data/translations/en.sahih` — pipe-delimited `sura|aya|english`
- `data/quranic-corpus-morphology-0.4.txt` — tab-delimited QAC
- `data/ontology/qa.ontology.v1.owl` — RDF/XML OWL
- `data/quran-stop-words.strict.l1.ar` — one word per line
- `data/quran-stop-words.strict.l2.ar` — one word per line
- `data/english-stop-words.en` — one word per line
- `data/postagging-corpus/lexicon.txt` — space-delimited POS lexicon

## Key Decisions
- PR targets `main` (RATQ uses main, not develop)
- All data bundled in `data/` directory, loaded at runtime
- No network calls — fully offline
- Scoring formula mirrors PHP: TF-IDF + edit distance + common chars + position bonuses

## Progress
- [x] Phase 1: Project setup + Core utilities (32 tests)
- [x] Phase 2: Data loading (18 tests, 50 total)
- [x] Phase 3: Search engine (12 tests, 62 total)
- [x] Phase 4: NLP + Query expansion (13 tests, 75 total)
- [x] Phase 5: Ontology (5 tests, 80 total)
- [x] Phase 6: Question Answering + Analysis (18 tests, 98 total)
- [x] Phase 7: CLI + Polish + PR
- [x] Phase 8: CodeRabbit review feedback (all rounds)

## PR
https://github.com/Itqan-community/RATQ/pull/24

## CodeRabbit Review Fixes (PR #24)
- Cargo.toml: enabled LTO for release builds
- QAC parser: log skipped entries, avoid redundant root clones
- InvertedIndex: normalize text in lookup method
- Scoring: pre-compute term sets with HashSet for O(1) dedup
- Ontology parser: handle XML unescape errors gracefully
- QuranText::get: log warning when verse not found
- Query expansion: use HashSet for dedup in root/synonym expansion
- main.rs: use &Path instead of &PathBuf, eprintln for errors
