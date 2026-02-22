use quran_analysis::core::arabic;
use quran_analysis::data::quran::QuranText;
use quran_analysis::nlp::stopwords::StopWords;
use quran_analysis::search::index::InvertedIndex;
use quran_analysis::search::scoring;

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
