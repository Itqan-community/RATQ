use std::collections::HashSet;
use std::path::Path;

/// A set of stop words for filtering.
#[derive(Debug)]
pub struct StopWords {
    words: HashSet<String>,
}

impl StopWords {
    /// Load stop words from a file (one word per line).
    pub fn from_file(path: &Path) -> Result<Self, String> {
        let content = std::fs::read_to_string(path)
            .map_err(|e| format!("Failed to read {}: {}", path.display(), e))?;
        Ok(Self::from_str(&content))
    }

    /// Parse from string content (one word per line).
    pub fn from_str(content: &str) -> Self {
        let words: HashSet<String> = content
            .lines()
            .map(|line| line.trim().trim_start_matches('\u{FEFF}')) // strip BOM
            .filter(|line| !line.is_empty())
            .map(|line| line.to_string())
            .collect();
        StopWords { words }
    }

    /// Check if a word is a stop word.
    pub fn contains(&self, word: &str) -> bool {
        self.words.contains(word)
    }

    /// Filter stop words from a list of words.
    pub fn filter<'a>(&self, words: &[&'a str]) -> Vec<&'a str> {
        words
            .iter()
            .filter(|w| !self.words.contains(**w))
            .copied()
            .collect()
    }

    /// Number of stop words loaded.
    pub fn len(&self) -> usize {
        self.words.len()
    }

    pub fn is_empty(&self) -> bool {
        self.words.is_empty()
    }
}
