# Quranic Semantic Search Engine - Review Document

**Review Date:** 2025-11-11  

**Reviewer:** [Ibrahim Morad](https://github.com/IbrahimMurad/)  

**Project Repository**: [https://github.com/kyb3r/quranic](https://github.com/kyb3r/quranic)

**Project Version:** 0.0.1

---

## Executive Summary

This project implements a semantic search engine for Quran and Hadith translations using sentence embeddings. The system supports multiple embedding models (SGPT variants, CocoSearch, and Instructor Embedding) and provides a simple API for searching through religious texts semantically.

---

## 1. Project Overview

### 1.1 Purpose
- Semantic search over Quran translations (Clear Quran translation)
- Semantic search over Hadith collections (Bukhari and Muslim)
- Uses sentence embeddings to find semantically similar verses/hadiths

### 1.2 Key Features
- Multiple embedding model support (SGPT, CocoSearch, Instructor)
- Pre-computed embeddings for faster search
- Simple Python API
- Support for both Quran and Hadith collections

### 1.3 Technology Stack
- **Python** (tested on Python 3.11.14)
- **PyTorch** (tested on PyTorch 2.9.0)
- **Transformers** 4.27.1
- **NumPy** (tested on NumPy 2.3.4)
- **Sentence Transformers** (tested on 5.1.2)
- **Instructor Embedding** (tested on 1.0.1)

---

## 2. Architecture & Design

### 2.1 Code Structure

```bash
quranic/
├── __init__.py          # Exports SearchEngine, Quran, HadithCollection
├── engine.py            # Embedding models (SemanticSearch, CocoSearch, Instructor)
├── corpus.py            # Main search engine and data structures
└── data/                # Pre-computed embeddings and text files
    ├── translation-clear-quran.txt
    ├── surah_names.txt
    ├── bukhari.txt
    ├── muslim.txt
    └── *-instruct       # Pre-computed embeddings
    └── *-embeddings      # Pre-computed embeddings
```

### 2.3 Key Components

#### SearchEngine (corpus.py)
- Main interface for semantic search
- Manages document embeddings and search operations
- Supports lazy loading of pre-computed embeddings

#### Embedding Models (engine.py)
- **SemanticSearch**: SGPT models with weighted mean pooling
- **CocoSearch**: CocoDR model for embeddings
- **Instructor**: Instructor Embedding model (recommended by author)

#### Data Structures
- **Surah**: Represents a chapter of the Quran
- **Verse**: Individual verse with translation
- **Hadith**: Individual hadith text
- **HadithCollection**: Collection of hadiths

---

## 3. Dependencies & Compatibility

### 3.1 Dependency Analysis

**Current Dependencies:**
```python
transformers==4.25.1  # Released: Nov 2022
torch==1.13.1        # Released: Oct 2022
numpy==1.24.1        # Released: Feb 2023
sentence_transformers  # Version not specified
```

**Issues:**
- ⚠️ Dependencies are 2+ years old
- ⚠️ `sentence_transformers` version not pinned (potential breaking changes)
- ⚠️ Missing `InstructorEmbedding` in setup.py (required but not listed)
- ⚠️ No Python version requirement specified
- ⚠️ No requirements.txt file

### 3.2 Compatibility Concerns
- Old PyTorch may not work with newer CUDA versions
- Transformers 4.25.1 may have security issues
- May not work with Python 3.11+
- Missing dependency: `InstructorEmbedding` package

---
## 4. My Observations

### General Observations

- It required a lot of updates to the dependencies to make it work.
- It is not a production-ready project.
- The code is not well-organized and is not easy to understand due to the lack of documentation and naming conventions.

### Testing Observations

- Tested with both the already existing queries and with new queries.
- The results are always not accurate.
- There is a first result that is always the same for most of the queries which is (سورة المرسلات آية 23) which is not always the most relevant result.
- The results are in English with no support for Arabic text.
- It gives results for even garbage queries like "Hello, how are you?" which is not related to the Quran or Hadith.
