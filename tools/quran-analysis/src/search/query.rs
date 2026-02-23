use std::collections::HashSet;

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
/// and add other surface forms sharing the same root.
///
/// The function first tries each word as a root directly to find
/// surface forms. If no forms are found, it looks up the root of
/// the word form and then retrieves all surface forms for that root.
pub fn expand_by_roots(words: &[String], qac: &QacMorphology) -> Vec<String> {
    let mut seen: HashSet<String> = words.iter().cloned().collect();
    let mut expanded: Vec<String> = words.to_vec();

    for word in words {
        // Try the word directly as a root first
        let mut root_forms = qac.get_surface_forms_for_root(word);

        // If no forms found, look up the root of this word form
        if root_forms.is_empty() {
            if let Some(root) = qac.find_root_by_form(word) {
                root_forms = qac.get_surface_forms_for_root(&root);
            }
        }

        for form in root_forms {
            if seen.insert(form.clone()) {
                expanded.push(form);
            }
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
    let mut seen: HashSet<String> = words.iter().cloned().collect();
    let mut expanded: Vec<String> = words.to_vec();

    for word in words {
        if stopwords.contains(word) {
            continue;
        }
        let synonyms = wordnet.get_synonyms(word);
        for syn in synonyms.iter().take(3) {
            if !stopwords.contains(syn) && seen.insert(syn.clone()) {
                expanded.push(syn.clone());
            }
        }
    }

    expanded
}
