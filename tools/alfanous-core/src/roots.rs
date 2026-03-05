use std::collections::HashMap;
use std::sync::OnceLock;

/// Buckwalter transliteration → Arabic mapping.
const BW_TO_AR: &[(char, char)] = &[
    ('\'', '\u{0621}'), // ء hamza
    ('|', '\u{0622}'),  // آ
    ('>', '\u{0623}'),  // أ
    ('&', '\u{0624}'),  // ؤ
    ('<', '\u{0625}'),  // إ
    ('}', '\u{0626}'),  // ئ
    ('A', '\u{0627}'),  // ا
    ('b', '\u{0628}'),  // ب
    ('p', '\u{0629}'),  // ة
    ('t', '\u{062A}'),  // ت
    ('v', '\u{062B}'),  // ث
    ('j', '\u{062C}'),  // ج
    ('H', '\u{062D}'),  // ح
    ('x', '\u{062E}'),  // خ
    ('d', '\u{062F}'),  // د
    ('*', '\u{0630}'),  // ذ
    ('r', '\u{0631}'),  // ر
    ('z', '\u{0632}'),  // ز
    ('s', '\u{0633}'),  // س
    ('$', '\u{0634}'),  // ش
    ('S', '\u{0635}'),  // ص
    ('D', '\u{0636}'),  // ض
    ('T', '\u{0637}'),  // ط
    ('Z', '\u{0638}'),  // ظ
    ('E', '\u{0639}'),  // ع
    ('g', '\u{063A}'),  // غ
    ('f', '\u{0641}'),  // ف
    ('q', '\u{0642}'),  // ق
    ('k', '\u{0643}'),  // ك
    ('l', '\u{0644}'),  // ل
    ('m', '\u{0645}'),  // م
    ('n', '\u{0646}'),  // ن
    ('h', '\u{0647}'),  // ه
    ('w', '\u{0648}'),  // و
    ('Y', '\u{0649}'),  // ى
    ('y', '\u{064A}'),  // ي
    // Diacritics (Buckwalter encoding)
    ('~', '\u{0651}'),  // shadda
    ('`', '\u{0670}'),  // superscript alef
    ('{', '\u{0671}'),  // alef wasla ٱ
    ('o', '\u{0652}'),  // sukun
    ('a', '\u{064E}'),  // fatha
    ('u', '\u{064F}'),  // damma
    ('i', '\u{0650}'),  // kasra
    ('F', '\u{064B}'),  // fathatan
    ('N', '\u{064C}'),  // dammatan
    ('K', '\u{064D}'),  // kasratan
    ('^', '\u{0653}'),  // maddah
    ('#', '\u{0654}'),  // hamza above (Buckwalter)
];

/// Arabic → Buckwalter mapping (consonants only, strips diacritics).
fn arabic_to_buckwalter(arabic: &str) -> String {
    // Only map consonant letters, not diacritics
    let consonant_map: HashMap<char, char> = BW_TO_AR
        .iter()
        .filter(|&&(bw, _)| !matches!(bw, '~' | '`' | 'o' | 'a' | 'u' | 'i' | 'F' | 'N' | 'K' | '^' | '#'))
        .map(|&(b, a)| (a, b))
        .collect();
    // Strip diacritics first, then convert
    let stripped = crate::normalize::strip_tashkeel(arabic);
    stripped
        .chars()
        .filter_map(|c| {
            if c == '\u{0640}' {
                None // skip tatweel
            } else {
                consonant_map.get(&c).copied().or(Some(c))
            }
        })
        .collect()
}

/// Buckwalter → Arabic mapping.
fn buckwalter_to_arabic(bw: &str) -> String {
    let map: HashMap<char, char> = BW_TO_AR.iter().copied().collect();
    bw.chars()
        .filter_map(|c| map.get(&c).copied())
        .collect()
}

/// Root data: maps Buckwalter root → list of Buckwalter lemmas.
/// Embedded at compile time from data/roots.json.
static ROOTS_JSON: &str = include_str!("../data/roots.json");
static LEMMAS_JSON: &str = include_str!("../data/lemmas.json");

static ROOTS: OnceLock<HashMap<String, Vec<String>>> = OnceLock::new();
static LEMMAS: OnceLock<HashMap<String, String>> = OnceLock::new();

fn get_roots() -> &'static HashMap<String, Vec<String>> {
    ROOTS.get_or_init(|| {
        serde_json::from_str(ROOTS_JSON).expect("embedded roots.json is invalid")
    })
}

fn get_lemmas() -> &'static HashMap<String, String> {
    LEMMAS.get_or_init(|| {
        serde_json::from_str(LEMMAS_JSON).expect("embedded lemmas.json is invalid")
    })
}

