use crate::core::arabic;
use crate::data::qac::QacMorphology;
use crate::data::quran::QuranText;
use crate::search::index::InvertedIndex;
use crate::search::{query, scoring};
use crate::search::scoring::{ScoredDocument, WeightedTerm};

/// Detected question type.
#[derive(Debug, Clone, PartialEq)]
pub enum QuestionType {
    Person,
    General,
    Quantity,
    Time,
}

/// An answer to a question with supporting verse.
#[derive(Debug)]
pub struct Answer {
    pub sura: u16,
    pub aya: u16,
    pub text: String,
    pub score: f64,
    pub question_type: QuestionType,
}

/// Arabic question word patterns.
const AR_QUESTION_PATTERNS: &[(&str, QuestionType)] = &[
    ("من هو", QuestionType::Person),
    ("من هي", QuestionType::Person),
    ("من هم", QuestionType::Person),
    ("من", QuestionType::Person),
    ("ما هو", QuestionType::General),
    ("ما هي", QuestionType::General),
    ("ماذا", QuestionType::General),
    ("ما", QuestionType::General),
    ("كم", QuestionType::Quantity),
    ("متى", QuestionType::Time),
    ("أين", QuestionType::General),
    ("كيف", QuestionType::General),
    ("لماذا", QuestionType::General),
    ("هل", QuestionType::General),
];

/// English question word patterns.
const EN_QUESTION_PATTERNS: &[(&str, QuestionType)] = &[
    ("who", QuestionType::Person),
    ("whom", QuestionType::Person),
    ("what", QuestionType::General),
    ("which", QuestionType::General),
    ("how many", QuestionType::Quantity),
    ("how much", QuestionType::Quantity),
    ("how long", QuestionType::Time),
    ("when", QuestionType::Time),
    ("where", QuestionType::General),
    ("how", QuestionType::General),
    ("why", QuestionType::General),
    ("does", QuestionType::General),
    ("is", QuestionType::General),
];

/// Detect the question type from a query string.
pub fn detect_question_type(query: &str) -> Option<QuestionType> {
    let query_lower = query.to_lowercase();
    let query_trimmed = query.trim();

    // Check Arabic patterns first
    if arabic::is_arabic(query) {
        for (pattern, qtype) in AR_QUESTION_PATTERNS {
            if query_trimmed.starts_with(pattern) {
                return Some(qtype.clone());
            }
        }
    }

    // Check English patterns
    for (pattern, qtype) in EN_QUESTION_PATTERNS {
        if query_lower.starts_with(pattern) {
            return Some(qtype.clone());
        }
    }

    None
}

/// Remove question clue words from the query, returning content words.
pub fn extract_content_words(query: &str, lang: &str) -> Vec<String> {
    let patterns: &[(&str, QuestionType)] = if lang == "ar" || arabic::is_arabic(query) {
        AR_QUESTION_PATTERNS
    } else {
        EN_QUESTION_PATTERNS
    };

    let mut cleaned = query.to_string();
    for (pattern, _) in patterns {
        if cleaned.starts_with(pattern) {
            cleaned = cleaned[pattern.len()..].trim().to_string();
            break;
        }
        let lower = cleaned.to_lowercase();
        if lower.starts_with(pattern) {
            // Use char count to safely skip the matched prefix,
            // since to_lowercase() may change byte length
            let char_count = pattern.chars().count();
            let byte_offset = cleaned
                .char_indices()
                .nth(char_count)
                .map(|(i, _)| i)
                .unwrap_or(cleaned.len());
            cleaned = cleaned[byte_offset..].trim().to_string();
            break;
        }
    }

    // Remove question marks
    cleaned = cleaned.replace('?', "").replace('؟', "");

    cleaned
        .split_whitespace()
        .map(|w| {
            if arabic::is_arabic(w) {
                arabic::normalize_arabic(w)
            } else {
                w.to_lowercase()
            }
        })
        .filter(|w| !w.is_empty())
        .collect()
}

/// Answer a question by searching for relevant verses and scoring them.
///
/// Returns the top answers ranked by relevance. If QAC morphology data
/// is provided, Arabic queries are expanded via root derivations.
pub fn answer_question(
    q: &str,
    index: &InvertedIndex,
    quran: &QuranText,
    limit: usize,
) -> Vec<Answer> {
    answer_question_with_qac(q, index, quran, limit, None)
}

/// Answer a question with optional QAC root expansion.
pub fn answer_question_with_qac(
    q: &str,
    index: &InvertedIndex,
    quran: &QuranText,
    limit: usize,
    qac: Option<&QacMorphology>,
) -> Vec<Answer> {
    let question_type = detect_question_type(q)
        .unwrap_or(QuestionType::General);

    let lang = if arabic::is_arabic(q) { "ar" } else { "en" };
    let content_words = extract_content_words(q, lang);

    if content_words.is_empty() {
        return Vec::new();
    }

    let weighted_terms: Vec<WeightedTerm> = if lang == "ar" {
        if let Some(qac_data) = qac {
            let expanded = query::expand_by_roots(&content_words, qac_data);
            expanded
                .into_iter()
                .enumerate()
                .map(|(i, w)| WeightedTerm {
                    weight: if i < content_words.len() { 1.0 } else { 0.7 },
                    word: w,
                })
                .collect()
        } else {
            content_words
                .into_iter()
                .map(|w| WeightedTerm { word: w, weight: 1.0 })
                .collect()
        }
    } else {
        content_words
            .into_iter()
            .map(|w| WeightedTerm { word: w, weight: 1.0 })
            .collect()
    };

    let scored = scoring::score_search_weighted(index, &weighted_terms, quran);

    scored
        .into_iter()
        .filter_map(|doc: ScoredDocument| {
            quran.get(doc.sura, doc.aya).map(|verse| Answer {
                sura: doc.sura,
                aya: doc.aya,
                text: verse.text.clone(),
                score: doc.score,
                question_type: question_type.clone(),
            })
        })
        .take(limit)
        .collect()
}
