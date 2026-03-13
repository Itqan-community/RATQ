use std::collections::HashMap;
use std::path::Path;

/// A POS-tagged word.
#[derive(Debug, Clone)]
pub struct TaggedWord {
    pub word: String,
    pub tag: String,
}

/// English POS tagger based on Brown Corpus lexicon with suffix heuristics.
pub struct PosTagger {
    lexicon: HashMap<String, Vec<String>>,
}

impl PosTagger {
    /// Load lexicon from file (space-delimited: word TAG1 TAG2 ...).
    pub fn from_file(path: &Path) -> Result<Self, String> {
        let content = std::fs::read_to_string(path)
            .map_err(|e| format!("Failed to read {}: {}", path.display(), e))?;
        Ok(Self::from_str(&content))
    }

    /// Parse lexicon from string content.
    pub fn from_str(content: &str) -> Self {
        let mut lexicon = HashMap::new();
        for line in content.lines() {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() >= 2 {
                let word = parts[0].to_lowercase();
                let tags: Vec<String> =
                    parts[1..].iter().map(|s| s.to_string()).collect();
                lexicon.insert(word, tags);
            }
        }
        PosTagger { lexicon }
    }

    /// Tag a sequence of words.
    pub fn tag(&self, text: &str) -> Vec<TaggedWord> {
        text.split_whitespace()
            .map(|word| {
                let clean = word
                    .trim_matches(|c: char| !c.is_alphanumeric())
                    .to_lowercase();
                let tag = self.tag_word(&clean);
                TaggedWord {
                    word: clean,
                    tag,
                }
            })
            .filter(|tw| !tw.word.is_empty())
            .collect()
    }

    /// Tag a single word using lexicon lookup + suffix heuristics.
    fn tag_word(&self, word: &str) -> String {
        // Lexicon lookup
        if let Some(tags) = self.lexicon.get(word) {
            if let Some(first) = tags.first() {
                return first.clone();
            }
        }

        // Suffix-based heuristics (Brown corpus tagset)
        if word.ends_with("ly") {
            return "RB".to_string(); // adverb
        }
        if word.ends_with("ing") {
            return "VBG".to_string(); // gerund
        }
        if word.ends_with("ed") {
            return "VBN".to_string(); // past participle
        }
        if word.ends_with("tion") || word.ends_with("sion") || word.ends_with("ness") {
            return "NN".to_string(); // noun
        }
        if word.ends_with("al") || word.ends_with("ous") || word.ends_with("ive") {
            return "JJ".to_string(); // adjective
        }
        if word.ends_with("es") || word.ends_with("s") {
            return "NNS".to_string(); // plural noun
        }

        "NN".to_string() // default: noun
    }

    /// Number of words in the lexicon.
    pub fn lexicon_size(&self) -> usize {
        self.lexicon.len()
    }
}
