use std::path::Path;

use crate::data::qac::QacMorphology;
use crate::data::quran::QuranText;
use crate::nlp::stopwords::StopWords;

/// All loaded models in memory.
pub struct ModelStore {
    pub quran_simple: QuranText,
    pub quran_uthmani: QuranText,
    pub translation_en: QuranText,
    pub qac: QacMorphology,
    pub stopwords_ar_l1: StopWords,
    pub stopwords_ar_l2: StopWords,
    pub stopwords_en: StopWords,
}

impl ModelStore {
    /// Load all models from a data directory.
    pub fn load(data_dir: &Path) -> Result<Self, String> {
        let quran_simple =
            QuranText::from_file(&data_dir.join("quran-simple-clean.txt"))?;
        let quran_uthmani =
            QuranText::from_file(&data_dir.join("quran-uthmani.txt"))?;
        let translation_en =
            QuranText::from_file(&data_dir.join("en.sahih"))?;
        let qac = QacMorphology::from_file(
            &data_dir.join("quranic-corpus-morphology-0.4.txt"),
        )?;
        let stopwords_ar_l1 =
            StopWords::from_file(&data_dir.join("quran-stop-words.strict.l1.ar"))?;
        let stopwords_ar_l2 =
            StopWords::from_file(&data_dir.join("quran-stop-words.strict.l2.ar"))?;
        let stopwords_en =
            StopWords::from_file(&data_dir.join("english-stop-words.en"))?;

        Ok(ModelStore {
            quran_simple,
            quran_uthmani,
            translation_en,
            qac,
            stopwords_ar_l1,
            stopwords_ar_l2,
            stopwords_en,
        })
    }
}
