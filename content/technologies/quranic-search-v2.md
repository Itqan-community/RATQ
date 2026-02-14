# Project Review: Quranic Search v2

**Review Date:** 11/11/2025

**Project Type:** Semantic Search Engine for Arabic Text (Quran)

**Project Link:** [https://github.com/ahr9n/quranic-search-v2](https://github.com/ahr9n/quranic-search-v2)

**Tech Stack:** React.js, Django, Flask, Gensim (Word2Vec), SQLite

---

## Executive Summary

Quranic Search v2 is a web application that provides both lexical (keyword-based) and semantic (meaning-based) search capabilities for the Holy Quran. The project uses Natural Language Processing (NLP) techniques, specifically Word2Vec embeddings, to enable semantic search in Arabic text. The architecture consists of a React frontend, a Django API for lexical search, and a Flask API for semantic search.

---

## Project Structure

### Architecture Overview

```bash
                     → Lexical API (Django) → SQLite Database
Frontend (React.js) →
                     → Semantic API (Flask) → Word2Vec Models → Lexical API
```

### Components

1. **Frontend** (`frontend/`)
   - React.js application with React Router
   - Components: HomeForm, ResultsForm, Verse, Navbar
   - Containers: Home, Results, About, Bookmarks

2. **Lexical Search API** (`backend/api/lexical/`)
   - Django REST Framework
   - SQLite database with Quran verses
   - Endpoints for verse retrieval and keyword search

3. **Semantic Search API** (`backend/api/semantic/`)
   - Flask RESTful API
   - Word2Vec models (AraVec Twitter model)
   - Multiple similarity scoring methods (max, frequency, average, pooling)

---

## Code Quality Assessment

### Strengths

1. **Clear Separation of Concerns**
   - Frontend, lexical API, and semantic API are well-separated
   - Modular code structure with dedicated directories

2. **Comprehensive Documentation**
   - Detailed README with project overview
   - Code comments in semantic methods explaining algorithms
   - Directory structure documentation

3. **Multiple Search Methods**
   - Implements various similarity scoring approaches
   - Combines multiple models and methods for better results

4. **Modern Tech Stack**
   - React 18.2.0
   - Django REST Framework
   - Flask with RESTful resources

## Performance Considerations

1. **Model Loading**
   - Word2Vec models loaded at module import time
   - Models remain in memory for all requests
   - **Impact:** High memory usage, but good for response time

2. **Database Queries**
   - Django ORM used appropriately
   - No obvious N+1 query issues visible

3. **Frontend Optimization**
   - Uses React 18 (good)
   - No obvious code splitting or lazy loading visible

---

## Implementation Issues

### Unused Model References

```python
# backend/api/semantic/src/models/semantic_methods.py
for model in [
    (model_wiki, "WIKI"),      # ❌ Commented out
    (model_tw, "TWITTER"),      # ✓ Active
    (model_ksucca, "KSUCCA"),  # ❌ Commented out
    (model_fasttext, "FASTTEXT"), # ❌ Commented out
]:
```

## Conclusion

Quranic Search v2 is a well-structured project with a clear purpose and good separation of concerns. The semantic search implementation using Word2Vec is interesting and appropriate for the use case. However, there are several issues that need to be addressed, particularly around dependency management, Python version requirements, and error handling.


## Reviewer Notes Section

1. After isntalling all dependencies, and fixing any conflects with the dependencies, the project worked successfully.
   > The model is not included in the repository, so you will download it as part of the project setup and it is very large (about 1.2GB).
2. Tested both lexical and semantic search, and they worked successfully.
3. For the lexical search, the results were as expected.
4. For the semantic search, the results were not that accurate. The top results are more related to the query, but after that, the results diverge exponentially from the query.
