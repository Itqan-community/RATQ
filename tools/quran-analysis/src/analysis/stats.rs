use crate::data::quran::QuranText;

/// Statistics about the Quran corpus.
#[derive(Debug)]
pub struct CorpusStats {
    pub total_verses: usize,
    pub total_suras: u16,
    pub total_words: usize,
    pub total_chars: usize,
    pub unique_words: usize,
}

/// Compute corpus statistics.
pub fn corpus_stats(quran: &QuranText) -> CorpusStats {
    let mut total_words = 0;
    let mut total_chars = 0;
    let mut max_sura: u16 = 0;
    let mut unique_words = std::collections::HashSet::new();

    for verse in quran.verses() {
        let words: Vec<&str> = verse.text.split_whitespace().collect();
        total_words += words.len();
        total_chars += verse.text.chars().count();
        if verse.sura > max_sura {
            max_sura = verse.sura;
        }
        for w in words {
            unique_words.insert(
                crate::core::arabic::normalize_arabic(w),
            );
        }
    }

    CorpusStats {
        total_verses: quran.len(),
        total_suras: max_sura,
        total_words,
        total_chars,
        unique_words: unique_words.len(),
    }
}
