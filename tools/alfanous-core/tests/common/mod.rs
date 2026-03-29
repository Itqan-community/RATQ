/// Shared test data path for the Quran text file.
pub fn quran_path() -> &'static str {
    concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../quran-analysis/data/quran-simple-clean.txt"
    )
}
