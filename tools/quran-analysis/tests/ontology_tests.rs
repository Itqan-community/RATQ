use quran_analysis::ontology::graph::OntologyGraph;
use quran_analysis::ontology::parser;

#[test]
fn test_parse_owl_inline() {
    let owl = r#"<?xml version="1.0" ?>
<rdf:RDF
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
  xmlns:owl="http://www.w3.org/2002/07/owl#"
  xmlns="http://example.com#"
  xmlns:objpro="http://example.com/objpro#"
  xmlns:annot="http://example.com/annot#"
>
<owl:ObjectProperty rdf:ID="خلق">
  <rdfs:label xml:lang="AR">خلق</rdfs:label>
  <rdfs:label xml:lang="EN">created</rdfs:label>
</owl:ObjectProperty>
<owl:Class rdf:ID="الله">
  <rdfs:label xml:lang="AR">الله</rdfs:label>
  <rdfs:label xml:lang="EN">god</rdfs:label>
  <annot:frequency xml:lang="EN">2699</annot:frequency>
  <annot:root xml:lang="AR">اله</annot:root>
  <objpro:خلق rdf:resource="إنسان" frequency="5" verb_translation_en="created" verb_uthmani="خَلَقَ" />
</owl:Class>
<owl:Class rdf:ID="إنسان">
  <rdfs:label xml:lang="AR">إنسان</rdfs:label>
  <rdfs:label xml:lang="EN">human</rdfs:label>
  <annot:frequency xml:lang="EN">65</annot:frequency>
</owl:Class>
</rdf:RDF>"#;

    let (concepts, relations) = parser::parse_owl_str(owl).unwrap();
    assert_eq!(concepts.len(), 2);
    assert_eq!(relations.len(), 1);

    let allah = concepts.iter().find(|c| c.id == "الله").unwrap();
    assert_eq!(allah.label_en, "god");
    assert_eq!(allah.frequency, 2699);
    assert_eq!(allah.root, "اله");

    let rel = &relations[0];
    assert_eq!(rel.subject, "الله");
    assert_eq!(rel.verb, "خلق");
    assert_eq!(rel.object, "إنسان");
    assert_eq!(rel.frequency, 5);
}

#[test]
fn test_graph_build_and_lookup() {
    let owl = r#"<?xml version="1.0" ?>
<rdf:RDF
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
  xmlns:owl="http://www.w3.org/2002/07/owl#"
  xmlns="http://example.com#"
  xmlns:objpro="http://example.com/objpro#"
  xmlns:annot="http://example.com/annot#"
>
<owl:Class rdf:ID="الله">
  <rdfs:label xml:lang="AR">الله</rdfs:label>
  <rdfs:label xml:lang="EN">god</rdfs:label>
  <annot:frequency xml:lang="EN">2699</annot:frequency>
  <objpro:خلق rdf:resource="إنسان" frequency="5" verb_translation_en="created" verb_uthmani="خَلَقَ" />
</owl:Class>
<owl:Class rdf:ID="إنسان">
  <rdfs:label xml:lang="AR">إنسان</rdfs:label>
  <rdfs:label xml:lang="EN">human</rdfs:label>
  <annot:frequency xml:lang="EN">65</annot:frequency>
  <annot:synonym_1 xml:lang="AR">بشر</annot:synonym_1>
</owl:Class>
</rdf:RDF>"#;

    let (concepts, relations) = parser::parse_owl_str(owl).unwrap();
    let graph = OntologyGraph::build(concepts, relations);

    assert_eq!(graph.concept_count(), 2);
    assert_eq!(graph.relation_count(), 1);

    // Lookup by English
    let god = graph.find_by_english("god").unwrap();
    assert_eq!(god.id, "الله");

    // Lookup by Arabic
    let human = graph.find_by_arabic("إنسان").unwrap();
    assert_eq!(human.label_en, "human");

    // Lookup by synonym
    let human_syn = graph.find_by_arabic("بشر").unwrap();
    assert_eq!(human_syn.id, "إنسان");
}

