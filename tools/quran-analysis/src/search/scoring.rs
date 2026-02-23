use std::collections::HashMap;

use crate::data::quran::QuranText;
use crate::search::index::InvertedIndex;

/// A query term with an associated weight.
#[derive(Debug, Clone)]
pub struct WeightedTerm {
    pub word: String,
    pub weight: f64,
}

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
/// Delegates to `score_search_weighted` with all weights set to 1.0.
pub fn score_search(
    index: &InvertedIndex,
    query_words: &[String],
    quran: &QuranText,
) -> Vec<ScoredDocument> {
    let weighted: Vec<WeightedTerm> = query_words
        .iter()
        .map(|w| WeightedTerm {
            word: w.clone(),
            weight: 1.0,
        })
        .collect();
    score_search_weighted(index, &weighted, quran)
}

/// Score search results using weighted query terms.
///
/// Each term's contribution is multiplied by its weight, allowing
/// expansion terms to contribute less than original query words.
pub fn score_search_weighted(
    index: &InvertedIndex,
    terms: &[WeightedTerm],
    quran: &QuranText,
) -> Vec<ScoredDocument> {
    if terms.is_empty() {
        return Vec::new();
    }

    let total_docs = quran.len() as f64;

    // Accumulate scores per (sura, aya)
    let mut scores: HashMap<(u16, u16), ScoredDocument> = HashMap::new();

    for term in terms {
        let entries = index.lookup(&term.word);
        if entries.is_empty() {
            continue;
        }

        // IDF: log(total_docs / doc_freq)
        let df = index.document_frequency(&term.word) as f64;
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

            // TF component: log-normalized term frequency
            let tf = 1.0 + (doc.freq as f64).ln();

            // Position bonus: words near start get slight boost
            let pos_bonus = 1.0 + (1.0 / entry.word_index as f64) * 0.5;

            // Stop word penalty
            let stop_penalty = if entry.is_stop_word { 0.3 } else { 1.0 };

            doc.score += tf * idf * pos_bonus * stop_penalty * term.weight;

            if !doc.matched_words.contains(&term.word) {
                doc.matched_words.push(term.word.clone());
            }
        }
    }

    // Boost verses that match more unique query terms
    let num_terms = terms.len() as f64;
    for doc in scores.values_mut() {
        let coverage = doc.matched_words.len() as f64 / num_terms;
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
