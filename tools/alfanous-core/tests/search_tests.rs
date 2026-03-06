use alfanous_core::db;
use alfanous_core::search;

fn setup_db() -> rusqlite::Connection {
    let quran_path = concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../quran-analysis/data/quran-simple-clean.txt"
    );
    db::create_in_memory(quran_path).expect("Failed to create test DB")
}

#[test]
fn search_single_word_with_al_prefix() {
    // This was the critical bug in Fady's implementation
    let conn = setup_db();
    let results = search::execute(&conn, "الصلاة", 10).unwrap();
    assert!(!results.is_empty(), "الصلاة should return results");
    // Should find verses about prayer
    assert!(results.iter().any(|r| r.text.contains("الصلاة") || r.text.contains("الصلوة")));
}

#[test]
fn search_another_failing_word() {
    let conn = setup_db();
    let results = search::execute(&conn, "الزكاة", 10).unwrap();
    assert!(!results.is_empty(), "الزكاة should return results");
}

#[test]
fn search_and_query() {
    let conn = setup_db();
    let results = search::execute(&conn, "الجنة + النار", 10).unwrap();
    assert!(!results.is_empty(), "الجنة + النار should return results");
    // Each result should contain both terms
    for r in &results {
        let normalized = alfanous_core::normalize::normalize_for_search(&r.text);
        assert!(
            normalized.contains("الجنه") || normalized.contains("جنه"),
            "Result should contain الجنة variant: {}",
            r.text
        );
    }
}

#[test]
fn search_or_query() {
    let conn = setup_db();
    let results_or = search::execute(&conn, "الجنة | النار", 100).unwrap();
    let results_jannah = search::execute(&conn, "الجنة", 100).unwrap();
    // OR should return results (at least as many as one individual term)
    assert!(!results_or.is_empty());
    assert!(results_or.len() >= results_jannah.len());
}

#[test]
fn search_phrase_query() {
    let conn = setup_db();
    let results = search::execute(&conn, "\"بسم الله الرحمن الرحيم\"", 10).unwrap();
    assert!(!results.is_empty(), "Basmala phrase should return results");
    // First result should be Al-Fatiha verse 1
    assert_eq!(results[0].sura_id, 1);
    assert_eq!(results[0].aya_id, 1);
}

#[test]
fn search_not_query() {
    let conn = setup_db();
    // Use a high limit to ensure the difference is visible
    let results_all = search::execute(&conn, "الله", 3000).unwrap();
    let results_not = search::execute(&conn, "الله + -الرحمن", 3000).unwrap();
    // NOT should return fewer results
    assert!(
        results_not.len() < results_all.len(),
        "NOT query should return fewer results: all={}, not={}",
        results_all.len(),
        results_not.len()
    );
}

#[test]
fn search_returns_structured_results() {
    let conn = setup_db();
    let results = search::execute(&conn, "الحمد", 5).unwrap();
    assert!(!results.is_empty());
    let first = &results[0];
    assert!(first.sura_id > 0);
    assert!(first.aya_id > 0);
    assert!(!first.sura_name.is_empty());
    assert!(!first.text.is_empty());
}

#[test]
fn search_respects_limit() {
    let conn = setup_db();
    let results = search::execute(&conn, "الله", 5).unwrap();
    assert!(results.len() <= 5);
}

#[test]
fn search_empty_query_returns_empty() {
    let conn = setup_db();
    let results = search::execute(&conn, "", 10).unwrap();
    assert!(results.is_empty());
}

#[test]
fn search_field_sura_name() {
    let conn = setup_db();
    let results = search::execute(&conn, "سورة:البقرة", 300).unwrap();
    assert!(!results.is_empty());
    for r in &results {
        assert_eq!(r.sura_id, 2, "All results should be from Al-Baqara");
    }
}

#[test]
fn search_root_operator() {
    let conn = setup_db();
    // >> root operator: search by Arabic trilateral root
    // Root رحم (rHm) should find رحمن, رحيم, رحمة, etc.
    let results = search::execute(&conn, ">>رحم", 20).unwrap();
    assert!(!results.is_empty(), "Root search >>رحم should return results");
}

