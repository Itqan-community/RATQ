use std::fmt;

use rusqlite::Connection;

use crate::db;
use crate::normalize;
use crate::parser::{QueryNode, parse_query};
use crate::roots;

/// Error type for search operations.
#[derive(Debug)]
pub enum SearchError {
    /// A database error occurred during query execution.
    Database(rusqlite::Error),
}

impl fmt::Display for SearchError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            SearchError::Database(e) => write!(f, "database error: {}", e),
        }
    }
}

impl std::error::Error for SearchError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            SearchError::Database(e) => Some(e),
        }
    }
}

impl From<rusqlite::Error> for SearchError {
    fn from(e: rusqlite::Error) -> Self {
        SearchError::Database(e)
    }
}

/// A single search result (verse).
#[derive(Debug, Clone)]
pub struct SearchResult {
    pub sura_id: u32,
    pub aya_id: u32,
    pub sura_name: String,
    pub text: String,
}

/// Execute a search query and return matching verses.
///
/// Returns an error if the database query fails, rather than silently
/// returning empty results.
pub fn execute(conn: &Connection, query: &str, limit: usize) -> Result<Vec<SearchResult>, SearchError> {
    let trimmed = query.trim();
    if trimmed.is_empty() {
        return Ok(vec![]);
    }

    let ast = parse_query(trimmed);
    let (sql, params) = build_sql(&ast, limit);

    let mut stmt = conn.prepare(&sql)?;

    let param_refs: Vec<&dyn rusqlite::types::ToSql> =
        params.iter().map(|p| p as &dyn rusqlite::types::ToSql).collect();

    let rows = stmt.query_map(param_refs.as_slice(), |row| {
        Ok(SearchResult {
            sura_id: row.get(0)?,
            aya_id: row.get(1)?,
            sura_name: row.get(2)?,
            text: row.get(3)?,
        })
    })?;

    let mut results = Vec::new();
    for row in rows {
        results.push(row?);
    }
    Ok(results)
}

/// Build SQL from the AST.
fn build_sql(ast: &QueryNode, limit: usize) -> (String, Vec<String>) {
    let mut params = Vec::new();

    match ast {
        // Field query for sura name (supports both bare terms and quoted phrases)
        QueryNode::Field { field, value } if is_sura_field(field) => {
            let sura_name = match value.as_ref() {
                QueryNode::Term(s) | QueryNode::Phrase(s) => s,
                _ => return (empty_sql(), params),
            };
            // Normalize search term and find matching sura ID by comparing
            // normalized forms, so e.g. "ال عمران" matches "آل عمران"
            let sura_id = find_sura_id_by_name(sura_name);
            if sura_id == 0 {
                return (empty_sql(), params);
            }
            let sql = format!(
                "SELECT a.sura_id, a.aya_id, a.sura_name, a.text \
                 FROM aya a \
                 WHERE a.sura_id = ?1 \
                 ORDER BY a.gid LIMIT {}",
                limit
            );
            params.push(sura_id.to_string());
            (sql, params)
        }

        // For other queries, build FTS5 MATCH expression
        _ => {
            // Standalone NOT produces invalid FTS5 syntax (e.g. `NOT "word"`).
            // FTS5 requires NOT to follow another term. Return empty result instead.
            if matches!(ast, QueryNode::Not(_)) {
                return (empty_sql(), params);
            }

            let fts_expr = ast_to_fts5(ast, &mut params);
            if fts_expr.is_empty() {
                return (empty_sql(), params);
            }

            let sql = format!(
                "SELECT a.sura_id, a.aya_id, a.sura_name, a.text \
                 FROM aya a \
                 JOIN aya_fts f ON a.gid = f.rowid \
                 WHERE aya_fts MATCH ?{} \
                 ORDER BY rank \
                 LIMIT {}",
                params.len() + 1,
                limit
            );
            params.push(fts_expr);
            (sql, params)
        }
    }
}

fn empty_sql() -> String {
    "SELECT 0, 0, '', '' WHERE 0".to_string()
}

/// Find sura ID by name, normalizing both stored names and input for comparison.
/// This handles cases where user types normalized alef but stored name uses alef-madda.
/// Prefers exact match; falls back to prefix match only for inputs >= 3 chars.
fn find_sura_id_by_name(name: &str) -> u32 {
    let normalized_input = normalize::normalize_for_search(name);
    let names = db::sura_names();

    // First try exact match
    for (i, stored_name) in names.iter().enumerate() {
        if i == 0 { continue; }
        let normalized_stored = normalize::normalize_for_search(stored_name);
        if normalized_stored == normalized_input {
            return i as u32;
        }
    }

    // Fall back to prefix match only for longer inputs to avoid ambiguity
    if normalized_input.chars().count() < 3 {
        return 0;
    }
    for (i, stored_name) in names.iter().enumerate() {
        if i == 0 { continue; }
        let normalized_stored = normalize::normalize_for_search(stored_name);
        if normalized_stored.starts_with(&normalized_input) {
            return i as u32;
        }
    }
    0
}

