use alfanous_core::db;

fn quran_path() -> &'static str {
    concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../quran-analysis/data/quran-simple-clean.txt"
    )
}

#[test]
fn create_in_memory_loads_all_verses() {
    let conn = db::create_in_memory(quran_path()).expect("Failed to create DB");
    let count: i64 = conn
        .query_row("SELECT COUNT(*) FROM aya", [], |row| row.get(0))
        .unwrap();
    assert_eq!(count, 6236, "Quran should have 6236 verses");
}

#[test]
fn fts_index_matches_via_search() {
    let conn = db::create_in_memory(quran_path()).expect("Failed to create DB");
    // Verify FTS index works by doing a MATCH query
    let count: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM aya a JOIN aya_fts f ON a.gid = f.rowid WHERE aya_fts MATCH '\"الله\"'",
            [],
            |row| row.get(0),
        )
        .unwrap();
    assert!(count > 0, "FTS MATCH should find verses containing الله");
}

#[test]
fn sura_names_correct_for_fatiha() {
    let conn = db::create_in_memory(quran_path()).expect("Failed to create DB");
    let name: String = conn
        .query_row(
            "SELECT sura_name FROM aya WHERE sura_id = 1 LIMIT 1",
            [],
            |row| row.get(0),
        )
        .unwrap();
    assert_eq!(name, "الفاتحة");
}

#[test]
fn sura_names_correct_for_baqara() {
    let conn = db::create_in_memory(quran_path()).expect("Failed to create DB");
    let name: String = conn
        .query_row(
            "SELECT sura_name FROM aya WHERE sura_id = 2 LIMIT 1",
            [],
            |row| row.get(0),
        )
        .unwrap();
    assert_eq!(name, "البقرة");
}

#[test]
fn sura_names_correct_for_naas() {
    let conn = db::create_in_memory(quran_path()).expect("Failed to create DB");
    let name: String = conn
        .query_row(
            "SELECT sura_name FROM aya WHERE sura_id = 114 LIMIT 1",
            [],
            |row| row.get(0),
        )
        .unwrap();
    assert_eq!(name, "الناس");
}

#[test]
fn all_114_suras_present() {
    let conn = db::create_in_memory(quran_path()).expect("Failed to create DB");
    let sura_count: i64 = conn
        .query_row(
            "SELECT COUNT(DISTINCT sura_id) FROM aya",
            [],
            |row| row.get(0),
        )
        .unwrap();
    assert_eq!(sura_count, 114, "All 114 suras should be present");
}

#[test]
fn gid_is_sequential() {
    let conn = db::create_in_memory(quran_path()).expect("Failed to create DB");
    let max_gid: i64 = conn
        .query_row("SELECT MAX(gid) FROM aya", [], |row| row.get(0))
        .unwrap();
    let count: i64 = conn
        .query_row("SELECT COUNT(*) FROM aya", [], |row| row.get(0))
        .unwrap();
    assert_eq!(max_gid, count, "gid should be sequential 1..N");
}

#[test]
fn fts_search_finds_normalized_terms() {
    let conn = db::create_in_memory(quran_path()).expect("Failed to create DB");
    // The FTS index stores normalized text, so searching for normalized forms should work
    // الصلاه (normalized form of الصلاة) should be findable
    let count: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM aya_fts WHERE aya_fts MATCH '\"الصلاه\"'",
            [],
            |row| row.get(0),
        )
        .unwrap();
    assert!(count > 0, "FTS should find normalized الصلاه (from الصلاة)");
}

#[test]
fn sura_name_function_boundary() {
    assert_eq!(db::sura_name(0), "");
    assert_eq!(db::sura_name(1), "الفاتحة");
    assert_eq!(db::sura_name(114), "الناس");
    assert_eq!(db::sura_name(115), "");
    assert_eq!(db::sura_name(999), "");
}

#[test]
fn create_from_file_works() {
    let dir = tempfile::tempdir().expect("Failed to create temp dir");
    let db_path = dir.path().join("test.db");
    let conn = db::create_from_file(
        quran_path(),
        db_path.to_str().unwrap(),
    )
    .expect("Failed to create file DB");

    let count: i64 = conn
        .query_row("SELECT COUNT(*) FROM aya", [], |row| row.get(0))
        .unwrap();
    assert_eq!(count, 6236);
}

#[test]
fn create_in_memory_invalid_path_returns_error() {
    let result = db::create_in_memory("/nonexistent/path/quran.txt");
    assert!(result.is_err());
}
