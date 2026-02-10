# Alfanous Build System Documentation

The **[Alfanous](./alfanous.md) build system** automates the process of constructing, indexing, and preparing Quranic linguistic data for the search engine. It uses a **GNU Makefile** that orchestrates resource downloading, database construction, index generation, and post-processing via Python scripts.

---

## 1. Overview

The Makefile defines a high-level build pipeline that produces the data backbone for Alfanous.

```
Raw Quranic Sources (XML, SQL dumps)
        │
        ▼
Construct Database (SQLite)
        │
        ▼
Generate Linguistic Resources
        │
        ▼
Build Search Indexes
        │
        ▼
Generate Spelling Dictionaries
        │
        ▼
Finalize Dynamic Resources & Metadata
```

---

## 2. Core Build Target

```bash
make build
```

Triggers:
1. `update_pre_build`
2. `index_all`
3. `speller_all`
4. `update_post_build`

---

## 3. Detailed Build Pipeline

### 3.1 Pre-Build Stage (`update_pre_build`)

#### a. `construct_database`
- Creates the SQLite database (`main.db`) from the SQL dump (`main.sql`).
- Updates metadata in `information.json`.

#### b. `update_translations_indexed_list`
- Uses the Importer CLI to generate a list of indexed translations.

#### c. `update_dynamic_resources_prebuild`
- Populates `dynamic_resources/` with auto-generated Python dictionaries for:
  - Stopwords
  - Synonyms
  - Word properties
  - Derivations
  - Arabic-to-English mappings
  - Standard-to-Uthmani mappings

---

### 3.2 Indexing Stage (`index_all`)

#### a. `index_main`
- Builds the primary index (Surah/Ayah metadata).

#### b. `index_extend`
- Builds the extended index for translations and recitations.

#### c. `index_word`
- (Optional) Builds the word-level index for morphological search.

---

### 3.3 Speller Stage (`speller_all`)

Generates spelling suggestion dictionaries for:
- Ayah-level text (`speller_aya`)
- Subject-level fields (`speller_subject`)
- Word-level spellings (`speller_word`)

---

### 3.4 Post-Build Stage (`update_post_build`)

Finalizes dynamic resources and updates metadata.

- `transfer_vocalizations`: Generates Quranic word vocalization mappings.
- `update_recitations_online_list`: Downloads up-to-date recitations from **EveryAyah**.

---

## 4. Data Sources Used by Alfanous

Alfanous integrates multiple external Quranic and linguistic sources:

| Source | Description | Usage |
|---------|-------------|--------|
| [Tanzil Project](https://tanzil.net) | Quran text in various scripts (Uthmani, Simple Clean) | Core Arabic text of the Quran |
| [Zekr.org Resources](http://zekr.org/resources.html) | Quran translations | Used to populate translation indexes |
| [Quranic Arabic Corpus](http://corpus.quran.com) | Morphological and syntactic data | Builds word-level linguistic database |
| [EveryAyah.com](http://everyayah.com) | Audio recitations metadata | Online/offline recitations configuration |
| Alfanous Internal SQL Dumps | `main.sql` and related data files | Base structured database before indexing |

These datasets form the backbone of Alfanous’s indexed and searchable resources.

---

## 5. File & Directory Responsibilities

| Path | Description |
|------|--------------|
| `src/alfanous-import/cli.py` | Command-line importer for resource download and processing |
| `resources/databases/main.sql` | SQL schema + data dump for Quranic content |
| `src/alfanous/resources/` | Static resource templates and configuration JSONs |
| `store/translations/` | Translation XML files |
| `src/alfanous/dynamic_resources/` | Auto-generated Python modules (stopwords, synonyms, etc.) |
| `src/alfanous/indexes/` | Lucene-style searchable indexes |

---

## 6. Build Execution Example

```bash
make build
```

Executes the following chain:

```
construct_database ➜ update_translations_indexed_list ➜ transfer_prebuild ➜ index_main ➜ index_extend ➜ speller_all ➜ transfer_postbuild
```

Outputs:

- `main.db`
- `indexes/`
- `dynamic_resources/*.py`
- Updated configs (`translations.json`, `information.json`)

---

## 7. Cleaning Up

```bash
make clean
```
Removes temporary, compiled, and cache files.

---

## 8. Summary

Alfanous’s build system is a robust **data engineering pipeline** that transforms raw Quranic and linguistic resources into optimized, indexed, and language-aware search data structures powering the Alfanous API and user interfaces.
