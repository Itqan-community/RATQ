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
- [ ] Phase 1: Project setup + Core utilities
- [ ] Phase 2: Data loading
- [ ] Phase 3: Search engine
- [ ] Phase 4: NLP + Query expansion
- [ ] Phase 5: Ontology
- [ ] Phase 6: Question Answering + Analysis
- [ ] Phase 7: CLI + Polish + PR
