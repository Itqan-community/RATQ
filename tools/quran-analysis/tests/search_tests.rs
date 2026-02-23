use quran_analysis::core::arabic;
use quran_analysis::data::qac::QacMorphology;
use quran_analysis::data::quran::QuranText;
use quran_analysis::nlp::stopwords::StopWords;
use quran_analysis::search::index::InvertedIndex;
use quran_analysis::search::{query, scoring};

// ===== InvertedIndex Tests =====

fn sample_quran() -> QuranText {
    let content = "\
1|1|بسم الله الرحمن الرحيم
1|2|الحمد لله رب العالمين
1|3|الرحمن الرحيم
1|4|مالك يوم الدين
1|5|إياك نعبد وإياك نستعين
1|6|اهدنا الصراط المستقيم
1|7|صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين
";
    QuranText::from_str(content).unwrap()
}

fn empty_stopwords() -> StopWords {
    StopWords::from_str("")
}

#[test]
fn test_build_index_from_quran() {
    let quran = sample_quran();
    let sw = empty_stopwords();
    let idx = InvertedIndex::build(&quran, &sw);
    assert!(!idx.is_empty());
}

#[test]
fn test_index_lookup_exact_word() {
    let quran = sample_quran();
    let sw = empty_stopwords();
    let idx = InvertedIndex::build(&quran, &sw);
    // "الله" should be in verse 1:1
    let normalized = arabic::normalize_arabic("الله");
    let results = idx.lookup(&normalized);
    assert!(!results.is_empty());
    assert!(results.iter().any(|e| e.sura == 1 && e.aya == 1));
}

#[test]
fn test_index_lookup_repeated_word() {
    let quran = sample_quran();
    let sw = empty_stopwords();
    let idx = InvertedIndex::build(&quran, &sw);
    // "الرحيم" appears in verse 1:1 and 1:3
    let normalized = arabic::normalize_arabic("الرحيم");
    let results = idx.lookup(&normalized);
    assert!(results.len() >= 2);
    let verses: Vec<(u16, u16)> = results.iter().map(|e| (e.sura, e.aya)).collect();
    assert!(verses.contains(&(1, 1)));
    assert!(verses.contains(&(1, 3)));
}

#[test]
fn test_index_lookup_nonexistent_word() {
    let quran = sample_quran();
    let sw = empty_stopwords();
    let idx = InvertedIndex::build(&quran, &sw);
    let results = idx.lookup("xyznotfound");
    assert!(results.is_empty());
}

#[test]
fn test_index_with_stopwords() {
    let quran = sample_quran();
    // Mark common words as stop words
    let sw = StopWords::from_str("ولا\nغير\n");
    let idx = InvertedIndex::build(&quran, &sw);
    // Stop words should still be indexed (for exact match)
    // but the index should still work
    assert!(!idx.is_empty());
}

#[test]
fn test_index_vocabulary_size() {
    let quran = sample_quran();
    let sw = empty_stopwords();
    let idx = InvertedIndex::build(&quran, &sw);
    assert!(idx.vocabulary_size() > 10);
}

// ===== Scoring Tests =====

#[test]
fn test_score_exact_match_higher_than_partial() {
    let quran = sample_quran();
    let sw = empty_stopwords();
    let idx = InvertedIndex::build(&quran, &sw);

    let query_words: Vec<String> = vec!["الرحمن".to_string(), "الرحيم".to_string()];
    let normalized: Vec<String> = query_words
        .iter()
        .map(|w| arabic::normalize_arabic(w))
        .collect();

    let results = scoring::score_search(&idx, &normalized, &quran);
    assert!(!results.is_empty());

    // Verse 1:1 and 1:3 both contain "الرحمن الرحيم"
    // They should be top results
    let top = &results[0];
    assert!(top.sura == 1 && (top.aya == 1 || top.aya == 3));
}

#[test]
fn test_score_single_word_query() {
    let quran = sample_quran();
    let sw = empty_stopwords();
    let idx = InvertedIndex::build(&quran, &sw);

    let normalized = vec![arabic::normalize_arabic("الحمد")];
    let results = scoring::score_search(&idx, &normalized, &quran);
    assert!(!results.is_empty());
    assert_eq!(results[0].sura, 1);
    assert_eq!(results[0].aya, 2);
}

#[test]
fn test_score_empty_query() {
    let quran = sample_quran();
    let sw = empty_stopwords();
    let idx = InvertedIndex::build(&quran, &sw);

    let results = scoring::score_search(&idx, &[], &quran);
    assert!(results.is_empty());
}

#[test]
fn test_scored_document_fields() {
    let quran = sample_quran();
    let sw = empty_stopwords();
    let idx = InvertedIndex::build(&quran, &sw);

    let normalized = vec![arabic::normalize_arabic("الله")];
    let results = scoring::score_search(&idx, &normalized, &quran);
    let top = &results[0];
    assert!(top.score > 0.0);
    assert!(top.freq > 0);
}

// ===== Weighted Scoring Tests =====

#[test]
fn test_weighted_term_default_weight() {
    let term = scoring::WeightedTerm {
        word: "test".to_string(),
        weight: 1.0,
    };
    assert_eq!(term.weight, 1.0);
    assert_eq!(term.word, "test");
}