#[test]
fn test_graph_relations() {
    let owl = r#"<?xml version="1.0" ?>
<rdf:RDF
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
  xmlns:owl="http://www.w3.org/2002/07/owl#"
  xmlns="http://example.com#"
  xmlns:objpro="http://example.com/objpro#"
  xmlns:annot="http://example.com/annot#"
>
<owl:Class rdf:ID="الله">
  <rdfs:label xml:lang="AR">الله</rdfs:label>
  <rdfs:label xml:lang="EN">god</rdfs:label>
  <annot:frequency xml:lang="EN">2699</annot:frequency>
  <objpro:خلق rdf:resource="إنسان" frequency="5" verb_translation_en="created" verb_uthmani="خَلَقَ" />
  <objpro:خلق rdf:resource="سماء" frequency="3" verb_translation_en="created" verb_uthmani="خَلَقَ" />
</owl:Class>
<owl:Class rdf:ID="إنسان">
  <rdfs:label xml:lang="AR">إنسان</rdfs:label>
  <rdfs:label xml:lang="EN">human</rdfs:label>
  <annot:frequency xml:lang="EN">65</annot:frequency>
</owl:Class>
<owl:Class rdf:ID="سماء">
  <rdfs:label xml:lang="AR">سماء</rdfs:label>
  <rdfs:label xml:lang="EN">sky</rdfs:label>
  <annot:frequency xml:lang="EN">310</annot:frequency>
</owl:Class>
</rdf:RDF>"#;

    let (concepts, relations) = parser::parse_owl_str(owl).unwrap();
    let graph = OntologyGraph::build(concepts, relations);

    // Outgoing from الله
    let outgoing = graph.outgoing_relations("الله");
    assert_eq!(outgoing.len(), 2);

    // Incoming to إنسان
    let incoming = graph.incoming_relations("إنسان");
    assert_eq!(incoming.len(), 1);
    assert_eq!(incoming[0].subject, "الله");
}

#[test]
fn test_parse_full_owl_file() {
    let path = std::path::Path::new("data/qa.ontology.v1.owl");
    if !path.exists() {
        return;
    }
    let (concepts, relations) = parser::parse_owl(path).unwrap();
    // The ontology should have many concepts and relations
    assert!(concepts.len() > 100);
    assert!(relations.len() > 50);

    // Build graph
    let graph = OntologyGraph::build(concepts, relations);
    assert!(graph.concept_count() > 100);

    // Known concept: الله (allah)
    let allah = graph.find_by_english("allah");
    assert!(allah.is_some());
    if let Some(c) = allah {
        assert_eq!(c.label_ar, "الله");
    }
}

#[test]
fn test_graph_synonyms() {
    let owl = r#"<?xml version="1.0" ?>
<rdf:RDF
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
  xmlns:owl="http://www.w3.org/2002/07/owl#"
  xmlns="http://example.com#"
  xmlns:annot="http://example.com/annot#"
>
<owl:Class rdf:ID="إنسان">
  <rdfs:label xml:lang="AR">إنسان</rdfs:label>
  <rdfs:label xml:lang="EN">human</rdfs:label>
  <annot:frequency xml:lang="EN">65</annot:frequency>
  <annot:synonym_1 xml:lang="AR">بشر</annot:synonym_1>
  <annot:synonym_2 xml:lang="AR">آدمي</annot:synonym_2>
</owl:Class>
</rdf:RDF>"#;

    let (concepts, relations) = parser::parse_owl_str(owl).unwrap();
    let graph = OntologyGraph::build(concepts, relations);

    let syns = graph.get_synonyms("إنسان");
    assert!(syns.contains(&"بشر".to_string()));
    assert!(syns.contains(&"آدمي".to_string()));
    assert!(syns.contains(&"إنسان".to_string()));
}
