use quran_analysis::core::arabic;
use quran_analysis::core::similarity;
use quran_analysis::core::transliteration;

// ===== Arabic Module Tests =====

#[test]
fn test_remove_tashkeel_removes_diacritics() {
    // Arabic fatha (U+064E) should be removed
    let input = "بِسْمِ";
    let result = arabic::remove_tashkeel(input);
    assert!(!result.contains('\u{0650}')); // kasra
    assert!(!result.contains('\u{0652}')); // sukun
}

#[test]
fn test_remove_tashkeel_preserves_base_letters() {
    let input = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
    let result = arabic::remove_tashkeel(input);
    assert!(result.contains('ب'));
    assert!(result.contains('س'));
    assert!(result.contains('م'));
    assert!(result.contains('ا'));
    assert!(result.contains('ل'));
    assert!(result.contains('ه'));
}

#[test]
fn test_remove_tashkeel_plain_text_unchanged() {
    let input = "محمد";
    let result = arabic::remove_tashkeel(input);
    assert_eq!(result, "محمد");
}

#[test]
fn test_remove_tashkeel_empty_string() {
    assert_eq!(arabic::remove_tashkeel(""), "");
}

#[test]
fn test_normalize_arabic_alef_variants() {
    // Alef with hamza above (U+0623) → plain alef (U+0627)
    assert_eq!(arabic::normalize_arabic("أحمد"), "احمد");
    // Alef with hamza below (U+0625) → plain alef
    assert_eq!(arabic::normalize_arabic("إسلام"), "اسلام");
    // Alef madda (U+0622) → plain alef, taa marbuta (ة) → haa (ه)
    assert_eq!(arabic::normalize_arabic("آية"), "ايه");
}

#[test]
fn test_normalize_arabic_taa_marbuta() {
    // Taa marbuta (U+0629) → haa (U+0647)
    assert_eq!(arabic::normalize_arabic("رحمة"), "رحمه");
}

#[test]
fn test_normalize_arabic_alef_maksura() {
    // Alef maksura (U+0649) → yaa (U+064A)
    assert_eq!(arabic::normalize_arabic("على"), "علي");
}

#[test]
fn test_normalize_arabic_combined() {
    // Should normalize alef variants AND remove tashkeel
    let input = "إِلَٰهِ";
    let result = arabic::normalize_arabic(input);
    assert!(result.starts_with('ا')); // إ → ا
    assert!(!result.contains('\u{064E}')); // no fatha
}

#[test]
fn test_normalize_arabic_empty() {
    assert_eq!(arabic::normalize_arabic(""), "");
}

#[test]
fn test_is_arabic_with_arabic_text() {
    assert!(arabic::is_arabic("محمد"));
    assert!(arabic::is_arabic("بسم الله"));
}

#[test]
fn test_is_arabic_with_english_text() {
    assert!(!arabic::is_arabic("hello"));
    assert!(!arabic::is_arabic("Muhammad"));
}

#[test]
fn test_is_arabic_with_mixed_text() {
    // Mixed text with Arabic chars should return true
    assert!(arabic::is_arabic("hello محمد"));
}

#[test]
fn test_is_arabic_empty() {
    assert!(!arabic::is_arabic(""));
}

#[test]
fn test_clean_and_trim() {
    assert_eq!(arabic::clean_and_trim("  محمد  "), "محمد");
    assert_eq!(arabic::clean_and_trim("hello!"), "hello");
    assert_eq!(arabic::clean_and_trim("  test  "), "test");
}

#[test]
fn test_clean_and_trim_preserves_arabic() {
    assert_eq!(arabic::clean_and_trim("بسم الله"), "بسم الله");
}

// ===== Similarity Module Tests =====

#[test]
fn test_levenshtein_identical_strings() {
    assert_eq!(similarity::levenshtein_distance("كتاب", "كتاب"), 0);
    assert_eq!(similarity::levenshtein_distance("book", "book"), 0);
}

#[test]
fn test_levenshtein_empty_strings() {
    assert_eq!(similarity::levenshtein_distance("", ""), 0);
    assert_eq!(similarity::levenshtein_distance("abc", ""), 3);
    assert_eq!(similarity::levenshtein_distance("", "abc"), 3);
}

