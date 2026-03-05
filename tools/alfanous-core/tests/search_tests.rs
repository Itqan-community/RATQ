use alfanous_core::db;
use alfanous_core::search::{self, SearchResult};

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
    let results = search::execute(&conn, "الصلاة", 10);
    assert!(!results.is_empty(), "الصلاة should return results");
    // Should find verses about prayer
    assert!(results.iter().any(|r| r.text.contains("الصلاة") || r.text.contains("الصلوة")));
}

#[test]
fn search_another_failing_word() {
    let conn = setup_db();
    let results = search::execute(&conn, "الزكاة", 10);
    assert!(!results.is_empty(), "الزكاة should return results");
}

#[test]
fn search_and_query() {
    let conn = setup_db();
    let results = search::execute(&conn, "الجنة + النار", 10);
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
    let results_or = search::execute(&conn, "الجنة | النار", 100);
    let results_jannah = search::execute(&conn, "الجنة", 100);
    // OR should return results (at least as many as one individual term)
    assert!(!results_or.is_empty());
    assert!(results_or.len() >= results_jannah.len());
}

#[test]
fn search_phrase_query() {
    let conn = setup_db();
    let results = search::execute(&conn, "\"بسم الله الرحمن الرحيم\"", 10);
    assert!(!results.is_empty(), "Basmala phrase should return results");
    // First result should be Al-Fatiha verse 1
    assert_eq!(results[0].sura_id, 1);
    assert_eq!(results[0].aya_id, 1);
}

#[test]
fn search_not_query() {
    let conn = setup_db();
    let results_all = search::execute(&conn, "الله", 50);
    let results_not = search::execute(&conn, "الله + -الرحمن", 50);
    // NOT should return fewer results
    assert!(results_not.len() < results_all.len());
}

#[test]
fn search_returns_structured_results() {
    let conn = setup_db();
    let results = search::execute(&conn, "الحمد", 5);
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
    let results = search::execute(&conn, "الله", 5);
    assert!(results.len() <= 5);
}

#[test]
fn search_empty_query_returns_empty() {
    let conn = setup_db();
    let results = search::execute(&conn, "", 10);
    assert!(results.is_empty());
}

#[test]
fn search_field_sura_name() {
    let conn = setup_db();
    let results = search::execute(&conn, "سورة:البقرة", 300);
    assert!(!results.is_empty());
    for r in &results {
        assert_eq!(r.sura_id, 2, "All results should be from Al-Baqara");
    }
}