#[test]
fn search_root_returns_more_than_single_word() {
    let conn = setup_db();
    let root_results = search::execute(&conn, ">>رحم", 100).unwrap();
    let single_results = search::execute(&conn, "رحم", 100).unwrap();
    // Root search should find more verses (رحمن, رحيم, رحمة, etc.)
    assert!(
        root_results.len() >= single_results.len(),
        "Root >>رحم ({}) should find at least as many as رحم ({})",
        root_results.len(),
        single_results.len()
    );
}

#[test]
fn search_wildcard_query() {
    let conn = setup_db();
    let results = search::execute(&conn, "كتب*", 10).unwrap();
    assert!(!results.is_empty(), "Wildcard كتب* should return results");
}

#[test]
fn search_spell_tolerant() {
    let conn = setup_db();
    // % operator should expand spelling variants
    let results = search::execute(&conn, "%رحمه", 10).unwrap();
    assert!(!results.is_empty(), "Spell-tolerant %رحمه should return results");
}

// --- Additional search integration tests ---

#[test]
fn search_whitespace_only_returns_empty() {
    let conn = setup_db();
    let results = search::execute(&conn, "   ", 10).unwrap();
    assert!(results.is_empty());
}

#[test]
fn search_vocalized_input_matches() {
    let conn = setup_db();
    // User types with tashkeel — should still find results after normalization
    let results = search::execute(&conn, "الصَّلاةِ", 10).unwrap();
    assert!(!results.is_empty(), "Vocalized input الصَّلاةِ should match after normalization");
}

#[test]
fn search_hamza_variant_input() {
    let conn = setup_db();
    // أمنوا vs آمنوا — both should match the same verses
    let results_hamza = search::execute(&conn, "أمنوا", 20).unwrap();
    let results_madda = search::execute(&conn, "آمنوا", 20).unwrap();
    // Both normalize to "امنوا"
    assert!(!results_hamza.is_empty(), "أمنوا should return results");
    assert!(!results_madda.is_empty(), "آمنوا should return results");
}

#[test]
fn search_taa_marbuta_matches() {
    let conn = setup_db();
    // ة and ه should match interchangeably after normalization
    let results = search::execute(&conn, "رحمة", 10).unwrap();
    assert!(!results.is_empty(), "رحمة should find results (normalized to رحمه)");
}

#[test]
fn search_field_sura_fatiha() {
    let conn = setup_db();
    let results = search::execute(&conn, "سورة:الفاتحة", 10).unwrap();
    assert!(!results.is_empty());
    for r in &results {
        assert_eq!(r.sura_id, 1, "All results should be from Al-Fatiha");
    }
    assert_eq!(results.len(), 7, "Al-Fatiha has 7 verses");
}

#[test]
fn search_field_sura_all_baqara_verses() {
    let conn = setup_db();
    let results = search::execute(&conn, "سورة:البقرة", 300).unwrap();
    assert_eq!(results.len(), 286, "Al-Baqara should have 286 verses");
}

#[test]
fn search_phrase_not_found() {
    let conn = setup_db();
    // A phrase that doesn't exist in the Quran
    let results = search::execute(&conn, "\"كلمات ليست في القرآن أبدا\"", 10).unwrap();
    assert!(results.is_empty(), "Non-existent phrase should return no results");
}

#[test]
fn search_and_both_terms_present() {
    let conn = setup_db();
    let results = search::execute(&conn, "الصلاة + الزكاة", 50).unwrap();
    assert!(!results.is_empty(), "الصلاة + الزكاة should find results");
    // Each result should contain both terms (in normalized form)
    for r in &results {
        let normalized = alfanous_core::normalize::normalize_for_search(&r.text);
        let has_salah = normalized.contains("صلاه") || normalized.contains("الصلاه") || normalized.contains("صلوه");
        let has_zakat = normalized.contains("زكاه") || normalized.contains("الزكاه");
        assert!(
            has_salah && has_zakat,
            "AND result should contain both terms. Text: {}",
            r.text
        );
    }
}

#[test]
fn search_or_returns_union() {
    let conn = setup_db();
    let results_a = search::execute(&conn, "نوح", 200).unwrap();
    let results_b = search::execute(&conn, "إبراهيم", 200).unwrap();
    let results_or = search::execute(&conn, "نوح | إبراهيم", 200).unwrap();
    assert!(
        results_or.len() >= results_a.len(),
        "OR should return at least as many as first term"
    );
    assert!(
        results_or.len() >= results_b.len(),
        "OR should return at least as many as second term"
    );
}

