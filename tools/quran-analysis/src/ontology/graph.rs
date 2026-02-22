use std::collections::HashMap;

use super::concepts::{Concept, Relation};

/// Ontology graph with adjacency-list indexing.
pub struct OntologyGraph {
    pub concepts: HashMap<String, Concept>,
    pub concepts_en: HashMap<String, String>, // English label → concept ID
    /// Forward index: source concept → outgoing relations.
    pub sources: HashMap<String, Vec<Relation>>,
    /// Reverse index: target concept → incoming relations.
    pub targets: HashMap<String, Vec<Relation>>,
    /// Synonym index: synonym → concept ID.
    pub synonyms: HashMap<String, String>,
}

impl OntologyGraph {
    /// Build the graph from parsed concepts and relations.
    pub fn build(concepts: Vec<Concept>, relations: Vec<Relation>) -> Self {
        let mut concept_map = HashMap::new();
        let mut concepts_en = HashMap::new();
        let mut synonyms = HashMap::new();

        for concept in &concepts {
            concept_map.insert(concept.id.clone(), concept.clone());
            if !concept.label_en.is_empty() {
                concepts_en.insert(
                    concept.label_en.to_lowercase(),
                    concept.id.clone(),
                );
            }
            if !concept.label_ar.is_empty() {
                synonyms.insert(concept.label_ar.clone(), concept.id.clone());
            }
            for syn in &concept.synonyms {
                if !syn.is_empty() {
                    synonyms.insert(syn.clone(), concept.id.clone());
                }
            }
        }

        let mut sources: HashMap<String, Vec<Relation>> = HashMap::new();
        let mut targets: HashMap<String, Vec<Relation>> = HashMap::new();

        for rel in &relations {
            sources
                .entry(rel.subject.clone())
                .or_default()
                .push(rel.clone());
            targets
                .entry(rel.object.clone())
                .or_default()
                .push(rel.clone());
        }

        OntologyGraph {
            concepts: concept_map,
            concepts_en,
            sources,
            targets,
            synonyms,
        }
    }

    /// Get a concept by ID.
    pub fn get_concept(&self, id: &str) -> Option<&Concept> {
        self.concepts.get(id)
    }

    /// Find a concept by English label (case-insensitive).
    pub fn find_by_english(&self, label: &str) -> Option<&Concept> {
        self.concepts_en
            .get(&label.to_lowercase())
            .and_then(|id| self.concepts.get(id))
    }

    /// Find a concept by Arabic label or synonym.
    pub fn find_by_arabic(&self, text: &str) -> Option<&Concept> {
        self.synonyms
            .get(text)
            .and_then(|id| self.concepts.get(id))
    }

    /// Get outgoing relations from a concept.
    pub fn outgoing_relations(&self, concept_id: &str) -> &[Relation] {
        self.sources
            .get(concept_id)
            .map(|v| v.as_slice())
            .unwrap_or(&[])
    }

    /// Get incoming relations to a concept.
    pub fn incoming_relations(&self, concept_id: &str) -> &[Relation] {
        self.targets
            .get(concept_id)
            .map(|v| v.as_slice())
            .unwrap_or(&[])
    }

    /// Get synonyms for a concept (from ontology annotations).
    pub fn get_synonyms(&self, concept_id: &str) -> Vec<String> {
        match self.concepts.get(concept_id) {
            Some(c) => {
                let mut syns = c.synonyms.clone();
                if !c.label_ar.is_empty() && !syns.contains(&c.label_ar) {
                    syns.push(c.label_ar.clone());
                }
                syns
            }
            None => Vec::new(),
        }
    }

    /// Number of concepts.
    pub fn concept_count(&self) -> usize {
        self.concepts.len()
    }

    /// Number of relations.
    pub fn relation_count(&self) -> usize {
        self.sources.values().map(|v| v.len()).sum()
    }
}
