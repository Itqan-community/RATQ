use crate::data::qac::QacMorphology;
use crate::data::quran::QuranText;
use crate::nlp::stopwords::StopWords;
use crate::ontology::graph::OntologyGraph;
use crate::search::index::InvertedIndex;
use crate::search::query;
use crate::search::scoring::{self, ScoredDocument};

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

    /// Run a search query and return scored documents.
    pub fn search(&self, query_str: &str, limit: usize) -> Vec<ScoredDocument> {
        let words = query::parse_query(query_str, &self.lang);
        if words.is_empty() {
            return Vec::new();
        }

        let expanded = if self.lang == "ar" {
            if let Some(ref qac) = self.qac {
                query::expand_by_roots(&words, qac)
            } else {
                words.clone()
            }
        } else {
            words.clone()
        };

        let scored = scoring::score_search(&self.index, &expanded, &self.quran);
        scored.into_iter().take(limit).collect()
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
