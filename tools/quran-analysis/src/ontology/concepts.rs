/// A concept in the Quran ontology.
#[derive(Debug, Clone)]
pub struct Concept {
    pub id: String,
    pub label_ar: String,
    pub label_en: String,
    pub frequency: u32,
    pub root: String,
    pub lemma: String,
    pub synonyms: Vec<String>,
}

/// A relation between two concepts.
#[derive(Debug, Clone)]
pub struct Relation {
    pub subject: String,
    pub verb: String,
    pub object: String,
    pub frequency: u32,
    pub verb_en: String,
    pub verb_uthmani: String,
}