#[test]
fn test_levenshtein_single_edit() {
    assert_eq!(similarity::levenshtein_distance("كتاب", "كتب"), 1);
    assert_eq!(similarity::levenshtein_distance("cat", "bat"), 1);
}

#[test]
fn test_levenshtein_multiple_edits() {
    assert_eq!(similarity::levenshtein_distance("kitten", "sitting"), 3);
}

#[test]
fn test_levenshtein_arabic_multibyte() {
    // Should count character edits, not byte edits
    let d = similarity::levenshtein_distance("محمد", "أحمد");
    assert_eq!(d, 1); // one character substitution
}

#[test]
fn test_common_unique_chars_identical() {
    let count = similarity::common_unique_chars("كتاب", "كتاب");
    assert_eq!(count, 4); // ك ت ا ب
}

#[test]
fn test_common_unique_chars_partial_overlap() {
    let count = similarity::common_unique_chars("كتاب", "كتب");
    assert_eq!(count, 3); // ك ت ب (ا not in second)
}

#[test]
fn test_common_unique_chars_no_overlap() {
    let count = similarity::common_unique_chars("abc", "xyz");
    assert_eq!(count, 0);
}

#[test]
fn test_common_unique_chars_empty() {
    assert_eq!(similarity::common_unique_chars("", "abc"), 0);
    assert_eq!(similarity::common_unique_chars("abc", ""), 0);
}

// ===== Transliteration Module Tests =====

#[test]
fn test_buckwalter_to_arabic_basic() {
    // b = ب, s = س, m = م
    let result = transliteration::buckwalter_to_arabic("bsm");
    assert_eq!(result, "بسم");
}

#[test]
fn test_buckwalter_to_arabic_alef_variants() {
    // A = ا, < = إ, > = أ, | = آ
    assert_eq!(transliteration::buckwalter_to_arabic("A"), "ا");
    assert_eq!(transliteration::buckwalter_to_arabic("<"), "إ");
    assert_eq!(transliteration::buckwalter_to_arabic(">"), "أ");
    assert_eq!(transliteration::buckwalter_to_arabic("|"), "آ");
}

#[test]
fn test_buckwalter_to_arabic_special_chars() {
    // $ = ش, * = ذ, v = ث, x = خ
    assert_eq!(transliteration::buckwalter_to_arabic("$"), "ش");
    assert_eq!(transliteration::buckwalter_to_arabic("*"), "ذ");
    assert_eq!(transliteration::buckwalter_to_arabic("v"), "ث");
    assert_eq!(transliteration::buckwalter_to_arabic("x"), "خ");
}

#[test]
fn test_buckwalter_to_arabic_diacritics() {
    // a = fatha, i = kasra, u = damma, ~ = shadda, o = sukun
    assert_eq!(transliteration::buckwalter_to_arabic("a"), "\u{064E}");
    assert_eq!(transliteration::buckwalter_to_arabic("i"), "\u{0650}");
    assert_eq!(transliteration::buckwalter_to_arabic("u"), "\u{064F}");
    assert_eq!(transliteration::buckwalter_to_arabic("~"), "\u{0651}");
    assert_eq!(transliteration::buckwalter_to_arabic("o"), "\u{0652}");
}

#[test]
fn test_arabic_to_buckwalter_basic() {
    assert_eq!(transliteration::arabic_to_buckwalter("بسم"), "bsm");
}

#[test]
fn test_arabic_to_buckwalter_roundtrip() {
    let original = "bsm Allh AlrHmn AlrHym";
    let arabic = transliteration::buckwalter_to_arabic(original);
    let back = transliteration::arabic_to_buckwalter(&arabic);
    assert_eq!(back, original);
}

#[test]
fn test_buckwalter_empty_string() {
    assert_eq!(transliteration::buckwalter_to_arabic(""), "");
    assert_eq!(transliteration::arabic_to_buckwalter(""), "");
}

#[test]
fn test_buckwalter_preserves_spaces() {
    let result = transliteration::buckwalter_to_arabic("bsm Allh");
    assert!(result.contains(' '));
}
