use crate::core::arabic;
use crate::core::similarity::levenshtein_distance;
use crate::data::qac::QacMorphology;
use crate::nlp::stopwords::StopWords;
use crate::nlp::wordnet::WordNet;
use crate::ontology::graph::OntologyGraph;
use crate::search::index::InvertedIndex;
use crate::search::scoring::WeightedTerm;

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
            if !expanded.contains(&form) {
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

/// Expand query words using ontology synonyms and related concepts.
///
/// For each word: find concept by Arabic label/synonym, then add
/// synonyms (weight 0.5) and 1-hop related concept labels (weight 0.5).
/// Original words keep weight 1.0.
pub fn expand_by_ontology(
    words: &[String],
    graph: &OntologyGraph,
) -> Vec<WeightedTerm> {
    let mut terms: Vec<WeightedTerm> = Vec::new();
    let mut seen: Vec<String> = Vec::new();

    for word in words {
        terms.push(WeightedTerm {
            word: word.clone(),
            weight: 1.0,
        });
        seen.push(word.clone());

        let concept = graph.find_by_arabic(word);
        if let Some(c) = concept {
            // Add synonyms at weight 0.5
            for syn in &c.synonyms {
                if !seen.contains(syn) {
                    terms.push(WeightedTerm {
                        word: syn.clone(),
                        weight: 0.5,
                    });
                    seen.push(syn.clone());
                }
            }
            // Also add label_ar if different from the word
            if !c.label_ar.is_empty() && !seen.contains(&c.label_ar) {
                terms.push(WeightedTerm {
                    word: c.label_ar.clone(),
                    weight: 0.5,
                });
                seen.push(c.label_ar.clone());
            }

            // Add 1-hop related concept labels at weight 0.5
            for rel in graph.outgoing_relations(&c.id) {
                if let Some(target) = graph.get_concept(&rel.object) {
                    if !target.label_ar.is_empty()
                        && !seen.contains(&target.label_ar)
                    {
                        terms.push(WeightedTerm {
                            word: target.label_ar.clone(),
                            weight: 0.5,
                        });
                        seen.push(target.label_ar.clone());
                    }
                }
            }
            for rel in graph.incoming_relations(&c.id) {
                if let Some(source) = graph.get_concept(&rel.subject) {
                    if !source.label_ar.is_empty()
                        && !seen.contains(&source.label_ar)
                    {
                        terms.push(WeightedTerm {
                            word: source.label_ar.clone(),
                            weight: 0.5,
                        });
                        seen.push(source.label_ar.clone());
                    }
                }
            }
        }
    }

    terms
}

/// Expand query words with fuzzy matches from the index vocabulary.
///
/// Only expands words that have 0 exact hits in the index. Scans
/// vocabulary for words within edit distance threshold:
/// - Words with 4+ chars: distance <= 2
/// - Shorter words: distance <= 1
/// Fuzzy matches get weight 0.4.
pub fn expand_fuzzy(
    words: &[String],
    index: &InvertedIndex,
) -> Vec<WeightedTerm> {
    let mut terms: Vec<WeightedTerm> = Vec::new();
    let mut seen: Vec<String> = Vec::new();

    for word in words {
        terms.push(WeightedTerm {
            word: word.clone(),
            weight: 1.0,
        });
        seen.push(word.clone());

        // Only expand if word has no exact matches
        if !index.lookup(word).is_empty() {
            continue;
        }

        let word_len = word.chars().count();
        let max_dist = if word_len >= 4 { 2 } else { 1 };

        for vocab_word in index.vocabulary() {
            if seen.contains(&vocab_word.to_string()) {
                continue;
            }
            let dist = levenshtein_distance(word, vocab_word);
            if dist > 0 && dist <= max_dist {
                terms.push(WeightedTerm {
                    word: vocab_word.to_string(),
                    weight: 0.4,
                });
                seen.push(vocab_word.to_string());
            }
        }
    }

    terms
}
