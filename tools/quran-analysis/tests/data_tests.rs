use std::path::Path;

use quran_analysis::data::qac::QacMorphology;
use quran_analysis::data::quran::QuranText;
use quran_analysis::nlp::stopwords::StopWords;

// ===== QuranText Tests =====

#[test]
fn test_quran_text_parse_inline() {
    let content = "1|1|بسم الله الرحمن الرحيم\n1|2|الحمد لله رب العالمين\n";
    let qt = QuranText::from_str(content).unwrap();
    assert_eq!(qt.len(), 2);
}

#[test]
fn test_quran_text_get_verse() {
    let content = "1|1|بسم الله الرحمن الرحيم\n1|2|الحمد لله رب العالمين\n";
    let qt = QuranText::from_str(content).unwrap();
    let v = qt.get(1, 1).unwrap();
    assert_eq!(v.sura, 1);
    assert_eq!(v.aya, 1);
    assert!(v.text.contains("بسم"));
}

#[test]
fn test_quran_text_get_nonexistent() {
    let content = "1|1|بسم الله\n";
    let qt = QuranText::from_str(content).unwrap();
    assert!(qt.get(999, 999).is_none());
}

#[test]
fn test_quran_text_empty_lines_skipped() {
    let content = "1|1|بسم الله\n\n1|2|الحمد لله\n\n";
    let qt = QuranText::from_str(content).unwrap();
    assert_eq!(qt.len(), 2);
}

#[test]
fn test_quran_text_invalid_format() {
    let content = "invalid line without pipes\n";
    let result = QuranText::from_str(content);
    assert!(result.is_err());
}

#[test]
fn test_quran_simple_file_load() {
    let path = Path::new("data/quran-simple-clean.txt");
    if !path.exists() {
        eprintln!("Skipping file test: data not present");
        return;
    }
    let qt = QuranText::from_file(path).unwrap();
    assert_eq!(qt.len(), 6236); // Total verses in the Quran
    // Al-Fatiha verse 1
    let v = qt.get(1, 1).unwrap();
    assert!(v.text.contains("بسم"));
    // Last verse: An-Nas 114:6
    let v = qt.get(114, 6).unwrap();
    assert!(!v.text.is_empty());
}

#[test]
fn test_quran_uthmani_file_load() {
    let path = Path::new("data/quran-uthmani.txt");
    if !path.exists() {
        return;
    }
    let qt = QuranText::from_file(path).unwrap();
    assert_eq!(qt.len(), 6236);
    let v = qt.get(1, 1).unwrap();
    // Uthmani has diacritics
    assert!(v.text.contains("بِسْمِ"));
}

#[test]
fn test_english_translation_file_load() {
    let path = Path::new("data/en.sahih");
    if !path.exists() {
        return;
    }
    let qt = QuranText::from_file(path).unwrap();
    assert_eq!(qt.len(), 6236);
    let v = qt.get(1, 1).unwrap();
    assert!(v.text.to_lowercase().contains("name of allah"));
}

// ===== QAC Morphology Tests =====

#[test]
fn test_qac_parse_inline() {
    let content = "\
# Header comment
LOCATION\tFORM\tTAG\tFEATURES
(1:1:1:1)\tbi\tP\tPREFIX|bi+
(1:1:1:2)\tsomi\tN\tSTEM|POS:N|LEM:{som|ROOT:smw|M|GEN
(1:1:2:1)\t{ll~ahi\tPN\tSTEM|POS:PN|LEM:{ll~ah|ROOT:Alh|GEN
";
    let qac = QacMorphology::from_str(content).unwrap();
    // Check word 1:1:1 has two segments (prefix + stem)
    let entries = qac.get(1, 1, 1).unwrap();
    assert_eq!(entries.len(), 2); // two segments
    assert_eq!(entries[0].tag, "P");
    assert_eq!(entries[1].tag, "N");
}

#[test]
fn test_qac_root_extraction() {
    let content = "\
LOCATION\tFORM\tTAG\tFEATURES
(1:1:1:2)\tsomi\tN\tSTEM|POS:N|LEM:{som|ROOT:smw|M|GEN
";
    let qac = QacMorphology::from_str(content).unwrap();
    let entries = qac.get(1, 1, 1).unwrap();
    // Root is now converted from Buckwalter to Arabic: smw → سمو
    assert_eq!(entries[0].root, "سمو");
    assert_eq!(entries[0].lemma, "{som");
}

#[test]
fn test_qac_find_by_root() {
    let content = "\
LOCATION\tFORM\tTAG\tFEATURES
(1:1:1:2)\tsomi\tN\tSTEM|POS:N|LEM:{som|ROOT:smw|M|GEN
(67:3:5:2)\tsamowa`ti\tN\tSTEM|POS:N|LEM:samA'|ROOT:smw|FP|GEN
";
    let qac = QacMorphology::from_str(content).unwrap();
    // Root is now in Arabic: smw → سمو
    let locs = qac.find_by_root("سمو").unwrap();
    assert_eq!(locs.len(), 2);
}

#[test]
fn test_qac_buckwalter_to_arabic_conversion() {
    let content = "\
LOCATION\tFORM\tTAG\tFEATURES
(1:1:1:1)\tbi\tP\tPREFIX|bi+
";
    let qac = QacMorphology::from_str(content).unwrap();
    let entries = qac.get(1, 1, 1).unwrap();
    assert_eq!(entries[0].form_bw, "bi");
    assert_eq!(entries[0].form_ar, "بِ"); // buckwalter b=ب, i=kasra
}

#[test]
fn test_qac_file_load() {
    let path = Path::new("data/quranic-corpus-morphology-0.4.txt");
    if !path.exists() {
        return;
    }
    let qac = QacMorphology::from_file(path).unwrap();
    // Should have many entries
    assert!(!qac.entries.is_empty());
    // Check first verse first word
    let entries = qac.get(1, 1, 1).unwrap();
    assert!(entries.len() >= 2); // at least prefix + stem
}

// ===== StopWords Tests =====

#[test]
fn test_stopwords_parse_inline() {
    let content = "the\na\nis\n";
    let sw = StopWords::from_str(content);
    assert_eq!(sw.len(), 3);
    assert!(sw.contains("the"));
    assert!(sw.contains("a"));
    assert!(!sw.contains("hello"));
}

#[test]
fn test_stopwords_filter() {
    let content = "the\na\nis\n";
    let sw = StopWords::from_str(content);
    let words = vec!["the", "cat", "is", "here"];
    let filtered = sw.filter(&words);
    assert_eq!(filtered, vec!["cat", "here"]);
}

#[test]
fn test_stopwords_bom_handling() {
    // English stop words file has BOM marker
    let content = "\u{FEFF}able\nabout\n";
    let sw = StopWords::from_str(content);
    assert!(sw.contains("able"));
}

#[test]
fn test_stopwords_arabic_file_load() {
    let path = Path::new("data/quran-stop-words.strict.l1.ar");
    if !path.exists() {
        return;
    }
    let sw = StopWords::from_file(path).unwrap();
    assert!(sw.len() > 50); // should have many stop words
}

#[test]
fn test_stopwords_english_file_load() {
    let path = Path::new("data/english-stop-words.en");
    if !path.exists() {
        return;
    }
    let sw = StopWords::from_file(path).unwrap();
    assert!(sw.contains("able") || sw.contains("the") || sw.contains("about"));
}
