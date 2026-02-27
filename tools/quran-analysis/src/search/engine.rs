use crate::data::qac::QacMorphology;
use crate::data::quran::QuranText;
use crate::nlp::stopwords::StopWords;
use crate::ontology::graph::OntologyGraph;
use crate::search::index::InvertedIndex;
use crate::search::query;
use crate::search::scoring::{self, ScoredDocument, WeightedTerm};

/// Pre-loaded search engine that caches data and indexes.
pub struct SearchEngine {
    quran: QuranText,
    index: InvertedIndex,
    qac: Option<QacMorphology>,
    ontology: Option<OntologyGraph>,
    lang: String,
}

impl SearchEngine {
    /// Build a SearchEngine from pre-loaded data.
    pub fn from_data(
        quran: QuranText,
        stopwords: StopWords,
        qac: Option<QacMorphology>,
        ontology: Option<OntologyGraph>,
        lang: &str,
    ) -> Self {
        let index = if lang == "ar" {
            InvertedIndex::build(&quran, &stopwords)
        } else {
            InvertedIndex::build_english(&quran, &stopwords)
        };

        SearchEngine {
            quran,
            index,
            qac,
            ontology,
            lang: lang.to_string(),
        }
    }

    /// Run a search query through the full expansion pipeline.
    ///
    /// Pipeline (Arabic):
    ///   parse → lemma(0.8) → root(0.7) → ontology(0.5) → fuzzy(0.4) → score
    /// Pipeline (English): parse → score (with weight 1.0)
    pub fn search(&self, query_str: &str, limit: usize) -> Vec<ScoredDocument> {
        let words = query::parse_query(query_str, &self.lang);
        if words.is_empty() {
            return Vec::new();
        }

        let terms = if self.lang == "ar" {
            self.expand_arabic(&words)
        } else {
            words
                .iter()
                .map(|w| WeightedTerm {
                    word: w.clone(),
                    weight: 1.0,
                })
                .collect()
        };

        let scored = scoring::score_search_weighted(
            &self.index, &terms, &self.quran,
        );
        scored.into_iter().take(limit).collect()
    }

    /// Full Arabic expansion pipeline.
    ///
    /// Priority order:
    /// 1. Exact normalized word (weight 1.0) — always added
    /// 2. Lemma-family forms from QAC (weight 0.8)
    /// 3. Root-family forms from QAC, with vocabulary prefix/suffix matching (weight 0.7)
    /// 4. Ontology synonyms/related concepts (weight 0.5)
    /// 5. Fuzzy neighbours — only when no morphological expansion hit the index (weight 0.4)
    fn expand_arabic(&self, words: &[String]) -> Vec<WeightedTerm> {
        use std::collections::HashSet;

        let mut terms: Vec<WeightedTerm> = Vec::new();
        let mut seen: HashSet<String> = HashSet::new();

        // Original words at weight 1.0
        for word in words {
            terms.push(WeightedTerm {
                word: word.clone(),
                weight: 1.0,
            });
            seen.insert(word.clone());
        }

        // Track whether any expansion term actually appears in the index so we
        // can decide whether fuzzy expansion is needed.
        let mut morphological_hits = false;

        // Check whether the original query words themselves hit the index.
        // Also apply prefix expansion for original words so that, e.g.,
        // searching for ربوة (normalized: ربوه) finds بربوة (2:265) in
        // addition to the bare ربوة (23:50).
        for word in words {
            if !self.index.lookup(word).is_empty() {
                morphological_hits = true;
            }
            self.expand_stem_in_vocab(word, &mut seen, &mut terms, 1.0, &mut morphological_hits);
        }

        if let Some(ref qac) = self.qac {
            // Collect all stem forms from lemma and root expansion first,
            // then resolve them against the index in a single pass.
            //
            // We gather (stem, weight) pairs where:
            //   weight 0.8 = lemma expansion
            //   weight 0.7 = root expansion
            //
            // For each stem:
            //   - If it hits the index exactly, add it with its weight.
            //   - If not, scan the vocabulary for words that contain this
            //     stem as a substring, which recovers prefixed/suffixed
            //     inflections that the QAC segment form omits (e.g. يعقلون
            //     for stem يعقل, or بربوة for stem ربوة).
            //
            // We keep a separate set (stem_seen) of stems we have already
            // processed via substring matching so we do not do it twice if
            // the same stem surfaces from both lemma and root expansion.
            let mut stem_seen: HashSet<String> = HashSet::new();

            // Collect lemma stems
            let lemma_terms = query::expand_by_lemma(words, qac);
            let lemma_stems: Vec<String> = lemma_terms
                .iter()
                .filter(|t| (t.weight - 1.0).abs() > f64::EPSILON)
                .map(|t| t.word.clone())
                .collect();

            // Collect root stems (expand_by_roots returns original words too,
            // so we skip any that are already in seen as original words)
            let root_forms = query::expand_by_roots(words, qac);
            let root_stems: Vec<String> = root_forms
                .into_iter()
                .filter(|f| !words.contains(f))
                .collect();

            // Process lemma stems (weight 0.8), then root stems (weight 0.7).
            // Using a chain lets us process both groups in one loop.
            let all_stems: Vec<(String, f64)> = lemma_stems
                .into_iter()
                .map(|s| (s, 0.8_f64))
                .chain(root_stems.into_iter().map(|s| (s, 0.7_f64)))
                .collect();

            for (stem, weight) in all_stems {
                // Skip stems we have already processed via prefix expansion.
                // (A stem may appear in both lemma and root expansion; we only
                // need to process it once.)
                if stem_seen.contains(&stem) {
                    continue;
                }
                stem_seen.insert(stem.clone());

                if !seen.contains(&stem) {
                    seen.insert(stem.clone());
                    if !self.index.lookup(&stem).is_empty() {
                        // Stem found directly in the index.
                        morphological_hits = true;
                        terms.push(WeightedTerm { word: stem.clone(), weight });
                    }
                }

                // Always try prefix-anchored expansion so that forms like
                // بربوة (prefix ب + stem ربوة) are included even when the
                // bare stem already hit the index (which only found 23:50
                // for ربوة but not 2:265 which has بربوة).
                self.expand_stem_in_vocab(&stem, &mut seen, &mut terms, weight, &mut morphological_hits);
            }
        }

        // Ontology expansion (weight 0.5)
        if let Some(ref graph) = self.ontology {
            let onto_terms = query::expand_by_ontology(words, graph);
            for t in onto_terms {
                if seen.insert(t.word.clone()) {
                    if !self.index.lookup(&t.word).is_empty() {
                        morphological_hits = true;
                    }
                    terms.push(WeightedTerm {
                        word: t.word,
                        weight: 0.5,
                    });
                }
            }
        }

        // Fuzzy matching (weight 0.4) — skipped when morphological expansion
        // already found index hits, to prevent short-word noise (e.g. عقل
        // at 3 chars would otherwise fuzzy-match قل which appears in 270+
        // verses and would dominate the results).
        if !morphological_hits {
            let fuzzy_terms = query::expand_fuzzy(words, &self.index);
            for t in fuzzy_terms {
                if seen.insert(t.word.clone()) {
                    terms.push(WeightedTerm {
                        word: t.word,
                        weight: 0.4,
                    });
                }
            }
        }

        terms
    }

