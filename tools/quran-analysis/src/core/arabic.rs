/// Remove tashkeel (diacritical marks) from Arabic text.
///
/// Removes: fatha, kasra, damma, sukun, shadda, tanwin,
/// superscript alef, and other combining marks.
pub fn remove_tashkeel(text: &str) -> String {
    text.chars()
        .filter(|c| !is_tashkeel(*c))
        .collect()
}

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

/// Normalize Arabic text for comparison.
///
/// - Removes tashkeel
/// - Normalizes alef variants (أ إ آ ٱ) → ا
/// - Normalizes taa marbuta (ة) → ه
/// - Normalizes alef maksura (ى) → ي
pub fn normalize_arabic(text: &str) -> String {
    remove_tashkeel(text)
        .chars()
        .map(|c| match c {
            '\u{0623}' | '\u{0625}' | '\u{0622}' | '\u{0671}' => '\u{0627}', // أ إ آ ٱ → ا
            '\u{0629}' => '\u{0647}', // ة → ه
            '\u{0649}' => '\u{064A}', // ى → ي
            _ => c,
        })
        .collect()
}

/// Check if text contains Arabic characters (U+0600..U+06FF range).
pub fn is_arabic(text: &str) -> bool {
    text.chars().any(|c| ('\u{0600}'..='\u{06FF}').contains(&c))
}

/// Remove non-alphanumeric characters (keeping Arabic/English letters,
/// digits, and spaces) and trim whitespace.
///
/// Also removes Arabic comma (\u{060C}), semicolon (\u{061B}),
/// and question mark (\u{061F}).
pub fn clean_and_trim(text: &str) -> String {
    let cleaned: String = text
        .chars()
        .filter(|c| {
            if *c == '\u{060C}' || *c == '\u{061B}' || *c == '\u{061F}' {
                return false; // Arabic comma ،, semicolon ؛, question mark ؟
            }
            c.is_alphanumeric()
                || *c == ' '
                || ('\u{0600}'..='\u{06FF}').contains(c)
        })
        .collect();
    cleaned.trim().to_string()
}