#[test]
fn search_not_excludes_term() {
    let conn = setup_db();
    let results = search::execute(&conn, "الله + -الرحمن", 50).unwrap();
    for r in &results {
        let normalized = alfanous_core::normalize::normalize_for_search(&r.text);
        assert!(
            !normalized.contains("الرحمن"),
            "NOT results should exclude الرحمن. Text: {}",
            r.text
        );
    }
}

#[test]
fn search_sura_name_populated() {
    let conn = setup_db();
    let results = search::execute(&conn, "الحمد", 1).unwrap();
    assert!(!results.is_empty());
    // First result (الحمد لله رب العالمين) should be from الفاتحة
    let r = &results[0];
    assert!(!r.sura_name.is_empty(), "sura_name should not be empty");
}

#[test]
fn search_limit_one() {
    let conn = setup_db();
    let results = search::execute(&conn, "الله", 1).unwrap();
    assert_eq!(results.len(), 1);
}

#[test]
fn search_limit_zero() {
    let conn = setup_db();
    let results = search::execute(&conn, "الله", 0).unwrap();
    assert!(results.is_empty());
}

#[test]
fn search_complex_query_and_or_not() {
    let conn = setup_db();
    // (الجنة | الفردوس) + -النار
    let results = search::execute(&conn, "(الجنة | الفردوس) + -النار", 20).unwrap();
    // Results should mention الجنة or الفردوس but NOT النار
    for r in &results {
        let normalized = alfanous_core::normalize::normalize_for_search(&r.text);
        assert!(
            !normalized.contains("النار"),
            "Should not contain النار: {}",
            r.text
        );
    }
}

#[test]
fn search_with_arabic_and_operator() {
    let conn = setup_db();
    // Using و (Arabic AND)
    let results = search::execute(&conn, "الجنة و النار", 10).unwrap();
    assert!(!results.is_empty(), "Arabic AND operator و should work");
}

#[test]
fn search_with_arabic_or_operator() {
    let conn = setup_db();
    let results = search::execute(&conn, "الجنة أو النار", 10).unwrap();
    assert!(!results.is_empty(), "Arabic OR operator أو should work");
}

#[test]
fn search_root_ktb() {
    let conn = setup_db();
    // Root كتب should find كتاب, كتب, مكتوب, etc.
    let results = search::execute(&conn, ">>كتب", 20).unwrap();
    assert!(!results.is_empty(), "Root search >>كتب should return results");
}

#[test]
fn search_root_elm() {
    let conn = setup_db();
    // Root علم should find علم, عالم, عليم, etc.
    let results = search::execute(&conn, ">>علم", 20).unwrap();
    assert!(!results.is_empty(), "Root search >>علم should return results");
}

#[test]
fn search_fatiha_verse_count() {
    let conn = setup_db();
    let results = search::execute(&conn, "سورة:الفاتحة", 10).unwrap();
    assert_eq!(results.len(), 7, "Al-Fatiha should have exactly 7 verses");
    assert_eq!(results[0].aya_id, 1);
    assert_eq!(results[6].aya_id, 7);
}

#[test]
fn search_ikhlas_verse_count() {
    let conn = setup_db();
    let results = search::execute(&conn, "سورة:الإخلاص", 10).unwrap();
    assert_eq!(results.len(), 4, "Al-Ikhlas should have exactly 4 verses");
}

#[test]
fn search_results_have_valid_sura_ids() {
    let conn = setup_db();
    let results = search::execute(&conn, "الله", 50).unwrap();
    for r in &results {
        assert!(r.sura_id >= 1 && r.sura_id <= 114, "sura_id should be 1-114, got {}", r.sura_id);
        assert!(r.aya_id >= 1, "aya_id should be >= 1, got {}", r.aya_id);
    }
}

#[test]
fn search_basmala_in_naml() {
    let conn = setup_db();
    // Al-Naml (27:30) contains بسم الله الرحمن الرحيم inside a verse
    let results = search::execute(&conn, "\"بسم الله الرحمن الرحيم\"", 200).unwrap();
    assert!(
        results.iter().any(|r| r.sura_id == 27),
        "Basmala phrase should appear in Sura Al-Naml (27)"
    );
}