    /// For a stem that is absent from the index, scan the vocabulary for
    /// words that begin with this stem (optionally preceded by a short Arabic
    /// prefix particle).  This recovers full inflected forms that have
    /// prefix/suffix particles attached to the QAC segment stem.
    ///
    /// Examples of recoverable forms:
    ///   stem يعقل  →  يعقلون, يعقلها
    ///   stem تعقل  →  تعقلون
    ///   stem ربوه  →  بربوه  (prefix ب)
    ///   stem ربا   →  الربا  (prefix ال)
    ///
    /// Pure substring matching would also match `ضربت` for stem `ربت`
    /// because `ضرب` (to strike) contains the letters `ربت` — but the two
    /// words have unrelated roots.  Restricting to prefix-anchored matches
    /// prevents such false positives while still covering all real Arabic
    /// clitics.
    ///
    /// Only stems with at least 3 characters are expanded this way to avoid
    /// over-broad matches.
    fn expand_stem_in_vocab(
        &self,
        stem: &str,
        seen: &mut std::collections::HashSet<String>,
        terms: &mut Vec<WeightedTerm>,
        weight: f64,
        morphological_hits: &mut bool,
    ) {
        let stem_len = stem.chars().count();
        if stem_len < 3 {
            return;
        }

        // Short Arabic prefix particles that may be prepended to a stem
        // in the Quran text.  We check that vocab_word starts with
        // (prefix + stem) so that only genuinely prefixed forms match.
        const PREFIXES: &[&str] = &[
            "",   // direct match (no prefix)
            "و",  // waw (and/so)
            "ف",  // fa (then/so)
            "ب",  // bi (with/in)
            "ل",  // li (for/to)
            "ك",  // ka (like/as)
            "ال", // definite article
            "لل", // li+al
            "وال", "فال", "بال", "كال",
            "ولل", "فلل",
            "وبال", "فبال",
        ];

        for vocab_word in self.index.vocabulary() {
            if seen.contains(vocab_word) {
                continue;
            }
            // Check whether vocab_word starts with (prefix + stem)
            // for any of the known prefix particles.
            let is_match = PREFIXES.iter().any(|p| {
                let candidate = format!("{}{}", p, stem);
                vocab_word.starts_with(candidate.as_str())
            });
            if is_match {
                let owned = vocab_word.to_string();
                if seen.insert(owned.clone()) {
                    *morphological_hits = true;
                    terms.push(WeightedTerm {
                        word: owned,
                        weight,
                    });
                }
            }
        }
    }

    /// Access the underlying QuranText.
    pub fn quran(&self) -> &QuranText {
        &self.quran
    }

    /// Access the underlying InvertedIndex.
    pub fn index(&self) -> &InvertedIndex {
        &self.index
    }
}
