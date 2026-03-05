use std::fs;

use rusqlite::{Connection, params};

use crate::normalize;

/// Sura name lookup (1-indexed, Arabic names).
const SURA_NAMES: &[&str] = &[
    "", "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف",
    "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر",
    "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون",
    "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
    "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص",
    "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية",
    "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور",
    "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر",
    "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم",
    "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل",
    "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
    "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى",
    "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح",
    "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة",
    "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر",
    "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس",
];

/// Get the Arabic sura name for a given sura number (1-based).
pub fn sura_name(sura_id: u32) -> &'static str {
    SURA_NAMES.get(sura_id as usize).unwrap_or(&"")
}

/// Create an in-memory SQLite database with FTS5, populated from a Quran text file.
///
/// File format: `sura_id|aya_id|text` (one verse per line).
pub fn create_in_memory(quran_path: &str) -> Result<Connection, Box<dyn std::error::Error>> {
    let conn = Connection::open_in_memory()?;

    conn.execute_batch(
        "CREATE TABLE aya (
            gid INTEGER PRIMARY KEY,
            sura_id INTEGER NOT NULL,
            aya_id INTEGER NOT NULL,
            text TEXT NOT NULL,
            sura_name TEXT NOT NULL
        );
        CREATE VIRTUAL TABLE aya_fts USING fts5(
            normalized,
            content='aya',
            content_rowid='gid'
        );",
    )?;

    let content = fs::read_to_string(quran_path)?;
    let mut gid: i64 = 0;

    let tx = conn.unchecked_transaction()?;
    {
        let mut insert_aya = tx.prepare(
            "INSERT INTO aya (gid, sura_id, aya_id, text, sura_name) VALUES (?1, ?2, ?3, ?4, ?5)",
        )?;
        let mut insert_fts = tx.prepare(
            "INSERT INTO aya_fts (rowid, normalized) VALUES (?1, ?2)",
        )?;

        for line in content.lines() {
            let parts: Vec<&str> = line.splitn(3, '|').collect();
            if parts.len() < 3 {
                continue;
            }
            let sura_id: u32 = parts[0].parse().unwrap_or(0);
            let aya_id: u32 = parts[1].parse().unwrap_or(0);
            let text = parts[2];

            if sura_id == 0 || aya_id == 0 {
                continue;
            }

            gid += 1;
            let name = sura_name(sura_id);
            let normalized = normalize::normalize_for_search(text);

            insert_aya.execute(params![gid, sura_id, aya_id, text, name])?;
            insert_fts.execute(params![gid, normalized])?;
        }
    }
    tx.commit()?;

    Ok(conn)
}

/// Create a database from a file path (persistent on disk).
pub fn create_from_file(
    quran_path: &str,
    db_path: &str,
) -> Result<Connection, Box<dyn std::error::Error>> {
    let conn = Connection::open(db_path)?;

    conn.execute_batch(
        "DROP TABLE IF EXISTS aya_fts;
         DROP TABLE IF EXISTS aya;
         CREATE TABLE aya (
            gid INTEGER PRIMARY KEY,
            sura_id INTEGER NOT NULL,
            aya_id INTEGER NOT NULL,
            text TEXT NOT NULL,
            sura_name TEXT NOT NULL
        );
        CREATE VIRTUAL TABLE aya_fts USING fts5(
            normalized,
            content='aya',
            content_rowid='gid'
        );",
    )?;

    let content = fs::read_to_string(quran_path)?;
    let mut gid: i64 = 0;

    let tx = conn.unchecked_transaction()?;
    {
        let mut insert_aya = tx.prepare(
            "INSERT INTO aya (gid, sura_id, aya_id, text, sura_name) VALUES (?1, ?2, ?3, ?4, ?5)",
        )?;
        let mut insert_fts = tx.prepare(
            "INSERT INTO aya_fts (rowid, normalized) VALUES (?1, ?2)",
        )?;

        for line in content.lines() {
            let parts: Vec<&str> = line.splitn(3, '|').collect();
            if parts.len() < 3 {
                continue;
            }
            let sura_id: u32 = parts[0].parse().unwrap_or(0);
            let aya_id: u32 = parts[1].parse().unwrap_or(0);
            let text = parts[2];

            if sura_id == 0 || aya_id == 0 {
                continue;
            }

            gid += 1;
            let name = sura_name(sura_id);
            let normalized = normalize::normalize_for_search(text);

            insert_aya.execute(params![gid, sura_id, aya_id, text, name])?;
            insert_fts.execute(params![gid, normalized])?;
        }
    }
    tx.commit()?;

    Ok(conn)
}
