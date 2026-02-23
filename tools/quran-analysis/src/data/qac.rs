use std::collections::HashMap;
use std::path::Path;

use crate::core::arabic;
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
    /// Reverse index: normalized Arabic form → list of Arabic roots.
    pub form_to_roots: HashMap<String, Vec<String>>,
    /// Forward index: Arabic root → list of normalized surface forms.
    pub root_to_forms: HashMap<String, Vec<String>>,
    /// Forward index: lemma (Arabic) → list of normalized surface forms.
    pub lemma_to_forms: HashMap<String, Vec<String>>,
    /// Reverse index: normalized form → list of lemmas (Arabic).
    pub form_to_lemmas: HashMap<String, Vec<String>>,
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
        let mut form_to_roots: HashMap<String, Vec<String>> = HashMap::new();
        let mut root_to_forms: HashMap<String, Vec<String>> = HashMap::new();
        let mut lemma_to_forms: HashMap<String, Vec<String>> = HashMap::new();
        let mut form_to_lemmas: HashMap<String, Vec<String>> = HashMap::new();

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

            if sura == 0 || aya == 0 || word == 0 {
                continue;
            }

            let form_ar = transliteration::buckwalter_to_arabic(&form_bw);

            // Extract root and lemma from features
            let root_bw = extract_feature(&features, "ROOT:");
            let lemma_bw = extract_feature(&features, "LEM:");

            // Convert root from Buckwalter to Arabic
            let root_ar = if root_bw.is_empty() {
                String::new()
            } else {
                transliteration::buckwalter_to_arabic(&root_bw)
            };

            // Convert lemma from Buckwalter to Arabic
            let lemma_ar = if lemma_bw.is_empty() {
                String::new()
            } else {
                transliteration::buckwalter_to_arabic(&lemma_bw)
            };

            let key = format!("{}:{}:{}", sura, aya, word);

            let entry = MorphEntry {
                sura,
                aya,
                word,
                segment,
                form_bw,
                form_ar: form_ar.clone(),
                tag,
                features,
                root: root_ar.clone(),
                lemma: lemma_ar.clone(),
            };

            entries.entry(key).or_default().push(entry);

            let normalized_form = arabic::normalize_arabic(&form_ar);

            if !root_ar.is_empty() && !normalized_form.is_empty() {
                let loc_tuple = (sura, aya, word);
                let normalized_root_key = arabic::normalize_arabic(&root_ar);
                roots
                    .entry(normalized_root_key)
                    .or_default()
                    .push(loc_tuple);

                // Build form_to_roots: normalized form → roots
                let normalized_root = arabic::normalize_arabic(&root_ar);
                let form_roots = form_to_roots
                    .entry(normalized_form.clone())
                    .or_default();
                if !form_roots.contains(&normalized_root) {
                    form_roots.push(normalized_root.clone());
                }

                // Build root_to_forms: root → normalized forms
                let root_forms = root_to_forms
                    .entry(normalized_root)
                    .or_default();
                if !root_forms.contains(&normalized_form) {
                    root_forms.push(normalized_form.clone());
                }
            }

            // Build lemma indexes
            if !lemma_ar.is_empty() && !normalized_form.is_empty() {
                let normalized_lemma = arabic::normalize_arabic(&lemma_ar);
                if !normalized_lemma.is_empty() {
                    // lemma_to_forms
                    let lem_forms = lemma_to_forms
                        .entry(normalized_lemma.clone())
                        .or_default();
                    if !lem_forms.contains(&normalized_form) {
                        lem_forms.push(normalized_form.clone());
                    }

                    // form_to_lemmas
                    let form_lems = form_to_lemmas
                        .entry(normalized_form)
                        .or_default();
                    if !form_lems.contains(&normalized_lemma) {
                        form_lems.push(normalized_lemma);
                    }
                }
            }
        }

        // Deduplicate root locations
        for locs in roots.values_mut() {
            locs.sort();
            locs.dedup();
        }

        Ok(QacMorphology {
            entries,
            roots,
            form_to_roots,
            root_to_forms,
            lemma_to_forms,
            form_to_lemmas,
        })
    }

    /// Get morphology entries for a specific word location.
    pub fn get(&self, sura: u16, aya: u16, word: u16) -> Option<&Vec<MorphEntry>> {
        let key = format!("{}:{}:{}", sura, aya, word);
        self.entries.get(&key)
    }

    /// Find all verse locations containing a given root.
    ///
    /// The root is normalized before lookup so callers can pass
    /// either raw or normalized Arabic text.
    pub fn find_by_root(&self, root: &str) -> Option<&Vec<(u16, u16, u16)>> {
        let normalized = arabic::normalize_arabic(root);
        self.roots.get(&normalized)
    }

    /// Find the root of a normalized Arabic word form.
    ///
    /// Looks up the normalized form in the `form_to_roots` index
    /// and returns the first root found.
    pub fn find_root_by_form(&self, form: &str) -> Option<String> {
        let normalized = arabic::normalize_arabic(form);
        self.form_to_roots
            .get(&normalized)
            .and_then(|roots| roots.first().cloned())
    }

    /// Get all unique normalized surface forms that share a given root.
    ///
    /// The root should be in Arabic script. It will be normalized
    /// before lookup.
    pub fn get_surface_forms_for_root(&self, root: &str) -> Vec<String> {
        let normalized = arabic::normalize_arabic(root);
        self.root_to_forms
            .get(&normalized)
            .cloned()
            .unwrap_or_default()
    }

    /// Find the lemma of a normalized Arabic word form.
    pub fn find_lemma_by_form(&self, form: &str) -> Option<String> {
        let normalized = arabic::normalize_arabic(form);
        self.form_to_lemmas
            .get(&normalized)
            .and_then(|lemmas| lemmas.first().cloned())
    }

    /// Get all unique normalized surface forms sharing a given lemma.
    pub fn get_surface_forms_for_lemma(&self, lemma: &str) -> Vec<String> {
        let normalized = arabic::normalize_arabic(lemma);
        self.lemma_to_forms
            .get(&normalized)
            .cloned()
            .unwrap_or_default()
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
