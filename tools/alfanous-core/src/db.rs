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

/// Return the full list of sura names (index 0 is empty, 1-based).
pub fn sura_names() -> &'static [&'static str] {
    SURA_NAMES
}

const CREATE_SCHEMA: &str = "\
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
    );";

/// Populate an existing connection with Quran data and FTS index.
///
/// Returns an error if the input file has invalid format or yields zero rows,
/// rather than silently building a partial or empty index.
fn populate(conn: &Connection, quran_path: &str) -> Result<(), Box<dyn std::error::Error>> {
    let content = fs::read_to_string(quran_path)?;
    let mut gid: i64 = 0;
    let mut inserted: usize = 0;

    let tx = conn.unchecked_transaction()?;
    {
        let mut insert_aya = tx.prepare(
            "INSERT INTO aya (gid, sura_id, aya_id, text, sura_name) VALUES (?1, ?2, ?3, ?4, ?5)",
        )?;
        let mut insert_fts = tx.prepare(
            "INSERT INTO aya_fts (rowid, normalized) VALUES (?1, ?2)",
        )?;

        for (line_no, line) in content.lines().enumerate() {
            let trimmed = line.trim();
            if trimmed.is_empty() || trimmed.starts_with('#') {
                continue;
            }
            let parts: Vec<&str> = trimmed.splitn(3, '|').collect();
            if parts.len() < 3 {
                return Err(format!(
                    "invalid format at line {} (expected sura_id|aya_id|text): {:?}",
                    line_no + 1,
                    trimmed.chars().take(60).collect::<String>()
                ).into());
            }
            let sura_id: u32 = parts[0].parse().map_err(|e| {
                format!("invalid sura_id at line {}: {}", line_no + 1, e)
            })?;
            let aya_id: u32 = parts[1].parse().map_err(|e| {
                format!("invalid aya_id at line {}: {}", line_no + 1, e)
            })?;
            let text = parts[2];

            if sura_id == 0 || sura_id as usize >= SURA_NAMES.len() {
                return Err(format!(
                    "sura_id {} out of range (1-{}) at line {}",
                    sura_id,
                    SURA_NAMES.len() - 1,
                    line_no + 1
                ).into());
            }

            if aya_id == 0 {
                return Err(format!(
                    "aya_id must be > 0 at line {}", line_no + 1
                ).into());
            }

            gid += 1;
            let name = sura_name(sura_id);
            let normalized = normalize::normalize_for_search(text);

            insert_aya.execute(params![gid, sura_id, aya_id, text, name])?;
            insert_fts.execute(params![gid, normalized])?;
            inserted += 1;
        }
    }

    if inserted == 0 {
        return Err("input file produced zero indexed rows".into());
    }

    tx.commit()?;
    Ok(())
}

/// Create an in-memory SQLite database with FTS5, populated from a Quran text file.
///
/// File format: `sura_id|aya_id|text` (one verse per line).
pub fn create_in_memory(quran_path: &str) -> Result<Connection, Box<dyn std::error::Error>> {
    let conn = Connection::open_in_memory()?;
    conn.execute_batch(CREATE_SCHEMA)?;
    populate(&conn, quran_path)?;
    Ok(conn)
}

/// Create a database from a file path (persistent on disk).
///
/// Builds into a temporary file first, then atomically replaces the target
/// path only after population succeeds. This avoids destroying a valid
/// existing database if the input is invalid or parsing fails.
pub fn create_from_file(
    quran_path: &str,
    db_path: &str,
) -> Result<Connection, Box<dyn std::error::Error>> {
    let tmp_path = format!("{}.tmp", db_path);

    // Build in a temporary database first
    {
        let conn = Connection::open(&tmp_path)?;
        conn.execute_batch("DROP TABLE IF EXISTS aya_fts; DROP TABLE IF EXISTS aya;")?;
        conn.execute_batch(CREATE_SCHEMA)?;
        populate(&conn, quran_path)?;
        // Close the connection so the file is fully flushed
    }

    // Only replace the target after successful build
    fs::rename(&tmp_path, db_path)?;
    let conn = Connection::open(db_path)?;
    Ok(conn)
}
