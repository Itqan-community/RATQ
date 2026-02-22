use std::collections::HashMap;
use std::path::Path;

/// A single Quran verse.
#[derive(Debug, Clone)]
pub struct Verse {
    pub sura: u16,
    pub aya: u16,
    pub text: String,
}

/// Parsed Quran text, indexed by (sura, aya).
#[derive(Debug)]
pub struct QuranText {
    pub verses: Vec<Verse>,
    index: HashMap<(u16, u16), usize>,
}

impl QuranText {
    /// Parse a pipe-delimited Quran text file (sura|aya|text).
    pub fn from_file(path: &Path) -> Result<Self, String> {
        let content = std::fs::read_to_string(path)
            .map_err(|e| format!("Failed to read {}: {}", path.display(), e))?;
        Self::from_str(&content)
    }

    /// Parse from string content (sura|aya|text per line).
    pub fn from_str(content: &str) -> Result<Self, String> {
        let mut verses = Vec::new();
        let mut index = HashMap::new();

        for (line_num, line) in content.lines().enumerate() {
            let line = line.trim();
            if line.is_empty() || line.starts_with('#') {
                continue;
            }
            let parts: Vec<&str> = line.splitn(3, '|').collect();
            if parts.len() < 3 {
                return Err(format!("Invalid format at line {}: {}", line_num + 1, line));
            }
            let sura: u16 = parts[0]
                .parse()
                .map_err(|_| format!("Invalid sura number at line {}", line_num + 1))?;
            let aya: u16 = parts[1]
                .parse()
                .map_err(|_| format!("Invalid aya number at line {}", line_num + 1))?;
            let text = parts[2].to_string();

            let idx = verses.len();
            verses.push(Verse { sura, aya, text });
            index.insert((sura, aya), idx);
        }

        Ok(QuranText { verses, index })
    }

    /// Get a verse by sura and aya number.
    pub fn get(&self, sura: u16, aya: u16) -> Option<&Verse> {
        self.index.get(&(sura, aya)).map(|&i| &self.verses[i])
    }

    /// Total number of verses.
    pub fn len(&self) -> usize {
        self.verses.len()
    }

    /// Check if empty.
    pub fn is_empty(&self) -> bool {
        self.verses.is_empty()
    }
}
