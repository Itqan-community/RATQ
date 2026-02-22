use crate::core::arabic;
use crate::data::quran::QuranText;
use crate::search::index::InvertedIndex;
use crate::search::scoring::{self, ScoredDocument};

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
        if cleaned.starts_with(pattern) || cleaned.to_lowercase().starts_with(pattern) {
            cleaned = cleaned[pattern.len()..].trim().to_string();
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
/// Returns the top answers ranked by relevance.
pub fn answer_question(
    query: &str,
    index: &InvertedIndex,
    quran: &QuranText,
    limit: usize,
) -> Vec<Answer> {
    let question_type = detect_question_type(query)
        .unwrap_or(QuestionType::General);

    let lang = if arabic::is_arabic(query) { "ar" } else { "en" };
    let content_words = extract_content_words(query, lang);

    if content_words.is_empty() {
        return Vec::new();
    }

    let scored = scoring::score_search(index, &content_words, quran);

    scored
        .into_iter()
        .take(limit)
        .filter_map(|doc: ScoredDocument| {
            quran.get(doc.sura, doc.aya).map(|verse| Answer {
                sura: doc.sura,
                aya: doc.aya,
                text: verse.text.clone(),
                score: doc.score,
                question_type: question_type.clone(),
            })
        })
        .collect()
}
