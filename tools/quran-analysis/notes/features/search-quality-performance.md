# Search Quality & Performance Enhancements

## Overview
Adding 9 features across search quality and performance for the quran-analysis Rust port.

## Weight Hierarchy
- Original query words: 1.0
- Lemma expansion: 0.8
- Root expansion: 0.7
- Ontology synonyms: 0.5
- Fuzzy matches: 0.4

## Implementation Order
1. Pre-computed document frequency cache
2. Vocabulary accessor on InvertedIndex
3. Weighted query terms + score_search_weighted
4. SearchEngine struct with cached data
5. Ontology-based query expansion
6. Fuzzy matching with edit distance
7. Multi-word proximity scoring
8. Lemma-based expansion
9. Wire full pipeline into SearchEngine + update main.rs

## Key Files
- `src/search/index.rs` — df_cache, vocabulary
- `src/search/scoring.rs` — WeightedTerm, proximity
- `src/search/engine.rs` — NEW: SearchEngine
- `src/search/query.rs` — ontology, fuzzy, lemma expansion
- `src/data/qac.rs` — lemma indexes
- `src/main.rs` — use SearchEngine

## Progress
- [x] Commit 1: df_cache
- [x] Commit 2: vocabulary accessor
- [x] Commit 3: weighted scoring
- [x] Commit 4: SearchEngine struct
- [x] Commit 5: ontology expansion
- [x] Commit 6: fuzzy matching
- [x] Commit 7: proximity scoring
- [x] Commit 8: lemma expansion
- [x] Commit 9: full pipeline + main.rs

## Test Count: 131 (was 100 before)
## All tests passing
