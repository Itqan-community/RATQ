use quran_analysis::analysis::{frequency, stats};
use quran_analysis::data::quran::QuranText;
use quran_analysis::nlp::stopwords::StopWords;
use quran_analysis::qa::answering::{self, QuestionType};
use quran_analysis::search::index::InvertedIndex;

fn sample_quran() -> QuranText {
    let content = "\
1|1|بسم الله الرحمن الرحيم
1|2|الحمد لله رب العالمين
1|3|الرحمن الرحيم
1|4|مالك يوم الدين
1|5|إياك نعبد وإياك نستعين
1|6|اهدنا الصراط المستقيم
1|7|صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين
";
    QuranText::from_str(content).unwrap()
}

// ===== Question Detection Tests =====

#[test]
fn test_detect_arabic_person_question() {
    let qt = answering::detect_question_type("من خلق الإنسان؟");
    assert_eq!(qt, Some(QuestionType::Person));
}

#[test]
fn test_detect_arabic_general_question() {
    let qt = answering::detect_question_type("ما هو الإسلام؟");
    assert_eq!(qt, Some(QuestionType::General));
}

#[test]
fn test_detect_arabic_quantity_question() {
    let qt = answering::detect_question_type("كم عدد السور؟");
    assert_eq!(qt, Some(QuestionType::Quantity));
}

#[test]
fn test_detect_arabic_time_question() {
    let qt = answering::detect_question_type("متى نزل القرآن؟");
    assert_eq!(qt, Some(QuestionType::Time));
}

#[test]
fn test_detect_english_who_question() {
    let qt = answering::detect_question_type("who created man?");
    assert_eq!(qt, Some(QuestionType::Person));
}

#[test]
fn test_detect_english_what_question() {
    let qt = answering::detect_question_type("what is mercy?");
    assert_eq!(qt, Some(QuestionType::General));
}

#[test]
fn test_detect_english_how_many_question() {
    let qt = answering::detect_question_type("how many suras are there?");
    assert_eq!(qt, Some(QuestionType::Quantity));
}

#[test]
fn test_detect_not_a_question() {
    let qt = answering::detect_question_type("الرحمن الرحيم");
    assert_eq!(qt, None);
}

// ===== Content Word Extraction Tests =====

#[test]
fn test_extract_content_words_arabic() {
    let words = answering::extract_content_words("من خلق الإنسان؟", "ar");
    assert!(!words.is_empty());
    assert!(!words.contains(&"من".to_string()));
    assert!(words.iter().any(|w| w.contains("خلق") || w.contains("الانسان")));
}

#[test]
fn test_extract_content_words_english() {
    let words = answering::extract_content_words("who created man?", "en");
    assert!(words.contains(&"created".to_string()));
    assert!(words.contains(&"man".to_string()));
    assert!(!words.contains(&"who".to_string()));
}

// ===== Answer Question Tests =====

#[test]
fn test_answer_question_basic() {
    let quran = sample_quran();
    let sw = StopWords::from_str("");
    let idx = InvertedIndex::build(&quran, &sw);

    let answers = answering::answer_question("من الرحمن؟", &idx, &quran, 3);
    assert!(!answers.is_empty());
    assert_eq!(answers[0].question_type, QuestionType::Person);
}

#[test]
fn test_answer_empty_question() {
    let quran = sample_quran();
    let sw = StopWords::from_str("");
    let idx = InvertedIndex::build(&quran, &sw);

    let answers = answering::answer_question("من", &idx, &quran, 3);
    assert!(answers.is_empty()); // no content words after removing "من"
}

// ===== Frequency Analysis Tests =====

#[test]
fn test_word_frequencies() {
    let quran = sample_quran();
    let freqs = frequency::word_frequencies(&quran);
    assert!(!freqs.is_empty());
    // Most frequent words should be near top
    let top = &freqs[0];
    assert!(top.count > 1);
}

#[test]
fn test_get_word_frequency() {
    let quran = sample_quran();
    let freq = frequency::get_word_frequency(&quran, "الرحيم");
    assert!(freq.is_some());
    let f = freq.unwrap();
    assert_eq!(f.count, 2); // appears in 1:1 and 1:3
    assert_eq!(f.verse_count, 2);
}

#[test]
fn test_get_word_frequency_not_found() {
    let quran = sample_quran();
    let freq = frequency::get_word_frequency(&quran, "nonexistent");
    assert!(freq.is_none());
}

// ===== Corpus Stats Tests =====

#[test]
fn test_corpus_stats() {
    let quran = sample_quran();
    let s = stats::corpus_stats(&quran);
    assert_eq!(s.total_verses, 7);
    assert_eq!(s.total_suras, 1);
    assert!(s.total_words > 20);
    assert!(s.unique_words > 10);
}

#[test]
fn test_corpus_stats_full_quran() {
    let path = std::path::Path::new("data/quran-simple-clean.txt");
    if !path.exists() {
        return;
    }
    let quran = QuranText::from_file(path).unwrap();
    let s = stats::corpus_stats(&quran);
    assert_eq!(s.total_verses, 6236);
    assert_eq!(s.total_suras, 114);
    assert!(s.total_words > 70000);
}

// ===== Full QA Integration Test =====

#[test]
fn test_answer_creation_question_full_quran() {
    let path = std::path::Path::new("data/quran-simple-clean.txt");
    if !path.exists() {
        return;
    }
    let quran = QuranText::from_file(path).unwrap();
    let sw = StopWords::from_str("");
    let idx = InvertedIndex::build(&quran, &sw);

    // "من خلق السماوات" — who created the heavens
    let answers = answering::answer_question(
        "من خلق السماوات",
        &idx,
        &quran,
        3,
    );
    assert!(!answers.is_empty());
    // Should return verses about creation
    assert!(answers[0].score > 0.0);
}
