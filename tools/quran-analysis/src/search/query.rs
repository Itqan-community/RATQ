use crate::core::arabic;
use crate::data::qac::QacMorphology;
use crate::nlp::stopwords::StopWords;
use crate::nlp::wordnet::WordNet;

/// Parse and normalize a search query into individual words.
pub fn parse_query(query: &str, lang: &str) -> Vec<String> {
    query
        .split_whitespace()
        .map(|w| {
            if lang == "ar" || arabic::is_arabic(w) {
                arabic::normalize_arabic(w)
            } else {
                w.trim_matches(|c: char| !c.is_alphanumeric())
                    .to_lowercase()
            }
        })
        .filter(|w| !w.is_empty())
        .collect()
}

/// Expand query words with QAC root derivations.
///
/// For Arabic queries, find the root of each word using QAC morphology
/// and add other words sharing the same root.
pub fn expand_by_roots(
    words: &[String],
    qac: &QacMorphology,
    quran_words: &std::collections::HashMap<String, Vec<String>>,
) -> Vec<String> {
    let mut expanded: Vec<String> = words.to_vec();

    for word in words {
        // Look up root in QAC via the word-to-root map
        if let Some(root_words) = quran_words.get(word) {
            for rw in root_words {
                if !expanded.contains(rw) {
                    expanded.push(rw.clone());
                }
            }
        }
    }

    // Also check QAC roots directly (Buckwalter encoded)
    let bw_word = crate::core::transliteration::arabic_to_buckwalter(
        &words.join(" "),
    );
    for bw_part in bw_word.split_whitespace() {
        if let Some(locs) = qac.find_by_root(bw_part) {
            // Found a root match — already handled via word map
            let _ = locs;
        }
    }

    expanded
}

/// Expand English query words with WordNet synonyms.
pub fn expand_by_synonyms(
    words: &[String],
    wordnet: &WordNet,
    stopwords: &StopWords,
) -> Vec<String> {
    let mut expanded: Vec<String> = words.to_vec();

    for word in words {
        if stopwords.contains(word) {
            continue;
        }
        let synonyms = wordnet.get_synonyms(word);
        for syn in synonyms.iter().take(3) {
            if !expanded.contains(syn) && !stopwords.contains(syn) {
                expanded.push(syn.clone());
            }
        }
    }

    expanded
}
