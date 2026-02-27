use std::collections::HashMap;
use std::sync::LazyLock;

/// Buckwalter-to-Arabic mapping table.
static BW_TO_AR: LazyLock<HashMap<char, char>> = LazyLock::new(|| {
    let pairs: &[(char, char)] = &[
        ('\'', '\u{0621}'), // hamza ء
        ('|', '\u{0622}'),  // alef madda آ
        ('>', '\u{0623}'),  // alef hamza above أ
        ('&', '\u{0624}'),  // waw hamza ؤ
        ('<', '\u{0625}'),  // alef hamza below إ
        ('}', '\u{0626}'),  // yaa hamza ئ
        ('A', '\u{0627}'),  // alef ا
        ('b', '\u{0628}'),  // baa ب
        ('p', '\u{0629}'),  // taa marbuta ة
        ('t', '\u{062A}'),  // taa ت
        ('v', '\u{062B}'),  // thaa ث
        ('j', '\u{062C}'),  // jeem ج
        ('H', '\u{062D}'),  // haa ح
        ('x', '\u{062E}'),  // khaa خ
        ('d', '\u{062F}'),  // dal د
        ('*', '\u{0630}'),  // thal ذ
        ('r', '\u{0631}'),  // raa ر
        ('z', '\u{0632}'),  // zayn ز
        ('s', '\u{0633}'),  // seen س
        ('$', '\u{0634}'),  // sheen ش
        ('S', '\u{0635}'),  // sad ص
        ('D', '\u{0636}'),  // dad ض
        ('T', '\u{0637}'),  // taa ط
        ('Z', '\u{0638}'),  // zaa ظ
        ('E', '\u{0639}'),  // ain ع
        ('g', '\u{063A}'),  // ghain غ
        ('_', '\u{0640}'),  // tatweel ـ
        ('f', '\u{0641}'),  // faa ف
        ('q', '\u{0642}'),  // qaf ق
        ('k', '\u{0643}'),  // kaf ك
        ('l', '\u{0644}'),  // lam ل
        ('m', '\u{0645}'),  // meem م
        ('n', '\u{0646}'),  // noon ن
        ('h', '\u{0647}'),  // haa ه
        ('w', '\u{0648}'),  // waw و
        ('Y', '\u{0649}'),  // alef maksura ى
        ('y', '\u{064A}'),  // yaa ي
        ('F', '\u{064B}'),  // fathatan
        ('N', '\u{064C}'),  // dammatan
        ('K', '\u{064D}'),  // kasratan
        ('a', '\u{064E}'),  // fatha
        ('u', '\u{064F}'),  // damma
        ('i', '\u{0650}'),  // kasra
        ('~', '\u{0651}'),  // shadda
        ('o', '\u{0652}'),  // sukun
        ('`', '\u{0670}'),  // superscript alef
        ('{', '\u{0671}'),  // alef wasla ٱ
    ];
    pairs.iter().copied().collect()
});

/// Arabic-to-Buckwalter reverse mapping table.
static AR_TO_BW: LazyLock<HashMap<char, char>> = LazyLock::new(|| {
    BW_TO_AR.iter().map(|(&bw, &ar)| (ar, bw)).collect()
});

/// Convert Buckwalter transliteration to Arabic script.
///
/// Handles the two-character sequence `a`` (fatha + superscript alef) which
/// the QAC corpus uses to encode the long vowel ā in certain word forms (e.g.
/// active participles such as `ja`vimiyna` = جاثمين).  Both characters are
/// diacritics that would otherwise be stripped by `normalize_arabic`, causing
/// a mismatch with the Quran text (which writes the same long alef as the
/// letter ا).  Converting `a`` directly to ا preserves the vowel length and
/// keeps the resulting form consistent with the inverted index.
pub fn buckwalter_to_arabic(text: &str) -> String {
    let chars: Vec<char> = text.chars().collect();
    let mut result = String::new();
    let mut i = 0;
    while i < chars.len() {
        let c = chars[i];
        if c == 'a' && i + 1 < chars.len() && chars[i + 1] == '`' {
            // fatha + superscript alef → long alef ا
            result.push('\u{0627}');
            i += 2;
        } else {
            result.push(BW_TO_AR.get(&c).copied().unwrap_or(c));
            i += 1;
        }
    }
    result
}

/// Convert Arabic script to Buckwalter transliteration.
pub fn arabic_to_buckwalter(text: &str) -> String {
    text.chars()
        .map(|c| AR_TO_BW.get(&c).copied().unwrap_or(c))
        .collect()
}
