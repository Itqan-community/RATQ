# Quran Analysis - Complete Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [System Architecture](#system-architecture)
4. [Core Components](#core-components)
5. [Search Algorithm Explained](#search-algorithm-explained)
6. [API Reference](#api-reference)
7. [Credits & License](#credits--license)

---

## Introduction

**Quran Analysis (QA)** is a semantic search and intelligence system for the Quran. It provides advanced search capabilities including:

- **Semantic Search**: Understands meaning, not just keywords
- **Morphological Analysis**: Searches word roots and derivatives
- **Question Answering**: Attempts to answer questions about the Quran
- **Ontology-based Search**: Uses concept relationships
- **Multi-script Support**: Arabic (Simple/Uthmani) and English
- **Visualization**: Interactive graphs and statistics

## Urls

- Source code: [url](https://github.com/karimouda/qurananalysis/)
- Web: [url](https://qurananalysis.com/)

## Key Features

- Full-text search with morphological expansion
- Phrase search with exact matching
- Question answering system
- Concept-based ontology search
- Transliteration search (phonetic Arabic)
- Word root and stem extraction
- Interactive knowledge graphs
- Statistical analysis and visualizations

---

## Project Overview

### History

Quran Analysis started as an MSc project at the University of Leeds in 2015, supervised by Eric Atwell. The goal was to:

1. Integrate previous Quranic NLP research
2. Provide an open-source framework for Quran analysis
3. Enable semantic search capabilities
4. Facilitate academic research

### Technology Stack

- **Backend**: PHP 5.3+
- **Caching**: APC (Alternative PHP Cache)
- **Frontend**: HTML, CSS, JavaScript
- **Visualization**: D3.js
- **Data Formats**: XML, TXT, OWL (ontology)

### External Resources

1. **[Tanzil Project](./tanzil.md)**: Quran text (Simple/Uthmani), translations, transliteration
2. **[Quranic Arabic Corpus (QAC)](https://corpus.quran.com/)**: Morphological annotations, POS tagging
3. **Qurana**: Pronominal anaphora resolution
4. **WordNet**: English semantic dictionary
5. **DBPedia**: Semantic structured data
6. **Microsoft Translator API**: Translation services

---

## System Architecture

### High-Level Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────────┐
│  Apache/PHP     │
│  Web Server     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  APC Memory     │◄──── All models cached here
│  Cache Layer    │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────────┐
│  Data Processing Layer      │
├─────────────────────────────┤
│ • Query Analyzer            │
│ • Inverted Index Search     │
│ • QAC Morphology Processor  │
│ • Ontology Reasoner         │
│ • Question Answering Engine │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────┐
│  Data Files     │
├─────────────────┤
│ • Quran Text    │
│ • QAC Corpus    │
│ • Ontology      │
│ • WordNet       │
└─────────────────┘
```

### Memory Model Structure

Everything is cached in APC with hierarchical keys:

```
{LANG}/MODEL/{MODEL_TYPE}/{KEY}/{ENTRY}

Examples:
- AR/MODEL_CORE/QURAN_TEXT/[sura][aya]
- AR/MODEL_SEARCH/INVERTED_INDEX/{word}
- ALL/MODEL_QA_ONTOLOGY/CONCEPTS/{concept_id}
- AR/MODEL_QAC/QAC_MASTERTABLE/{location}
```

---

## Core Components

### 1. Core Library (`libs/core.lib.php`)

**Purpose**: Foundation functions for the entire system

**Key Functions**:

- `loadModels()` - Loads and caches all data models
- `getModelEntryFromMemory()` - Retrieves cached data from APC
- `addValueToMemoryModel()` - Stores data in APC cache
- `myLevensteinEditDistance()` - Calculates string similarity (multilingual)
- `removeTashkeel()` - Removes Arabic diacritics
- `isArabicString()` - Detects Arabic text
- `buckwalterReverseTransliteration()` - Converts Buckwalter to Arabic

**Features**:

- Multilingual string operations
- Unicode-safe character handling
- Arabic text normalization
- Memory management utilities

---

### 2. Search Library (`libs/search.lib.php`)

**Purpose**: Core search functionality and ranking

**Key Functions**:

#### Query Expansion

- `posTagUserQuery()` - Part-of-speech tagging for queries
- `extendQueryWordsByDerivations()` - Adds plurals, singular forms
- `extendQueryWordsByConceptTaxRelations()` - Adds related concepts from ontology
- `extendQueryByExtractingQACDerviations()` - Extracts Arabic roots/stems

#### Search & Ranking

- `getScoredDocumentsFromInveretdIndex()` - Searches inverted index
- `getSimilarWords()` - Finds similar words for suggestions
- `getDistanceByCommonUniqueChars()` - Secondary similarity metric

#### Results Processing

- `printResultVerses()` - Renders search results with highlighting
- `getStatsByScoringTable()` - Generates search statistics
- `searchResultsToWordcloud()` - Creates word cloud from results

**Scoring Formula**:

```php
SCORE = (FREQ / 2) +                    // Term frequency
        (DISTANCE * 1) +                // Word proximity
        (QUERY_WORDS_IN_VERSE * 10) +   // Unique query terms
        (PRONOUNS * 1) +                // Pronoun matches
        (WORD_OCCURENCES_COUNT * 1) +   // Total occurrences
        (IS_FULL_QUERY_IN_VERSE * 20)   // Exact phrase match
```

---

### 3. Question Answering (`libs/question.answering.lib.php`)

**Purpose**: Answers questions about Quran content

**Key Functions**:

- `answerUserQuestion()` - Main QA orchestrator
- `containsQuestionWords()` - Detects question type
- `removeQuestionCluesFromArr()` - Cleans query for search

**Question Types Supported**:

| English  | Arabic              | Type     |
| -------- | ------------------- | -------- |
| who      | من هو، من هم، من هى | Person   |
| what     | ما هو، ما هى، ماذا  | General  |
| how many | كم                  | Quantity |
| how long | -                   | Time     |

**QA Process**:

1. Detect question type (who, what, etc.)
2. Extract question concepts
3. Find related concepts in ontology
4. Search for relevant verses
5. Re-score based on:
   - Common concepts (×10)
   - Question type concepts (×10)
   - Common roots (×10)
   - Common derivations (×10)
6. Return top 3 answers

---

### 4. Ontology Library (`libs/ontology.lib.php`)

**Purpose**: Manages QA Ontology (concepts and relationships)

**Ontology Structure**:

```
Concepts:
- Classes (categories): animal, person, place
- Instances (specific items): horse, Moses, Mecca

Relations:
- is-a: horse is-a animal
- has-property: Moses has-property prophet
- located-in: Kaaba located-in Mecca

Metadata:
- Arabic labels
- English labels
- Frequency in Quran
- Wikipedia links
- Images
```

**Key Functions**:

- `buildRelationHashID()` - Creates unique relation identifier
- `stripOntologyNamespace()` - Cleans OWL namespaces
- `cleanWordnetCollocation()` - Normalizes WordNet phrases

---

### 5. Graph Library (`libs/graph.lib.php`)

**Purpose**: Generates D3.js visualizations

**Key Functions**:

- `ontologyTextToD3Graph()` - Creates knowledge graphs from search results
- `createNewConceptObj()` - Builds graph nodes
- `formatEnglishConcept()` - Formats concept labels

**Visualization Types**:

1. **Force-directed graph**: Concepts and relationships
2. **Hierarchical treemap**: Concept taxonomy
3. **Word clouds**: Term frequency visualization
4. **Statistical charts**: Search result distribution

---

### 6. POS Tagger (`libs/pos.tagger.lib.php`)

**Purpose**: Part-of-speech tagging for English queries

**Based on**: PHPIR library with Brown Corpus lexicon

**Tags Used**:

- `NN` - Noun, singular
- `NNS` - Noun, plural
- `VB` - Verb, base form
- `VBD` - Verb, past tense
- `VBG` - Verb, gerund/present participle
- `JJ` - Adjective

**Process**:

1. Tokenize query
2. Look up each word in lexicon
3. Apply transformation rules
4. Return tagged words

---

## Search Algorithm Explained

### **Architecture Overview**

This is a **semantic search engine** with:

- **Inverted Index** for fast lookups
- **QAC (Quranic Arabic Corpus)** integration for morphological analysis
- **Ontology-based** query expansion
- **Question Answering** capabilities
- **Multi-script support** (Uthmani/Simple Arabic, English)

---

### Core Data Structures

### 1. Memory Model (APC Cache)

Everything is stored in APC (Alternative PHP Cache) with hierarchical keys:

```
{LANG}/MODEL/{MODEL_TYPE}/{KEY}/{ENTRY}

Examples:
- AR/MODEL_CORE/QURAN_TEXT/[sura][aya]
- AR/MODEL_SEARCH/INVERTED_INDEX/{word}
- ALL/MODEL_QA_ONTOLOGY/CONCEPTS/{concept_id}
- AR/MODEL_QAC/QAC_MASTERTABLE/{location}
```

### 2. Inverted Index Structure

```php
INVERTED_INDEX[word] = [
    [
        'SURA' => 0,
        'AYA' => 5,
        'INDEX_IN_AYA_EMLA2Y' => 3,      // Position in simple text
        'INDEX_IN_AYA_UTHMANI' => 3,     // Position in Uthmani
        'WORD_TYPE' => 'ROOT'|'LEM'|'NORMAL_WORD'|'PRONOUN_ANTECEDENT',
        'EXTRA_INFO' => 'additional context'
    ],
    // ... more occurrences
]
```

### 3. QAC Master Table

```php
QAC_MASTERTABLE[sura:aya:word] = [
    segment_index => [
        'FORM_AR' => 'الكتاب',
        'FORM_EN' => 'AlkitAb',
        'TAG' => 'NN',  // Part of speech
        'FEATURES' => [
            'ROOT' => 'كتب',
            'LEM' => 'كِتَاب',
            'STEM' => '...'
        ]
    ]
]
```

### 4. Ontology Structure

```php
CONCEPTS[concept_id] = [
    'label_ar' => 'حيوان',
    'label_en' => 'animal',
    'frequency' => 50,
    'weight' => 0.85,
    'meaning_wordnet_en' => 'living organism',
    'image_url' => '...'
]

RELATIONS[hash] = [
    'SUBJECT' => 'horse',
    'VERB' => 'هو',  // is-a
    'OBJECT' => 'animal',
    'FREQUENCY' => 10
]

GRAPH_INDEX_SOURCES[concept] = [ all relations where concept is source ]
GRAPH_INDEX_TARGETS[concept] = [ all relations where concept is target ]
```

---

### Complete Search Flow - Step by Step

### Phase 1: Query Analysis (`query.handling.common.php`)

#### 1.1 Language Detection

```php
isArabicString($query) → sets $lang = "AR" or "EN"
```

#### 1.2 Search Type Detection

```php
- Phrase: Contains quotes "exact phrase"
- Question: Contains ? or question words (who, what, من, ما)
- Chapter/Verse: Pattern like "2:255" or just "2"
- Concept: Prefix "CONCEPTSEARCH:"
- Transliteration: English phonetic Arabic
- Normal: Default keyword search
```

#### 1.3 Query Cleaning

```php
For Arabic:
1. convertUthamniQueryToSimple() - removes diacritics
2. removeNonArabicAndSpaceChars() - strips non-Arabic
3. Keeps ال (Al-) prefix

For English:
1. strtolower()
2. removeSpecialCharactersFromMidQuery()
```

---

### Phase 2: Query Expansion (`search.lib.php`)

This is where the **magic** happens - turning a simple query into a comprehensive search.

#### 2.1 POS Tagging (`posTagUserQuery`)

```php
For English:
- Uses PHPIR lexicon-based tagger
- Tags: NN (noun), VB (verb), JJ (adjective), etc.
- Example: "good book" → [good/JJ, book/NN]

For Arabic:
- Uses stopword list
- Everything not a stopword = NN (noun)
```

#### 2.2 Derivation Expansion (`extendQueryWordsByDerivations`)

**English Derivations:**

```php
Input: "book"
Process:
- If POS = NN → add plural: "books"
- If POS = NNS → add singular: "book"

Output: ["book", "books"]
```

**Arabic Derivations (Complex!):**

```php
Input: "حيوان" (animal)

Step 1: Search ontology for similar words
- Use myLevensteinEditDistance() ≤ 5 chars
- Use getDistanceByCommonUniqueChars()

Step 2: Handle Arabic patterns
- If word ends with "ات" → mark as NNS (plural)
  Example: "حيوانات" ← "حيوان"
- If word starts with "ال" → handle definite article
  Example: "الحيوانات" ← "حيوان"

Step 3: Find all morphological variants
- Searches concept synonyms
- Checks if concepts are related by "ات" or "ال" patterns

Output: ["حيوان", "حيوانات", "الحيوان", "الحيوانات"]
```

**Pattern Recognition:**

```php
getStringDiff($word1, $word2) determines:
- "ات" = plural suffix
- "ال" = definite article
- "الات" = definite + plural

Example:
حيوان → الحيوانات
Diff = "الات" → valid plural derivation
```

#### 2.3 Ontology Extension (`extendQueryWordsByConceptTaxRelations`)

**IS-A Relations (Taxonomy):**

```php
Input: "horse"

Step 1: Find in ontology
- Translate EN→AR: "horse" → "حصان"

Step 2: Find IS-A relations
- INBOUND: X is-a horse → ["mare", "stallion"]
- OUTBOUND: horse is-a X → ["animal", "mammal"]

Step 3: Add to query
Output: ["horse", "mare", "stallion", "animal", "mammal"]
```

**For Questions - Verb Relations:**

```php
Input: "who created man?"
Query terms: ["create", "man"]

Step 1: Extract verb "create"
Step 2: Find verb relations in VERB_INDEX:
- create(SUBJECT=Allah, OBJECT=man)
- create(SUBJECT=Allah, OBJECT=earth)

Step 3: Add related concepts:
Output: ["create", "man", "Allah", "earth"]
```

**Synonym Expansion:**

```php
SYNONYMS_INDEX["righteous"] = "صالح"

If word is a synonym → add main concept
Output: ["righteous", "صالح"]
```

#### 2.4 QAC Derivation Extraction (`extendQueryByExtractingQACDerviations`)

**For Arabic Only:**

```php
Input: "كتاب" (book)

Step 1: Look up word in INVERTED_INDEX
→ Find all verses containing "كتاب"

Step 2: For each occurrence:
- Get QAC location: "2:1:5" (sura:aya:word)
- Lookup QAC_MASTERTABLE["2:1:5"]

Step 3: Extract morphological info:
- ROOT: "كتب" (k-t-b)
- LEM: "كِتَاب" (lemma)
- STEM: base form

Step 4: Add to query:
Output: ["كتاب", "كتب", "كِتَاب", "يكتب", "كاتب", ...]
         (book, write, book, writes, writer, ...)
```

**Uthmani ↔ Simple Mapping:**

```php
// Uthmani (with diacritics) → Simple (without)
UTHMANI_TO_SIMPLE_WORD_MAP["ٱلْكِتَٰبِ"] = "الكتاب"

// Used to convert QAC results back to searchable text
```

---

### Phase 3: Index Search (`getScoredDocumentsFromInveretdIndex`)

#### 3.1 Column Search (Chapter/Verse)

```php
If searching for "2:255":
- Directly return that verse with SCORE=1
- Skip inverted index entirely
```

#### 3.2 Inverted Index Lookup

```php
For each word in extendedQueryWordsArr:

    1. Fetch from index:
       invertedIndexEntry = INVERTED_INDEX[word]

    2. For each document (verse) containing word:
       - Extract: SURA, AYA, WORD_INDEX, WORD_TYPE

    3. Phrase search check:
       if isPhraseSearch:
           - Use regex: "/(^|[ ])$query([ ]|\$)/umi"
           - Only keep if FULL query matches
           - Skip if not found

    4. Initialize scoring entry:
       scoringTable[SURA:AYA] = {
           SCORE: 0,
           FREQ: 0,
           DISTANCE: 0,
           WORD_OCCURENCES_COUNT: 0,
           QUERY_WORDS_IN_VERSE: 0,
           IS_FULL_QUERY_IN_VERSE: 0,
           POSSIBLE_HIGHLIGHTABLE_WORDS: [],
           PRONOUNS: []
       }
```

#### 3.3 Word Type Handling

```php
If WORD_TYPE == "PRONOUN_ANTECEDENT":
    // Mark pronoun location
    scoringTable[verse]['PRONOUNS'][pronoun_text] = word_index

If WORD_TYPE == "ROOT" or "LEM":
    // Add segment form + converted simple form
    segment_word = getItemFromUthmaniToSimpleMappingTable(EXTRA_INFO)
    scoringTable[verse]['POSSIBLE_HIGHLIGHTABLE_WORDS'][segment_word] = type

If WORD_TYPE == "NORMAL_WORD":
    // Add exact word
    scoringTable[verse]['POSSIBLE_HIGHLIGHTABLE_WORDS'][word] = type
```

#### 3.4 Scoring Calculation

```php
SCORE = (FREQ / 2) +                    // Term frequency (low weight)
        (DISTANCE * 1) +                // Word proximity
        (QUERY_WORDS_IN_VERSE * 10) +   // Unique terms (high weight!)
        (PRONOUNS * 1) +                // Pronoun matches
        (WORD_OCCURENCES_COUNT * 1) +   // Total occurrences
        (IS_FULL_QUERY_IN_VERSE * 20)   // Exact phrase (highest!)
```

**Why this scoring?**

- **Exact phrases get 20 points** - highest priority
- **More query terms = 10 points each** - diversity matters
- **Term frequency = 0.5 points** - prevents spam from high-frequency words

---

### Phase 4: Question Answering (`answerUserQuestion`)

**For questions only:**

#### 4.1 Extract Question Type

```php
containsQuestionWords("who created man?", "EN")
→ Returns "Person"

Question types:
- "who" → Person
- "what" → General
- "how many" → Quantity
- "how long" → Time
```

#### 4.2 Get Question Type Concepts

```php
questionType = "Person"
conceptID = "person" (from ontology)

Find all IS-A relations where target = person:
- Adam is-a person
- Moses is-a person
- Noah is-a person

questionTypeConceptsArr = ["Adam", "Moses", "Noah", ...]
```

#### 4.3 Score Answer Candidates

```php
For each verse in results:

    1. Extract concepts from verse text
    2. Calculate similarity factors:

    COMMON_CONCEPTS = intersection(question_concepts, verse_concepts) * 10
    COMMON_QUESTION_TYPE = intersection(question_type_concepts, verse_concepts) * 10
    COMMON_ROOTS = intersection(question_roots, verse_roots) * 10
    COMMON_DERIVATIONS = shared_word_substrings * 10

    3. Update score:
    SCORE += COMMON_CONCEPTS + COMMON_QUESTION_TYPE +
             COMMON_ROOTS + COMMON_DERIVATIONS
```

#### 4.4 Return Top Answers

```php
// Sort by new scores
rsortBy($scoredAnswers, 'SCORE')

// Return top 3 verses
return array_slice($scoredAnswers, 0, 3)
```

---

### Phase 5: Similarity Metrics (`core.lib.php`)

#### 5.1 Levenshtein Distance (`myLevensteinEditDistance`)

```php
// Classic dynamic programming algorithm
// Multilingual support (uses mb_substr)

Example:
word1 = "كتاب"
word2 = "كتب"

Matrix:
    ""  ك  ت  ب
""   0  1  2  3
ك    1  0  1  2
ت    2  1  0  1
ا    3  2  1  1
ب    4  3  2  1

Distance = 1 (one deletion)
```

#### 5.2 Common Unique Characters (`getDistanceByCommonUniqueChars`)

```php
word1 = "كتاب"
word2 = "كتابة"

unique_chars(word1) = [ك, ت, ا, ب]
unique_chars(word2) = [ك, ت, ا, ب, ة]
intersection = [ك, ت, ا, ب]

score = 4 (common chars)
+ 1 (same first char: ك)
+ 0 (different last: ب ≠ ة)
= 5
```

#### 5.3 Combined Similarity (`getSimilarWords`)

```php
For each word in corpus:
    if abs(len(word) - len(query)) <= 3:
        edit_dist = getDistanceBetweenWords(word, query)

        if edit_dist <= 3:
            similarity = (1/edit_dist) + commonUniqueChars(word, query)

// Sort by similarity (descending)
// Return top matches
```

---

### Phase 6: Result Processing

#### 6.1 Highlighting (`printResultVerses`)

```php
For each verse:
    1. Mark query words:
       $TEXT = preg_replace("/(word1|word2)/", "<marked>\\1</marked>", $TEXT)

    2. Mark pronouns:
       For each pronoun:
           markSpecificWordInText($TEXT, pronoun_index, pronoun_text, "marked")

    3. Mark prospect answers (for questions):
       For each significant_collocation_word:
           markWordWithoutWordIndex($TEXT, word, "marked_prospect_answer")
```

#### 6.2 Statistics (`getStatsByScoringTable`)

```php
uniqueSuras = count(unique sura IDs)
uniqueVerses = count(unique sura:aya pairs)
totalRepetitions = sum(word occurrences)

return [
    'UNIQUE_REP' => totalRepetitions,
    'CHAPTERS_COUNT' => uniqueSuras,
    'VERSES_COUNT' => uniqueVerses
]
```

#### 6.3 Word Cloud (`searchResultsToWordcloud`)

```php
For each verse in results:
    words = split(verse)
    For each word:
        if not stopword:
            wordCloud[word]++

// Sort by frequency
// Return top 50
```

---

### Advanced Features

#### 1. Transliteration Search

```php
If English + not question + word in TRANSLITERATION_WORDS_INDEX:
    isTransliterationSearch = true

    // Search phonetic Arabic
    // e.g., "bismillah" → finds "بسم الله"
```

#### 2. Buckwalter Transliteration

```php
// Arabic ↔ ASCII encoding for QAC
arabicToBuckwalter("الْكِتَابِ")
→ "AlkitAbi"

buckwalterReverseTransliteration("AlkitAbi")
→ "الْكِتَابِ"
```

#### 3. Script Conversion

```php
shallowUthmaniToSimpleConversion():
    1. Remove all diacritics
    2. Replace "ءا" → "آ"
    3. Replace final "ى" → "ي"
    4. Replace superscript alef (ٰ) → "ا"
    5. Replace alef wasla (ٱ) → "ا"
```

#### 4. Pause Mark Handling

```php
// Arabic Quran has pause marks: ۗ ۚ ۘ
removePauseMarkFromVerse():
    - Strips all pause marks
    - Used for clean text matching
```

---

### Performance Optimizations

#### 1. APC Caching

```php
// All models cached in memory
// No file I/O during search
// ~100ms search time
```

#### 2. Query Limiting

```php
// Max 25 extended query words
if count($extendedQuery) > 25:
    $extendedQuery = array_slice($extendedQuery, 0, 25)
```

#### 3. Concept Limiting

```php
// For Arabic derivations
// Max 10 derived forms
$taggedSignificantWords = array_slice($words, 0, 10)
```

#### 4. Early Termination

```php
// For word info lookup with fast=true
if $fast && !empty($versesArr):
    break  // Stop after first result
```

---

### Key Algorithms Summary

| Algorithm             | Purpose            | Complexity   |
| --------------------- | ------------------ | ------------ |
| Levenshtein Distance  | Typo correction    | O(m×n)       |
| Common Unique Chars   | Fast similarity    | O(m+n)       |
| POS Tagging           | English syntax     | O(n)         |
| Ontology Traversal    | Semantic expansion | O(relations) |
| Inverted Index Lookup | Fast search        | O(1) average |
| Dynamic Scoring       | Relevance ranking  | O(results)   |

---

### Data Flow Diagram

```
User Query
    ↓
[Language Detection] → AR or EN
    ↓
[Query Cleaning] → Remove noise
    ↓
[POS Tagging] → Identify word types
    ↓
[Derivation Expansion] → Add plurals/variants
    ↓
[Ontology Expansion] → Add related concepts
    ↓
[QAC Expansion] → Add roots/stems (AR only)
    ↓
[Inverted Index Search] → Find matching verses
    ↓
[Scoring] → Rank by relevance
    ↓
[Question Answering?] → YES: Re-score with QA factors
    ↓                    NO: Continue
[Sort Results] → By final score
    ↓
[Highlight] → Mark matched words
    ↓
[Generate Stats] → Charts + metrics
    ↓
Display Results
```

---

## API Reference

### Main Search Endpoint

**URL**: `/search/dosearch.ajax.service.php`

**Method**: GET

**Parameters**:

```
q       - Query string (required)
script  - Display script: 'simple' or 'uthmani' (optional, default: simple)
```

**Example**:

```
GET /search/dosearch.ajax.service.php?q=محمد&script=uthmani
```

**Response**: HTML fragment with search results

---

### Query Handling

**URL**: `/search/index.php`

**Method**: GET

**Parameters**:

```
q - Query string (required)
```

**Example**:

```
GET /search/index.php?q=Muhammad
```

**Response**: Full HTML page with results, graphs, and statistics

---

### Query Modifiers

**Phrase Search**:

```
q="exact phrase"
```

**Chapter Search**:

```
q=2          (entire chapter 2)
q=2:255      (chapter 2, verse 255)
```

**Concept Search**:

```
q=CONCEPTSEARCH:animal
```

**Constraints**:

```
q=muhammad CONSTRAINT:NODERIVATION
q=muhammad CONSTRAINT:NOEXTENTIONFROMONTOLOGY
```

---

## Credits & License

### Main Author

**Karim Ouda**

- MSc Project, University of Leeds (2015)
- Supervisor: Eric Atwell
- Email: [Contact via website]
- Website: https://www.qurananalysis.com

### License

**GNU General Public License v3.0**

```
Quran Analysis (www.qurananalysis.com)
Full Semantic Search and Intelligence System for the Quran
Copyright (C) 2015 Karim Ouda

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
```

**Commercial Use**: Quran Analysis code, framework, and corpora can be used in websites or applications (commercial/non-commercial) provided that the developer:

- Link back to www.qurananalysis.com
- Give sufficient credits
