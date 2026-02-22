use crate::core::arabic;

/// Parse and normalize a search query into individual words.
pub fn parse_query(query: &str, lang: &str) -> Vec<String> {
    let words: Vec<String> = query
        .split_whitespace()
        .map(|w| {
            if lang == "ar" || arabic::is_arabic(w) {
                arabic::normalize_arabic(w)
            } else {
                w.trim_matches(|c: char| !c.is_alphanumeric())
                    .to_lowercase()
            }
        })
        .filter(|w| !w.is_empty())
        .collect();
    words
}
