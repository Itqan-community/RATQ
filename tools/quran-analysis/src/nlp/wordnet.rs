use std::collections::HashMap;
use std::path::Path;

/// A WordNet entry with synonyms.
#[derive(Debug, Clone)]
pub struct WordEntry {
    pub word: String,
    pub pos: String,
    pub synset_offsets: Vec<u64>,
}

/// A synset (synonym set) with gloss and words.
#[derive(Debug, Clone)]
pub struct SynSet {
    pub offset: u64,
    pub pos: String,
    pub words: Vec<String>,
    pub gloss: String,
}

/// WordNet dictionary for synonym lookup.
pub struct WordNet {
    index: HashMap<String, Vec<WordEntry>>,
    data: HashMap<(u64, String), SynSet>,
}

impl WordNet {
    /// Load WordNet from a directory containing index.* and data.* files.
    pub fn from_dir(dir: &Path) -> Result<Self, String> {
        let mut index = HashMap::new();
        let mut data = HashMap::new();

        for pos in &["noun", "verb", "adj", "adv"] {
            let idx_path = dir.join(format!("index.{}", pos));
            if idx_path.exists() {
                let content = std::fs::read_to_string(&idx_path)
                    .map_err(|e| format!("Failed to read {:?}: {}", idx_path, e))?;
                parse_index(&content, pos, &mut index);
            }

            let data_path = dir.join(format!("data.{}", pos));
            if data_path.exists() {
                let content = std::fs::read_to_string(&data_path)
                    .map_err(|e| format!("Failed to read {:?}: {}", data_path, e))?;
                parse_data(&content, pos, &mut data);
            }
        }

        Ok(WordNet { index, data })
    }

    /// Get synonyms of a word.
    pub fn get_synonyms(&self, word: &str) -> Vec<String> {
        let word_lower = word.to_lowercase();
        let mut synonyms = Vec::new();

        if let Some(entries) = self.index.get(&word_lower) {
            for entry in entries {
                for offset in &entry.synset_offsets {
                    let key = (*offset, entry.pos.clone());
                    if let Some(synset) = self.data.get(&key) {
                        for syn_word in &synset.words {
                            let clean = syn_word.replace('_', " ").to_lowercase();
                            if clean != word_lower && !synonyms.contains(&clean) {
                                synonyms.push(clean);
                            }
                        }
                    }
                }
            }
        }

        synonyms
    }

    /// Check if a word exists in the dictionary.
    pub fn contains(&self, word: &str) -> bool {
        self.index.contains_key(&word.to_lowercase())
    }

    /// Number of words indexed.
    pub fn len(&self) -> usize {
        self.index.len()
    }

    pub fn is_empty(&self) -> bool {
        self.index.is_empty()
    }
}

/// Create an empty WordNet (when no dictionary is available).
impl Default for WordNet {
    fn default() -> Self {
        WordNet {
            index: HashMap::new(),
            data: HashMap::new(),
        }
    }
}

/// Parse a WordNet index file.
fn parse_index(content: &str, pos: &str, index: &mut HashMap<String, Vec<WordEntry>>) {
    let pos_char = match pos {
        "noun" => "n",
        "verb" => "v",
        "adj" => "a",
        "adv" => "r",
        _ => pos,
    };

    for line in content.lines() {
        if line.starts_with(' ') || line.starts_with('#') {
            continue;
        }
        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.len() < 6 {
            continue;
        }

        let word = parts[0].to_lowercase();
        // Format: word pos synset_cnt p_cnt [ptr_symbol...] sense_cnt tagsense_cnt synset_offset...
        let synset_cnt: usize = parts[2].parse().unwrap_or(0);
        let p_cnt: usize = parts[3].parse().unwrap_or(0);
        // synset offsets start after: word pos synset_cnt p_cnt [p_cnt pointers] sense_cnt tagsense_cnt
        let offset_start = 4 + p_cnt + 2;
        let mut offsets = Vec::new();
        for i in 0..synset_cnt {
            if offset_start + i < parts.len() {
                if let Ok(off) = parts[offset_start + i].parse::<u64>() {
                    offsets.push(off);
                }
            }
        }

        let entry = WordEntry {
            word: word.clone(),
            pos: pos_char.to_string(),
            synset_offsets: offsets,
        };
        index.entry(word).or_default().push(entry);
    }
}

/// Parse a WordNet data file.
fn parse_data(content: &str, pos: &str, data: &mut HashMap<(u64, String), SynSet>) {
    let pos_char = match pos {
        "noun" => "n",
        "verb" => "v",
        "adj" => "a",
        "adv" => "r",
        _ => pos,
    };

    for line in content.lines() {
        if line.starts_with(' ') || line.starts_with('#') {
            continue;
        }
        let parts: Vec<&str> = line.splitn(2, '|').collect();
        let gloss = if parts.len() > 1 {
            parts[1].trim().to_string()
        } else {
            String::new()
        };

        let header: Vec<&str> = parts[0].split_whitespace().collect();
        if header.len() < 6 {
            continue;
        }

        let offset: u64 = match header[0].parse() {
            Ok(v) => v,
            Err(_) => continue,
        };

        let w_cnt = match u32::from_str_radix(header[3], 16) {
            Ok(v) => v as usize,
            Err(_) => continue,
        };

        let mut words = Vec::new();
        for i in 0..w_cnt {
            let word_idx = 4 + i * 2;
            if word_idx < header.len() {
                words.push(header[word_idx].to_string());
            }
        }

        let synset = SynSet {
            offset,
            pos: pos_char.to_string(),
            words,
            gloss,
        };
        data.insert((offset, pos_char.to_string()), synset);
    }
}