#[test]
fn test_score_search_weighted_original_higher_than_expansion() {
    let quran = sample_quran();
    let sw = empty_stopwords();
    let idx = InvertedIndex::build(&quran, &sw);

    let normalized = arabic::normalize_arabic("الله");
    // Original word at full weight
    let original = vec![scoring::WeightedTerm {
        word: normalized.clone(),
        weight: 1.0,
    }];
    // Same word at half weight (as if it were an expansion)
    let half_weight = vec![scoring::WeightedTerm {
        word: normalized,
        weight: 0.5,
    }];

    let results_orig = scoring::score_search_weighted(&idx, &original, &quran);
    let results_half = scoring::score_search_weighted(&idx, &half_weight, &quran);

    assert!(!results_orig.is_empty());
    assert!(!results_half.is_empty());
    // Original weight should produce higher scores
    assert!(results_orig[0].score > results_half[0].score);
}

#[test]
fn test_score_search_weighted_empty_terms() {
    let quran = sample_quran();
    let sw = empty_stopwords();
    let idx = InvertedIndex::build(&quran, &sw);

    let results = scoring::score_search_weighted(&idx, &[], &quran);
    assert!(results.is_empty());
}

// ===== Full file search tests =====

#[test]
fn test_search_muhammad_in_full_quran() {
    let path = std::path::Path::new("data/quran-simple-clean.txt");
    if !path.exists() {
        return;
    }
    let quran = QuranText::from_file(path).unwrap();
    let sw_path = std::path::Path::new("data/quran-stop-words.strict.l1.ar");
    let sw = if sw_path.exists() {
        StopWords::from_file(sw_path).unwrap()
    } else {
        empty_stopwords()
    };
    let idx = InvertedIndex::build(&quran, &sw);

    // Search for "محمد" — should find sura 47 (Muhammad) and others
    let normalized = vec![arabic::normalize_arabic("محمد")];
    let results = scoring::score_search(&idx, &normalized, &quran);
    assert!(!results.is_empty());
    let suras: Vec<u16> = results.iter().map(|r| r.sura).collect();
    assert!(suras.contains(&47)); // Sura Muhammad
}

#[test]
fn test_search_english_translation() {
    let path = std::path::Path::new("data/en.sahih");
    if !path.exists() {
        return;
    }
    let quran = QuranText::from_file(path).unwrap();
    let sw = empty_stopwords();
    let idx = InvertedIndex::build_english(&quran, &sw);

    let results = scoring::score_search(&idx, &["mercy".to_string()], &quran);
    assert!(!results.is_empty());
}

// ===== Root Expansion Tests =====

#[test]
fn test_root_expansion_arab() {
    let qac_path = std::path::Path::new("data/quranic-corpus-morphology-0.4.txt");
    if !qac_path.exists() {
        return;
    }
    let qac = QacMorphology::from_file(qac_path).unwrap();

    let words = vec!["عرب".to_string()];
    let expanded = query::expand_by_roots(&words, &qac);
    assert!(
        expanded.len() > 1,
        "Should expand 'عرب' to multiple forms, got: {:?}",
        expanded
    );
}

// ===== Document Frequency Cache Tests =====

#[test]
fn test_document_frequency_cache_matches_computed() {
    let quran = sample_quran();
    let sw = empty_stopwords();
    let idx = InvertedIndex::build(&quran, &sw);

    // The cached df should match the computed df for any word
    let word = arabic::normalize_arabic("الرحيم");
    let cached_df = idx.document_frequency(&word);
    // "الرحيم" appears in verses 1:1 and 1:3
    assert_eq!(cached_df, 2);
}

#[test]
fn test_document_frequency_cache_nonexistent_word() {
    let quran = sample_quran();
    let sw = empty_stopwords();
    let idx = InvertedIndex::build(&quran, &sw);

    let cached_df = idx.document_frequency("xyznotfound");
    assert_eq!(cached_df, 0);
}

// ===== Vocabulary Accessor Tests =====

#[test]
fn test_vocabulary_returns_all_indexed_words() {
    let quran = sample_quran();
    let sw = empty_stopwords();
    let idx = InvertedIndex::build(&quran, &sw);

    let vocab = idx.vocabulary();
    // Should contain all unique normalized words
    assert_eq!(vocab.len(), idx.vocabulary_size());
    // Every word in vocabulary should be lookupable
    for word in &vocab {
        assert!(!idx.lookup(word).is_empty());
    }
}

// ===== Root Expansion Tests =====

#[test]
fn test_search_arab_with_expansion() {
    let quran_path = std::path::Path::new("data/quran-simple-clean.txt");
    let qac_path = std::path::Path::new("data/quranic-corpus-morphology-0.4.txt");
    if !quran_path.exists() || !qac_path.exists() {
        return;
    }

    let quran = QuranText::from_file(quran_path).unwrap();
    let sw = StopWords::from_str("");
    let index = InvertedIndex::build(&quran, &sw);
    let qac = QacMorphology::from_file(qac_path).unwrap();

    let query_words = query::parse_query("عرب", "ar");
    let expanded = query::expand_by_roots(&query_words, &qac);
    let scored = scoring::score_search(&index, &expanded, &quran);

    assert!(
        !scored.is_empty(),
        "Search for 'عرب' should return results after root expansion"
    );
}
