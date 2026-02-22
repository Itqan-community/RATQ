use std::collections::HashMap;

use crate::core::arabic;
use crate::data::quran::QuranText;
use crate::nlp::stopwords::StopWords;

/// An entry in the inverted index.
#[derive(Debug, Clone)]
pub struct IndexEntry {
    pub sura: u16,
    pub aya: u16,
    pub word_index: u16,
    pub is_stop_word: bool,
}

/// Inverted index mapping normalized words to their locations.
#[derive(Debug)]
pub struct InvertedIndex {
    index: HashMap<String, Vec<IndexEntry>>,
}

impl InvertedIndex {
    /// Build an inverted index from Arabic Quran text.
    pub fn build(quran: &QuranText, stopwords: &StopWords) -> Self {
        let mut index: HashMap<String, Vec<IndexEntry>> = HashMap::new();

        for verse in &quran.verses {
            let words: Vec<&str> = verse.text.split_whitespace().collect();
            for (i, word) in words.iter().enumerate() {
                let normalized = arabic::normalize_arabic(word);
                if normalized.is_empty() {
                    continue;
                }
                let is_stop = stopwords.contains(&normalized)
                    || stopwords.contains(word);
                let entry = IndexEntry {
                    sura: verse.sura,
                    aya: verse.aya,
                    word_index: (i + 1) as u16,
                    is_stop_word: is_stop,
                };
                index.entry(normalized).or_default().push(entry);
            }
        }

        InvertedIndex { index }
    }

    /// Build an inverted index from English translation text.
    pub fn build_english(quran: &QuranText, stopwords: &StopWords) -> Self {
        let mut index: HashMap<String, Vec<IndexEntry>> = HashMap::new();

        for verse in &quran.verses {
            let words: Vec<&str> = verse.text.split_whitespace().collect();
            for (i, word) in words.iter().enumerate() {
                let clean = word
                    .trim_matches(|c: char| !c.is_alphanumeric())
                    .to_lowercase();
                if clean.is_empty() {
                    continue;
                }
                let is_stop = stopwords.contains(&clean);
                let entry = IndexEntry {
                    sura: verse.sura,
                    aya: verse.aya,
                    word_index: (i + 1) as u16,
                    is_stop_word: is_stop,
                };
                index.entry(clean).or_default().push(entry);
            }
        }

        InvertedIndex { index }
    }

    /// Look up a normalized word in the index.
    pub fn lookup(&self, word: &str) -> &[IndexEntry] {
        self.index.get(word).map(|v| v.as_slice()).unwrap_or(&[])
    }

    /// Check if the index is empty.
    pub fn is_empty(&self) -> bool {
        self.index.is_empty()
    }

    /// Number of unique words in the index.
    pub fn vocabulary_size(&self) -> usize {
        self.index.len()
    }

    /// Total number of verses in the corpus (unique sura:aya pairs).
    pub fn total_documents(&self) -> usize {
        use std::collections::HashSet;
        let mut docs: HashSet<(u16, u16)> = HashSet::new();
        for entries in self.index.values() {
            for e in entries {
                docs.insert((e.sura, e.aya));
            }
        }
        docs.len()
    }

    /// Number of documents containing a given word (document frequency).
    pub fn document_frequency(&self, word: &str) -> usize {
        use std::collections::HashSet;
        match self.index.get(word) {
            Some(entries) => {
                let docs: HashSet<(u16, u16)> =
                    entries.iter().map(|e| (e.sura, e.aya)).collect();
                docs.len()
            }
            None => 0,
        }
    }
}
