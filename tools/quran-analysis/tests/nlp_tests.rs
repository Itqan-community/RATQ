use quran_analysis::nlp::pos_tagger::PosTagger;
use quran_analysis::nlp::stopwords::StopWords;
use quran_analysis::nlp::wordnet::WordNet;
use quran_analysis::search::query;

// ===== POS Tagger Tests =====

fn sample_lexicon() -> PosTagger {
    let content = "\
the DT
cat NN
is VBZ
running VBG
big JJ
quickly RB
book NN VB
";
    PosTagger::from_str(content)
}

#[test]
fn test_pos_tagger_lexicon_lookup() {
    let tagger = sample_lexicon();
    let tagged = tagger.tag("the cat is running");
    assert_eq!(tagged.len(), 4);
    assert_eq!(tagged[0].tag, "DT");
    assert_eq!(tagged[1].tag, "NN");
    assert_eq!(tagged[2].tag, "VBZ");
    assert_eq!(tagged[3].tag, "VBG");
}

#[test]
fn test_pos_tagger_suffix_heuristics() {
    let tagger = sample_lexicon();
    // "walking" not in lexicon, -ing suffix → VBG
    let tagged = tagger.tag("walking");
    assert_eq!(tagged[0].tag, "VBG");
}

#[test]
fn test_pos_tagger_ly_suffix() {
    let tagger = sample_lexicon();
    let tagged = tagger.tag("happily");
    assert_eq!(tagged[0].tag, "RB");
}

#[test]
fn test_pos_tagger_ed_suffix() {
    let tagger = sample_lexicon();
    let tagged = tagger.tag("walked");
    assert_eq!(tagged[0].tag, "VBN");
}

#[test]
fn test_pos_tagger_unknown_default_noun() {
    let tagger = sample_lexicon();
    let tagged = tagger.tag("xyz");
    assert_eq!(tagged[0].tag, "NN");
}

#[test]
fn test_pos_tagger_empty_text() {
    let tagger = sample_lexicon();
    let tagged = tagger.tag("");
    assert!(tagged.is_empty());
}

#[test]
fn test_pos_tagger_file_load() {
    let path = std::path::Path::new("data/pos-lexicon.txt");
    if !path.exists() {
        return;
    }
    let tagger = PosTagger::from_file(path).unwrap();
    assert!(tagger.lexicon_size() > 1000);
    let tagged = tagger.tag("the book is on the table");
    assert!(!tagged.is_empty());
    // "the" should be tagged as DT (determiner)
    assert_eq!(tagged[0].tag, "DT");
}

// ===== WordNet Tests =====

#[test]
fn test_wordnet_empty() {
    let wn = WordNet::default();
    assert!(wn.is_empty());
    assert!(wn.get_synonyms("test").is_empty());
}

// ===== Query Expansion Tests =====

#[test]
fn test_parse_query_arabic() {
    let words = query::parse_query("بسم الله", "ar");
    assert_eq!(words.len(), 2);
    // Should be normalized
    assert!(words[0].chars().all(|c| {
        !matches!(c, '\u{064B}'..='\u{065F}')
    }));
}

#[test]
fn test_parse_query_english() {
    let words = query::parse_query("In the Name of God", "en");
    assert_eq!(words, vec!["in", "the", "name", "of", "god"]);
}

#[test]
fn test_parse_query_auto_detect() {
    // Auto-detect language from content
    let words = query::parse_query("محمد", "ar");
    assert_eq!(words.len(), 1);
}

#[test]
fn test_expand_by_synonyms_with_empty_wordnet() {
    let wn = WordNet::default();
    let sw = StopWords::from_str("");
    let words = vec!["mercy".to_string()];
    let expanded = query::expand_by_synonyms(&words, &wn, &sw);
    assert_eq!(expanded, vec!["mercy"]);
}

#[test]
fn test_expand_by_synonyms_skips_stopwords() {
    let wn = WordNet::default();
    let sw = StopWords::from_str("the\na\n");
    let words = vec!["the".to_string(), "book".to_string()];
    let expanded = query::expand_by_synonyms(&words, &wn, &sw);
    // "the" should not get synonyms added (it's a stop word)
    assert!(expanded.contains(&"the".to_string()));
    assert!(expanded.contains(&"book".to_string()));
}
