use alfanous_core::normalize;

#[test]
fn strip_tashkeel_from_vocalized_text() {
    // بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ → بسم الله الرحمن الرحيم
    let input = "\u{0628}\u{0650}\u{0633}\u{0652}\u{0645}\u{0650} \u{0627}\u{0644}\u{0644}\u{0651}\u{0647}\u{0650} \u{0627}\u{0644}\u{0631}\u{0651}\u{064E}\u{062D}\u{0652}\u{0645}\u{064E}\u{0646}\u{0650} \u{0627}\u{0644}\u{0631}\u{0651}\u{064E}\u{062D}\u{0650}\u{064A}\u{0645}\u{0650}";
    assert_eq!(normalize::strip_tashkeel(input), "بسم الله الرحمن الرحيم");
}

#[test]
fn normalize_hamza_variants() {
    // أ إ آ ٱ → ا
    assert_eq!(normalize::normalize_arabic("أحمد"), "احمد");
    assert_eq!(normalize::normalize_arabic("إسلام"), "اسلام");
    assert_eq!(normalize::normalize_arabic("آمن"), "امن");
    assert_eq!(normalize::normalize_arabic("ٱلحمد"), "الحمد");
}

#[test]
fn normalize_taa_marbuta() {
    // ة → ه
    assert_eq!(normalize::normalize_arabic("الصلاة"), "الصلاه");
}

#[test]
fn normalize_alef_maksura() {
    // ى → ي
    assert_eq!(normalize::normalize_arabic("على"), "علي");
    assert_eq!(normalize::normalize_arabic("موسى"), "موسي");
}

#[test]
fn strip_tatweel() {
    // ـ (kashida/tatweel) should be removed
    assert_eq!(normalize::normalize_arabic("الـعـربـيـة"), "العربيه");
}

#[test]
fn strip_definite_article() {
    assert_eq!(normalize::strip_definite_article("الصلاة"), "صلاة");
    assert_eq!(normalize::strip_definite_article("الرحمن"), "رحمن");
    assert_eq!(normalize::strip_definite_article("كتاب"), "كتاب"); // no ال
}

#[test]
fn full_normalization_pipeline() {
    // Full pipeline: strip tashkeel + normalize chars + strip tatweel
    let result = normalize::normalize_for_search("الصَّلاةِ");
    assert_eq!(result, "الصلاه");
}

#[test]
fn normalize_preserves_spaces_and_structure() {
    let result = normalize::normalize_for_search("بِسْمِ اللَّهِ");
    assert_eq!(result, "بسم الله");
}

#[test]
fn empty_and_whitespace_input() {
    assert_eq!(normalize::normalize_for_search(""), "");
    assert_eq!(normalize::normalize_for_search("   "), "");
}

#[test]
fn expand_common_prefixes() {
    // Arabic prefixes: و ف ب ك ل should generate expansion candidates
    let expansions = normalize::expand_prefixes("والصلاة");
    assert!(expansions.contains(&"صلاة".to_string()) || expansions.contains(&"الصلاة".to_string()));
}
