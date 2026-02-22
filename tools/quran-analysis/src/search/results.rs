use crate::data::quran::QuranText;
use crate::search::scoring::ScoredDocument;

/// A formatted search result with verse text and highlights.
#[derive(Debug)]
pub struct SearchResult {
    pub sura: u16,
    pub aya: u16,
    pub text: String,
    pub score: f64,
    pub highlights: Vec<String>,
}

/// Format scored documents into search results with verse text.
pub fn format_results(
    scored: &[ScoredDocument],
    quran: &QuranText,
    limit: usize,
) -> Vec<SearchResult> {
    scored
        .iter()
        .take(limit)
        .filter_map(|doc| {
            quran.get(doc.sura, doc.aya).map(|verse| SearchResult {
                sura: doc.sura,
                aya: doc.aya,
                text: verse.text.clone(),
                score: doc.score,
                highlights: doc.matched_words.clone(),
            })
        })
        .collect()
}
