/// Check if a character is an Arabic diacritical mark (tashkeel).
fn is_tashkeel(c: char) -> bool {
    matches!(c,
        '\u{0610}'..='\u{061A}' | // Signs spanning above/below
        '\u{064B}'..='\u{065F}' | // Fathatan through wavy hamza below
        '\u{0670}'              | // Superscript alef
        '\u{06D6}'..='\u{06DC}' | // Small high ligature/marks
        '\u{06DF}'..='\u{06E4}' | // Small high/low marks
        '\u{06E7}'..='\u{06E8}' | // Small high yeh/noon
        '\u{06EA}'..='\u{06ED}'   // Small low/high marks
    )
}

/// Strip tashkeel (diacritical marks) from Arabic text.
pub fn strip_tashkeel(text: &str) -> String {
    text.chars().filter(|c| !is_tashkeel(*c)).collect()
}

/// Normalize Arabic text: strip tashkeel, normalize character variants.
///
/// - Strips tashkeel (diacritics)
/// - Normalizes alef variants (أ إ آ ٱ) → ا
/// - Normalizes taa marbuta (ة) → ه
/// - Normalizes alef maksura (ى) → ي
/// - Removes tatweel/kashida (ـ)
pub fn normalize_arabic(text: &str) -> String {
    strip_tashkeel(text)
        .chars()
        .filter(|c| *c != '\u{0640}') // Remove tatweel
        .map(|c| match c {
            '\u{0623}' | '\u{0625}' | '\u{0622}' | '\u{0671}' => '\u{0627}', // أ إ آ ٱ → ا
            '\u{0629}' => '\u{0647}', // ة → ه
            '\u{0649}' => '\u{064A}', // ى → ي
            _ => c,
        })
        .collect()
}

/// Full normalization pipeline for search indexing and query processing.
///
/// Applies normalize_arabic and trims whitespace.
pub fn normalize_for_search(text: &str) -> String {
    let normalized = normalize_arabic(text);
    let trimmed: String = normalized
        .split_whitespace()
        .collect::<Vec<&str>>()
        .join(" ");
    trimmed
}

/// Strip the Arabic definite article (ال) from the beginning of a word.
pub fn strip_definite_article(word: &str) -> String {
    let normalized = word.trim();
    if normalized.starts_with("ال") && normalized.chars().count() > 2 {
        normalized.chars().skip(2).collect()
    } else {
        normalized.to_string()
    }
}

/// Common Arabic prefixes that attach before the definite article or words.
const PREFIXES: &[&str] = &[
    "وال", "فال", "بال", "كال", "لل",
    "و", "ف", "ب", "ك", "ل",
];

/// Expand common Arabic prefixes to generate search candidates.
///
/// Given a prefixed word like "والصلاة", returns the base forms:
/// ["والصلاة", "الصلاة", "صلاة"]
pub fn expand_prefixes(word: &str) -> Vec<String> {
    let mut candidates = vec![word.to_string()];

    for prefix in PREFIXES {
        if word.starts_with(prefix) && word.chars().count() > prefix.chars().count() {
            let remainder: String = word.chars().skip(prefix.chars().count()).collect();
            if !remainder.is_empty() {
                candidates.push(remainder.clone());
                // Also try stripping ال from the remainder
                let without_al = strip_definite_article(&remainder);
                if without_al != remainder {
                    candidates.push(without_al);
                }
            }
        }
    }

    // Also try stripping ال directly
    let without_al = strip_definite_article(word);
    if without_al != word && !candidates.contains(&without_al) {
        candidates.push(without_al);
    }

    candidates
}
