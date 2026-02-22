use std::collections::HashMap;

use crate::data::quran::QuranText;
use crate::search::index::InvertedIndex;

/// A scored search result.
#[derive(Debug, Clone)]
pub struct ScoredDocument {
    pub sura: u16,
    pub aya: u16,
    pub score: f64,
    pub freq: u32,
    pub matched_words: Vec<String>,
}

/// Score search results using TF-IDF-inspired formula.
///
/// For each query word, find matching verses and accumulate scores.
/// Score factors:
/// - Term frequency in verse (how many query words appear)
/// - Inverse document frequency (rare words score higher)
/// - Position bonus (matches near start of verse score slightly higher)
pub fn score_search(
    index: &InvertedIndex,
    query_words: &[String],
    quran: &QuranText,
) -> Vec<ScoredDocument> {
    if query_words.is_empty() {
        return Vec::new();
    }

    let total_docs = quran.len() as f64;

    // Accumulate scores per (sura, aya)
    let mut scores: HashMap<(u16, u16), ScoredDocument> = HashMap::new();

    for word in query_words {
        let entries = index.lookup(word);
        if entries.is_empty() {
            continue;
        }

        // IDF: log(total_docs / doc_freq)
        let df = index.document_frequency(word) as f64;
        let idf = if df > 0.0 {
            (total_docs / df).ln()
        } else {
            0.0
        };

        for entry in entries {
            let key = (entry.sura, entry.aya);
            let doc = scores.entry(key).or_insert_with(|| ScoredDocument {
                sura: entry.sura,
                aya: entry.aya,
                score: 0.0,
                freq: 0,
                matched_words: Vec::new(),
            });

            // TF component: each occurrence counts
            let tf = 1.0;

            // Position bonus: words near start get slight boost
            let pos_bonus = 1.0 + (1.0 / entry.word_index as f64) * 0.5;

            // Stop word penalty
            let stop_penalty = if entry.is_stop_word { 0.3 } else { 1.0 };

            doc.score += tf * idf * pos_bonus * stop_penalty;
            doc.freq += 1;

            if !doc.matched_words.contains(word) {
                doc.matched_words.push(word.clone());
            }
        }
    }

    // Boost verses that match more unique query words
    let num_query_words = query_words.len() as f64;
    for doc in scores.values_mut() {
        let coverage = doc.matched_words.len() as f64 / num_query_words;
        doc.score *= 1.0 + coverage;
    }

    let mut results: Vec<ScoredDocument> = scores.into_values().collect();
    results.sort_by(|a, b| {
        b.score
            .partial_cmp(&a.score)
            .unwrap_or(std::cmp::Ordering::Equal)
    });
    results
}
