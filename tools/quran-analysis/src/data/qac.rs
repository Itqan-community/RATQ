use std::collections::HashMap;
use std::path::Path;

use crate::core::transliteration;

/// A single morphology entry from the QAC corpus.
#[derive(Debug, Clone)]
pub struct MorphEntry {
    pub sura: u16,
    pub aya: u16,
    pub word: u16,
    pub segment: u16,
    pub form_bw: String,
    pub form_ar: String,
    pub tag: String,
    pub features: String,
    pub root: String,
    pub lemma: String,
}

/// The full QAC morphology table, keyed by "sura:aya:word".
#[derive(Debug)]
pub struct QacMorphology {
    /// All entries indexed by "sura:aya:word" key.
    pub entries: HashMap<String, Vec<MorphEntry>>,
    /// Root lookup: root → list of (sura, aya, word) locations.
    pub roots: HashMap<String, Vec<(u16, u16, u16)>>,
}

impl QacMorphology {
    /// Parse a QAC morphology file.
    pub fn from_file(path: &Path) -> Result<Self, String> {
        let content = std::fs::read_to_string(path)
            .map_err(|e| format!("Failed to read {}: {}", path.display(), e))?;
        Self::from_str(&content)
    }

    /// Parse from string content.
    pub fn from_str(content: &str) -> Result<Self, String> {
        let mut entries: HashMap<String, Vec<MorphEntry>> = HashMap::new();
        let mut roots: HashMap<String, Vec<(u16, u16, u16)>> = HashMap::new();

        for line in content.lines() {
            let line = line.trim();
            if line.is_empty() || line.starts_with('#') || line.starts_with("LOCATION") {
                continue;
            }

            let parts: Vec<&str> = line.split('\t').collect();
            if parts.len() < 4 {
                continue;
            }

            let location = parts[0];
            let form_bw = parts[1].to_string();
            let tag = parts[2].to_string();
            let features = parts[3].to_string();

            // Parse location: (sura:aya:word:segment)
            let loc = location
                .trim_start_matches('(')
                .trim_end_matches(')');
            let loc_parts: Vec<&str> = loc.split(':').collect();
            if loc_parts.len() < 4 {
                continue;
            }

            let sura: u16 = loc_parts[0].parse().unwrap_or(0);
            let aya: u16 = loc_parts[1].parse().unwrap_or(0);
            let word: u16 = loc_parts[2].parse().unwrap_or(0);
            let segment: u16 = loc_parts[3].parse().unwrap_or(0);

            if sura == 0 || aya == 0 {
                continue;
            }

            let form_ar = transliteration::buckwalter_to_arabic(&form_bw);

            // Extract root and lemma from features
            let root = extract_feature(&features, "ROOT:");
            let lemma = extract_feature(&features, "LEM:");

            let key = format!("{}:{}:{}", sura, aya, word);

            let entry = MorphEntry {
                sura,
                aya,
                word,
                segment,
                form_bw,
                form_ar,
                tag,
                features,
                root: root.clone(),
                lemma,
            };

            entries.entry(key).or_default().push(entry);

            if !root.is_empty() {
                let loc_tuple = (sura, aya, word);
                roots
                    .entry(root)
                    .or_default()
                    .push(loc_tuple);
            }
        }

        // Deduplicate root locations
        for locs in roots.values_mut() {
            locs.sort();
            locs.dedup();
        }

        Ok(QacMorphology { entries, roots })
    }

    /// Get morphology entries for a specific word location.
    pub fn get(&self, sura: u16, aya: u16, word: u16) -> Option<&Vec<MorphEntry>> {
        let key = format!("{}:{}:{}", sura, aya, word);
        self.entries.get(&key)
    }

    /// Find all verse locations containing a given root.
    pub fn find_by_root(&self, root: &str) -> Option<&Vec<(u16, u16, u16)>> {
        self.roots.get(root)
    }
}

/// Extract a value from the features string by prefix.
/// e.g., "STEM|POS:N|LEM:{som|ROOT:smw|M|GEN" → extract_feature(..., "ROOT:") → "smw"
fn extract_feature(features: &str, prefix: &str) -> String {
    for part in features.split('|') {
        if let Some(rest) = part.strip_prefix(prefix) {
            return rest.to_string();
        }
    }
    String::new()
}
