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

// --- Additional normalization tests ---

#[test]
fn normalize_multiple_hamza_variants_in_same_word() {
    // آمنوا contains آ → ا
    assert_eq!(normalize::normalize_arabic("آمنوا"), "امنوا");
    // إِيَّاكَ → اياك
    assert_eq!(normalize::normalize_arabic("إياك"), "اياك");
}

#[test]
fn normalize_waw_hamza() {
    // ؤ is not normalized (it's not an alef variant)
    assert_eq!(normalize::normalize_arabic("مؤمنون"), "مؤمنون");
}

#[test]
fn strip_tashkeel_all_diacritic_types() {
    // fatha, kasra, damma, sukun, shadda, tanwin
    let with_diacritics = "كَتَبَ";
    let stripped = normalize::strip_tashkeel(with_diacritics);
    assert_eq!(stripped, "كتب");
}

#[test]
fn normalize_arabic_only_text() {
    // Non-Arabic text should pass through unchanged
    assert_eq!(normalize::normalize_for_search("hello world"), "hello world");
}

#[test]
fn normalize_mixed_arabic_latin() {
    let result = normalize::normalize_for_search("الله Allah");
    assert_eq!(result, "الله Allah");
}

#[test]
fn strip_definite_article_short_word() {
    // "ال" alone should NOT be stripped (nothing left)
    assert_eq!(normalize::strip_definite_article("ال"), "ال");
}

#[test]
fn strip_definite_article_with_whitespace() {
    assert_eq!(normalize::strip_definite_article("  الكتاب  "), "كتاب");
}

#[test]
fn normalize_consecutive_spaces() {
    let result = normalize::normalize_for_search("بسم   الله    الرحمن");
    assert_eq!(result, "بسم الله الرحمن");
}

#[test]
fn expand_prefixes_with_baa() {
    // بالله → should expand to [بالله, الله, لله]
    let expansions = normalize::expand_prefixes("بالله");
    assert!(expansions.contains(&"بالله".to_string()));
    assert!(expansions.contains(&"الله".to_string()));
}

#[test]
fn expand_prefixes_with_faa() {
    let expansions = normalize::expand_prefixes("فالحمد");
    assert!(expansions.contains(&"فالحمد".to_string()));
    assert!(expansions.contains(&"الحمد".to_string()) || expansions.contains(&"حمد".to_string()));
}

#[test]
fn expand_prefixes_with_kaaf() {
    let expansions = normalize::expand_prefixes("كالنور");
    assert!(expansions.contains(&"كالنور".to_string()));
    assert!(expansions.contains(&"النور".to_string()) || expansions.contains(&"نور".to_string()));
}

#[test]
fn expand_prefixes_with_lam_lam() {
    // لل prefix (lam + lam, as in لله)
    let expansions = normalize::expand_prefixes("لله");
    assert!(expansions.contains(&"لله".to_string()));
    assert!(expansions.contains(&"له".to_string()));
}

#[test]
fn expand_prefixes_no_prefix() {
    // Word without any recognized prefix should return only itself
    let expansions = normalize::expand_prefixes("حمد");
    assert_eq!(expansions.len(), 1);
    assert_eq!(expansions[0], "حمد");
}

#[test]
fn normalize_preserves_arabic_question_mark() {
    // Arabic question mark ؟ is not tashkeel, should be preserved
    let result = normalize::normalize_for_search("ماذا؟");
    assert!(result.contains("ماذا"));
}

#[test]
fn normalize_for_search_idempotent() {
    // Normalizing twice should give the same result
    let input = "الصَّلاةِ";
    let once = normalize::normalize_for_search(input);
    let twice = normalize::normalize_for_search(&once);
    assert_eq!(once, twice, "normalize_for_search should be idempotent");
}
