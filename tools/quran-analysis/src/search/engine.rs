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
    /// Pipeline (Arabic): parse → lemma(0.8) → root(0.7) → ontology(0.5) → fuzzy(0.4) → weighted score
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

        if let Some(ref qac) = self.qac {
            // Lemma expansion (weight 0.8)
            let lemma_terms = query::expand_by_lemma(words, qac);
            for t in lemma_terms {
                if seen.insert(t.word.clone()) {
                    terms.push(WeightedTerm {
                        word: t.word,
                        weight: 0.8,
                    });
                }
            }

            // Root expansion (weight 0.7)
            let root_forms = query::expand_by_roots(words, qac);
            for form in root_forms {
                if seen.insert(form.clone()) {
                    terms.push(WeightedTerm {
                        word: form,
                        weight: 0.7,
                    });
                }
            }
        }

        // Ontology expansion (weight 0.5)
        if let Some(ref graph) = self.ontology {
            let onto_terms = query::expand_by_ontology(words, graph);
            for t in onto_terms {
                if seen.insert(t.word.clone()) {
                    terms.push(WeightedTerm {
                        word: t.word,
                        weight: 0.5,
                    });
                }
            }
        }

        // Fuzzy matching (weight 0.4)
        let fuzzy_terms = query::expand_fuzzy(words, &self.index);
        for t in fuzzy_terms {
            if seen.insert(t.word.clone()) {
                terms.push(WeightedTerm {
                    word: t.word,
                    weight: 0.4,
                });
            }
        }

        terms
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
