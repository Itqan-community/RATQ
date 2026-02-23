use std::path::Path;

use quick_xml::events::Event;
use quick_xml::reader::Reader;

use super::concepts::{Concept, Relation};

/// Parse an OWL ontology file and extract concepts and relations.
pub fn parse_owl(path: &Path) -> Result<(Vec<Concept>, Vec<Relation>), String> {
    let content = std::fs::read_to_string(path)
        .map_err(|e| format!("Failed to read OWL file: {}", e))?;
    parse_owl_str(&content)
}

/// Parse OWL XML content from a string.
pub fn parse_owl_str(content: &str) -> Result<(Vec<Concept>, Vec<Relation>), String> {
    let mut reader = Reader::from_str(content);

    let mut concepts: Vec<Concept> = Vec::new();
    let mut relations: Vec<Relation> = Vec::new();

    // Current concept/instance being parsed
    let mut in_entity = false;
    let mut entity_tag = String::new(); // full element name to match End
    let mut entity_id = String::new();
    let mut label_ar = String::new();
    let mut label_en = String::new();
    let mut frequency: u32 = 0;
    let mut root = String::new();
    let mut lemma = String::new();
    let mut synonyms: Vec<String> = Vec::new();

    // Current object property
    let mut in_obj_prop = false;
    let mut obj_prop_tag = String::new();

    // Current child tag context
    let mut current_child_tag = String::new();
    let mut current_lang = String::new();

    let mut buf = Vec::new();

    loop {
        match reader.read_event_into(&mut buf) {
            Ok(Event::Start(ref e)) => {
                let name = String::from_utf8_lossy(e.name().as_ref()).to_string();
                let local = strip_prefix(&name);

                if !in_entity && !in_obj_prop {
                    if local == "ObjectProperty" {
                        in_obj_prop = true;
                        obj_prop_tag = name.clone();
                    } else if get_attr(e, b"rdf:ID").is_some() {
                        // owl:Class or named individual
                        in_entity = true;
                        entity_tag = name.clone();
                        entity_id = get_attr(e, b"rdf:ID").unwrap_or_default();
                        label_ar.clear();
                        label_en.clear();
                        frequency = 0;
                        root.clear();
                        lemma.clear();
                        synonyms.clear();
                    }
                }

                current_child_tag = local.to_string();
                current_lang = get_attr(e, b"xml:lang").unwrap_or_default();
            }
            Ok(Event::Empty(ref e)) => {
                let name = String::from_utf8_lossy(e.name().as_ref()).to_string();

                if in_entity && name.contains("objpro:") {
                    let verb = name
                        .split("objpro:")
                        .nth(1)
                        .unwrap_or("")
                        .to_string();
                    let object = get_attr(e, b"rdf:resource").unwrap_or_default();
                    let freq: u32 = get_attr(e, b"frequency")
                        .unwrap_or_default()
                        .parse()
                        .unwrap_or(0);
                    let verb_en = get_attr(e, b"verb_translation_en").unwrap_or_default();
                    let verb_uthmani = get_attr(e, b"verb_uthmani").unwrap_or_default();

                    relations.push(Relation {
                        subject: entity_id.clone(),
                        verb,
                        object,
                        frequency: freq,
                        verb_en,
                        verb_uthmani,
                    });
                }
            }
            Ok(Event::Text(ref e)) => {
                let text = match e.unescape() {
                    Ok(t) => t.to_string(),
                    Err(_) => {
                        buf.clear();
                        continue;
                    }
                };
                if text.is_empty() {
                    buf.clear();
                    continue;
                }

                if in_entity {
                    match current_child_tag.as_str() {
                        "label" => {
                            if current_lang == "AR" {
                                label_ar = text;
                            } else if current_lang == "EN" {
                                label_en = text;
                            }
                        }
                        "frequency" => frequency = text.parse().unwrap_or(0),
                        "root" => root = text,
                        "lemma" => lemma = text,
                        tag if tag.starts_with("synonym") => {
                            synonyms.push(text);
                        }
                        _ => {}
                    }
                }
            }
            Ok(Event::End(ref e)) => {
                let name = String::from_utf8_lossy(e.name().as_ref()).to_string();

                if in_entity && name == entity_tag {
                    if !entity_id.is_empty() {
                        concepts.push(Concept {
                            id: entity_id.clone(),
                            label_ar: label_ar.clone(),
                            label_en: label_en.clone(),
                            frequency,
                            root: root.clone(),
                            lemma: lemma.clone(),
                            synonyms: synonyms.clone(),
                        });
                    }
                    in_entity = false;
                    entity_tag.clear();
                } else if in_obj_prop && name == obj_prop_tag {
                    in_obj_prop = false;
                    obj_prop_tag.clear();
                }

                current_child_tag.clear();
            }
            Ok(Event::Eof) => break,
            Err(e) => return Err(format!("XML parse error: {}", e)),
            _ => {}
        }
        buf.clear();
    }

    Ok((concepts, relations))
}

/// Strip namespace prefix from an XML name.
fn strip_prefix(name: &str) -> &str {
    name.rsplit(':').next().unwrap_or(name)
}

/// Get an attribute value from an XML start element.
///
/// Returns `None` if the attribute is not found or cannot be unescaped.
fn get_attr(e: &quick_xml::events::BytesStart, attr_name: &[u8]) -> Option<String> {
    for attr in e.attributes().flatten() {
        if attr.key.as_ref() == attr_name {
            return attr.unescape_value().ok().map(|v| v.to_string());
        }
    }
    None
}