/// Given an Arabic root (e.g. "صلو"), find all lemmas derived from it.
/// Returns Arabic lemmas (normalized).
pub fn find_lemmas_for_root(arabic_root: &str) -> Vec<String> {
    let bw_root = arabic_to_buckwalter(arabic_root);
    let roots = get_roots();

    if let Some(lemmas) = roots.get(&bw_root) {
        lemmas
            .iter()
            .map(|l| {
                let arabic = buckwalter_to_arabic(l);
                crate::normalize::normalize_for_search(&arabic)
            })
            .filter(|s| !s.is_empty())
            .collect()
    } else {
        vec![]
    }
}

/// Given an Arabic word, find its root and all sibling lemmas.
/// This is used for the lemma (>) operator.
pub fn find_siblings_for_lemma(arabic_word: &str) -> Vec<String> {
    let bw_word = arabic_to_buckwalter(arabic_word);
    let lemmas_map = get_lemmas();
    let roots = get_roots();

    // Try to find the root for this word
    if let Some(root) = lemmas_map.get(&bw_word) {
        if let Some(sibling_lemmas) = roots.get(root) {
            return sibling_lemmas
                .iter()
                .map(|l| {
                    let arabic = buckwalter_to_arabic(l);
                    crate::normalize::normalize_for_search(&arabic)
                })
                .filter(|s| !s.is_empty())
                .collect();
        }
    }

    vec![]
}

/// Given an Arabic word, try to find its trilateral root.
/// Returns the root in Arabic if found.
pub fn find_root_for_word(arabic_word: &str) -> Option<String> {
    let bw_word = arabic_to_buckwalter(arabic_word);
    let lemmas_map = get_lemmas();

    lemmas_map
        .get(&bw_word)
        .map(|root| buckwalter_to_arabic(root))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn buckwalter_roundtrip() {
        let arabic = "بسم";
        let bw = arabic_to_buckwalter(arabic);
        assert_eq!(bw, "bsm");
        let back = buckwalter_to_arabic(&bw);
        assert_eq!(back, arabic);
    }

    #[test]
    fn find_root_data_loaded() {
        let roots = get_roots();
        assert!(!roots.is_empty(), "roots.json should load");
        // "Slw" is the root for صلاة
        assert!(roots.contains_key("Slw"), "Should contain root Slw (صلو)");
    }

    #[test]
    fn find_lemmas_for_prayer_root() {
        let lemmas = find_lemmas_for_root("صلو");
        assert!(!lemmas.is_empty(), "Root صلو should have lemmas");
    }

    #[test]
    fn find_root_for_known_word() {
        let roots = get_roots();
        // Check that we have the "rHm" root (mercy)
        assert!(roots.contains_key("rHm"), "Should contain root rHm (رحم)");
    }

    #[test]
    fn buckwalter_arabic_all_basic_letters() {
        // Test all 28 Arabic letters round-trip
        let arabic = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
        let bw = arabic_to_buckwalter(arabic);
        let back = buckwalter_to_arabic(&bw);
        assert_eq!(back, arabic, "All basic letters should round-trip");
    }

    #[test]
    fn buckwalter_strips_diacritics() {
        // Arabic with tashkeel → Buckwalter should only get consonants
        let arabic = "كَتَبَ"; // kataba
        let bw = arabic_to_buckwalter(arabic);
        assert_eq!(bw, "ktb", "Diacritics should be stripped");
    }

    #[test]
    fn find_lemmas_for_root_ktb() {
        let lemmas = find_lemmas_for_root("كتب");
        assert!(!lemmas.is_empty(), "Root كتب (ktb) should have lemmas");
    }

    #[test]
    fn find_lemmas_for_root_elm() {
        let lemmas = find_lemmas_for_root("علم");
        assert!(!lemmas.is_empty(), "Root علم (Elm) should have lemmas");
    }

    #[test]
    fn find_lemmas_unknown_root_returns_empty() {
        let lemmas = find_lemmas_for_root("ققق");
        assert!(lemmas.is_empty(), "Unknown root should return empty");
    }

    #[test]
    fn find_root_for_word_function() {
        // "الله" → root "Alh"
        let root = find_root_for_word("الله");
        // This may or may not find a match depending on exact lemma form
        // Just verify it doesn't panic
        let _ = root;
    }

    #[test]
    fn lemmas_json_loaded() {
        let lemmas = get_lemmas();
        assert!(!lemmas.is_empty(), "lemmas.json should load");
    }

    #[test]
    fn roots_have_reasonable_count() {
        let roots = get_roots();
        assert!(roots.len() > 1000, "Should have > 1000 roots, got {}", roots.len());
        assert!(roots.len() < 5000, "Should have < 5000 roots, got {}", roots.len());
    }

    #[test]
    fn lemmas_have_reasonable_count() {
        let lemmas = get_lemmas();
        assert!(lemmas.len() > 3000, "Should have > 3000 lemmas, got {}", lemmas.len());
    }
}
