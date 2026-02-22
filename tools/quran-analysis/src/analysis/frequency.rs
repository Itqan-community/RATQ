use std::collections::HashMap;

use crate::core::arabic;
use crate::data::quran::QuranText;

/// Word frequency entry.
#[derive(Debug, Clone)]
pub struct WordFrequency {
    pub word: String,
    pub count: u32,
    pub verse_count: u32,
}

/// Compute word frequencies across the entire Quran text.
pub fn word_frequencies(quran: &QuranText) -> Vec<WordFrequency> {
    let mut counts: HashMap<String, (u32, std::collections::HashSet<(u16, u16)>)> =
        HashMap::new();

    for verse in &quran.verses {
        for word in verse.text.split_whitespace() {
            let normalized = arabic::normalize_arabic(word);
            if normalized.is_empty() {
                continue;
            }
            let entry = counts.entry(normalized).or_insert_with(|| {
                (0, std::collections::HashSet::new())
            });
            entry.0 += 1;
            entry.1.insert((verse.sura, verse.aya));
        }
    }

    let mut result: Vec<WordFrequency> = counts
        .into_iter()
        .map(|(word, (count, verses))| WordFrequency {
            word,
            count,
            verse_count: verses.len() as u32,
        })
        .collect();

    result.sort_by(|a, b| b.count.cmp(&a.count));
    result
}

/// Get the frequency of a specific word.
pub fn get_word_frequency(quran: &QuranText, word: &str) -> Option<WordFrequency> {
    let target = arabic::normalize_arabic(word);
    let mut count: u32 = 0;
    let mut verses: std::collections::HashSet<(u16, u16)> =
        std::collections::HashSet::new();

    for verse in &quran.verses {
        for w in verse.text.split_whitespace() {
            if arabic::normalize_arabic(w) == target {
                count += 1;
                verses.insert((verse.sura, verse.aya));
            }
        }
    }

    if count > 0 {
        Some(WordFrequency {
            word: target,
            count,
            verse_count: verses.len() as u32,
        })
    } else {
        None
    }
}
