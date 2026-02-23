use std::collections::{HashMap, HashSet};

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

    // Pre-compute query term set for O(1) membership checks
    let query_set: HashSet<&str> = query_words.iter().map(|w| w.as_str()).collect();

    // Accumulate scores per (sura, aya); track matched words in a HashSet
    let mut scores: HashMap<(u16, u16), ScoredDocument> = HashMap::new();
    let mut matched_sets: HashMap<(u16, u16), HashSet<String>> = HashMap::new();

    for word in &query_set {
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

            doc.freq += 1;

            // Position bonus: words near start get slight boost
            let pos_bonus = 1.0 + (1.0 / entry.word_index as f64) * 0.5;

            // Stop word penalty
            let stop_penalty = if entry.is_stop_word { 0.3 } else { 1.0 };

            // Accumulate IDF * position * penalty per posting;
            // TF is applied once in the post-processing pass.
            doc.score += idf * pos_bonus * stop_penalty;

            matched_sets
                .entry(key)
                .or_default()
                .insert((*word).to_string());
        }
    }

    // Post-processing: apply log-normalized TF and coverage boost
    let num_query_words = query_set.len() as f64;
    for (key, doc) in scores.iter_mut() {
        // TF component: log-normalized term frequency applied once
        let tf = 1.0 + (doc.freq as f64).ln();
        doc.score *= tf;

        if let Some(matched) = matched_sets.remove(key) {
            let coverage = matched.len() as f64 / num_query_words;
            doc.score *= 1.0 + coverage;
            doc.matched_words = matched.into_iter().collect();
        }
    }

    let mut results: Vec<ScoredDocument> = scores.into_values().collect();
    results.sort_by(|a, b| {
        b.score
            .partial_cmp(&a.score)
            .unwrap_or(std::cmp::Ordering::Equal)
    });
    results
}