fn is_sura_field(field: &str) -> bool {
    matches!(
        field,
        "سورة" | "sura" | "sura_name" | "sura_arabic"
    )
}

/// Convert AST to FTS5 MATCH expression.
fn ast_to_fts5(node: &QueryNode, _params: &mut Vec<String>) -> String {
    match node {
        QueryNode::Term(t) => {
            let normalized = normalize::normalize_for_search(t);
            if normalized.is_empty() {
                return String::new();
            }
            // Generate prefix-expanded terms for better matching
            let expansions = normalize::expand_prefixes(&normalized);
            if expansions.len() > 1 {
                let terms: Vec<String> = expansions
                    .iter()
                    .map(|e| format!("\"{}\"", e))
                    .collect();
                format!("({})", terms.join(" OR "))
            } else {
                format!("\"{}\"", normalized)
            }
        }
        QueryNode::Phrase(p) => {
            let normalized = normalize::normalize_for_search(p);
            format!("\"{}\"", normalized)
        }
        QueryNode::Wildcard(w) => {
            let normalized = normalize::normalize_for_search(
                &w.replace('*', "").replace('?', "").replace('\u{061F}', ""),
            );
            format!("{}*", normalized)
        }
        QueryNode::And(left, right) => {
            let l = ast_to_fts5(left, _params);
            let r = ast_to_fts5(right, _params);
            if l.is_empty() { return r; }
            if r.is_empty() { return l; }
            // FTS5 uses NOT as a binary operator (a NOT b), not AND NOT.
            // Detect when the right operand is a NOT node and emit correctly.
            if matches!(right.as_ref(), QueryNode::Not(_)) {
                format!("({} {})", l, r)
            } else {
                format!("({} AND {})", l, r)
            }
        }
        QueryNode::Or(left, right) => {
            let l = ast_to_fts5(left, _params);
            let r = ast_to_fts5(right, _params);
            if l.is_empty() { return r; }
            if r.is_empty() { return l; }
            format!("({} OR {})", l, r)
        }
        QueryNode::Not(inner) => {
            // FTS5 requires NOT to follow another term (e.g. "a AND NOT b").
            // Standalone NOT is handled by the AND combiner in the parser.
            let i = ast_to_fts5(inner, _params);
            if i.is_empty() {
                return String::new();
            }
            format!("NOT {}", i)
        }
        QueryNode::Boost(inner, _weight) => {
            // FTS5 doesn't support boost natively; just pass through
            ast_to_fts5(inner, _params)
        }
        QueryNode::SpellTolerant(t) => {
            // Generate variants with common Arabic letter confusions
            let variants = generate_spell_variants(t);
            let terms: Vec<String> = variants.iter().map(|v| format!("\"{}\"", v)).collect();
            format!("({})", terms.join(" OR "))
        }
        QueryNode::Root(t) => {
            // Find all lemmas derived from this root
            let lemmas = roots::find_lemmas_for_root(t);
            if lemmas.is_empty() {
                let normalized = normalize::normalize_for_search(t);
                format!("\"{}\"", normalized)
            } else {
                let terms: Vec<String> = lemmas.iter().map(|l| format!("\"{}\"", l)).collect();
                format!("({})", terms.join(" OR "))
            }
        }
        QueryNode::Lemma(t) => {
            // Find sibling lemmas sharing the same root
            let siblings = roots::find_siblings_for_lemma(t);
            if siblings.is_empty() {
                let normalized = normalize::normalize_for_search(t);
                format!("\"{}\"", normalized)
            } else {
                let terms: Vec<String> = siblings.iter().map(|l| format!("\"{}\"", l)).collect();
                format!("({})", terms.join(" OR "))
            }
        }
        QueryNode::Synonym(t) | QueryNode::Antonym(t) => {
            // Synonym/antonym: fall back to root-based expansion
            // (full synonym data would require an Arabic WordNet)
            let lemmas = roots::find_siblings_for_lemma(t);
            if lemmas.is_empty() {
                let normalized = normalize::normalize_for_search(t);
                format!("\"{}\"", normalized)
            } else {
                let terms: Vec<String> = lemmas.iter().map(|l| format!("\"{}\"", l)).collect();
                format!("({})", terms.join(" OR "))
            }
        }
        QueryNode::Field { .. } => String::new(),
    }
}

/// Generate common Arabic spelling variants for spell-tolerant search.
fn generate_spell_variants(word: &str) -> Vec<String> {
    let normalized = normalize::normalize_for_search(word);
    if normalized.is_empty() {
        return vec![];
    }
    let mut variants = vec![normalized.clone()];

    // After normalization, ة has become ه.
    // Generate a ة variant for matching un-normalized contexts.
    if normalized.contains('ه') {
        variants.push(normalized.replace('ه', "\u{0629}"));
    }

    // With and without ال
    let stripped = normalize::strip_definite_article(&normalized);
    if stripped != normalized {
        variants.push(stripped);
    }
    if !normalized.starts_with("ال") {
        variants.push(format!("ال{}", normalized));
    }

    // Deduplicate while preserving order
    let mut seen = std::collections::HashSet::new();
    variants.retain(|v| seen.insert(v.clone()));

    variants
}
