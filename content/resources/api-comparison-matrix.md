---
title: "API Comparison Matrix"
arTitle: "مصفوفة مقارنة واجهات البرمجة"
group: "resources"
language: "en"
---

# Quran API Comparison Matrix

A comprehensive comparison of publicly available Quran APIs and data services to help developers choose the right provider for their applications. This document covers REST APIs, download-based services, audio-specific providers, and data packages available within the Quranic technology ecosystem.

## Table of Contents

- [Overview](#overview)
- [Quick Reference Summary](#quick-reference-summary)
- [Content APIs](#content-apis)
  - [Core Features](#core-features)
  - [Technical Specifications](#technical-specifications)
  - [Data Access Patterns](#data-access-patterns)
  - [User and Social Features](#user-and-social-features)
- [Audio APIs and Services](#audio-apis-and-services)
- [Search APIs](#search-apis)
- [Data Packages and Static Sources](#data-packages-and-static-sources)
- [Detailed API Profiles](#detailed-api-profiles)
- [Choosing the Right API](#choosing-the-right-api)
- [Production Considerations](#production-considerations)

## Overview

The Quranic developer ecosystem includes several categories of APIs and data services:

- **Full-featured content APIs** that provide text, translations, audio, and search through REST endpoints (Quran.com API, Al Quran Cloud, QUL)
- **Specialized content services** focused on translations (QuranEnc) or verified text accuracy (Tanzil)
- **Audio-focused services** providing recitations at various granularities (EveryAyah, MP3Quran, QuranicAudio)
- **Search engines** offering full-text and semantic search (Kalimat, alfanous)
- **Static data packages** for offline and embedded use (quran-json, Quran-API)

Each service differs in scope, authentication requirements, rate limits, data formats, and licensing. This matrix provides a side-by-side view across all of these dimensions.

## Quick Reference Summary

| Service | Type | Auth Required | Primary Use Case | Open Source |
|---------|------|:---:|------------------|:---:|
| [Quran.com API](#qurancom-api--quranfoundation) | REST API | Optional | Full-featured Quran apps | Yes |
| [Al Quran Cloud](#al-quran-cloud) | REST API | No | Simple text and audio integration | Partial |
| [QUL (Tarteel)](#qul-tarteel) | REST API | Yes (API key) | Script, recitations, tafsir, glyphs | Yes |
| [QuranEnc](#quranenc) | REST API | No | Multi-language translations and tafsir | No |
| [Tanzil](#tanzil) | Download | No | Verified Quran text for offline use | No |
| [EveryAyah](#everyayah) | File-based | No | Verse-by-verse audio and images | No |
| [MP3Quran](#mp3quran) | REST API | No | Full surah audio recitations | No |
| [QuranicAudio](#quranicaudio) | REST API | No | Full surah audio recitations | Yes |
| [quran-json](#quran-json) | NPM/CDN | No | Embedded JSON data for apps | Yes |
| [Quran-API](#quran-api-fawazahmed0) | REST/CDN | No | Translations via CDN | Yes |
| [quran-api (rzkytmgr)](#quran-api-rzkytmgr) | REST API | No | Surah and ayah audio | Yes |
| [Kalimat](#kalimat) | REST API | No | Full-text Quran search | No |
| [Quran Hub API](#quran-hub-api) | REST API | Yes | Semantic search | Yes |

## Content APIs

### Core Features

| Feature | [Quran.com API](./quran.com-api.md) | Al Quran Cloud | [QUL](https://qul.tarteel.ai/) | [QuranEnc](./QuranEnc.md) | [Tanzil](./tanzil.md) |
|---------|:---:|:---:|:---:|:---:|:---:|
| **Verse Text (Arabic)** | Yes | Yes | Yes | Yes | Yes |
| **Uthmani Script** | Yes | Yes | Yes | No | Yes |
| **Simple/Imlaei Script** | Yes | Yes | Yes | No | Yes |
| **IndoPak Script** | Yes | No | Yes | No | No |
| **Translations** | Yes (100+) | Yes (70+) | Yes | Yes (100+) | Yes (40+) |
| **Tafsir** | Yes | No | Yes | Yes | No |
| **Audio Recitations** | Yes | Yes | Yes | No | No |
| **Word-by-Word** | Yes | No | Yes | No | No |
| **Transliteration** | Yes | Yes | Yes | No | No |
| **Search** | Yes | Yes | No | Yes | No |
| **Juz/Hizb/Manzil** | Yes | Yes | Yes | No | No |
| **Mushaf Layouts** | Yes | No | Yes | No | No |
| **Fonts/Glyphs** | Yes | No | Yes | No | Yes |
| **Metadata** | Yes | Yes | Yes | Partial | Yes |

### Technical Specifications

| Specification | [Quran.com API](./quran.com-api.md) | Al Quran Cloud | [QUL](https://qul.tarteel.ai/) | [QuranEnc](./QuranEnc.md) | [Tanzil](./tanzil.md) |
|---------------|:---:|:---:|:---:|:---:|:---:|
| **API Type** | REST | REST | REST | REST | Download |
| **Base URL** | `api.quran.com/api/v4` | `api.alquran.cloud/v1` | `qul.tarteel.ai` | `quranenc.com` | `tanzil.net/download` |
| **Response Format** | JSON | JSON | JSON | JSON, CSV, XLS, XML, PDF | XML, Text, SQL |
| **Authentication** | Optional (OAuth2) | None | API key required | None | N/A |
| **Rate Limiting** | Yes (unspecified) | Yes (30 req/min free) | Yes (unspecified) | Unknown | N/A |
| **API Key Required** | No (public endpoints) | No | Yes | No | N/A |
| **HTTPS** | Yes | Yes | Yes | Yes | Yes |
| **CORS Support** | Yes | Yes | Yes | Yes | N/A |
| **API Version** | v4 | v1 | v1 | v1 | N/A |
| **OpenAPI/Swagger Docs** | Yes | No | No | No | N/A |
| **Documentation Quality** | Extensive | Good | Good | Moderate | Minimal |
| **Source Code** | [Ruby](https://github.com/quran/quran.com-api) | N/A | [Ruby](https://github.com/quran/qul-api) | N/A | N/A |
| **Programming Language** | Ruby | PHP | Ruby | N/A | N/A |

### Data Access Patterns

| Pattern | [Quran.com API](./quran.com-api.md) | Al Quran Cloud | [QUL](https://qul.tarteel.ai/) | [QuranEnc](./QuranEnc.md) | [Tanzil](./tanzil.md) |
|---------|:---:|:---:|:---:|:---:|:---:|
| **By Chapter (Surah)** | Yes | Yes | Yes | Yes | Yes |
| **By Verse (Ayah)** | Yes | Yes | Yes | Yes | Yes |
| **By Page** | Yes | Yes | Yes | No | No |
| **By Juz** | Yes | Yes | Yes | No | No |
| **By Hizb** | Yes | Yes | Yes | No | No |
| **By Rub al-Hizb** | Yes | Yes | No | No | No |
| **By Manzil** | Yes | Yes | No | No | No |
| **Range Queries** | Yes | Yes | Yes | No | No |
| **Bulk Download** | No | Yes | No | Yes | Yes |
| **Pagination** | Yes | Yes | Yes | Yes | N/A |
| **Multiple Narrations** | Partial | No | Yes | No | Yes |

### User and Social Features

These features require authenticated access and are only available through APIs that support user accounts.

| Feature | [Quran.com API](./quran.com-api.md) | Al Quran Cloud | [QUL](https://qul.tarteel.ai/) | [QuranEnc](./QuranEnc.md) | [Tanzil](./tanzil.md) |
|---------|:---:|:---:|:---:|:---:|:---:|
| **Bookmarks** | Yes | No | No | No | No |
| **Reading Progress** | Yes | No | No | No | No |
| **Notes** | Yes | No | No | No | No |
| **Reflections** | Yes | No | No | No | No |
| **Streaks** | Yes | No | No | No | No |
| **Cross-App Sync** | Yes | No | No | No | No |

## Audio APIs and Services

| Feature | [Quran.com API](./quran.com-api.md) | Al Quran Cloud | [EveryAyah](https://everyayah.com/) | [MP3Quran](https://mp3quran.net/) | [QuranicAudio](https://github.com/quran/audio.quran.com) | [QUL](https://qul.tarteel.ai/) |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| **Full Surah Audio** | Yes | Yes | No | Yes | Yes | Yes |
| **Verse-by-Verse Audio** | Yes | Yes | Yes | No | No | Yes |
| **Word-Level Timestamps** | Yes | No | No | No | No | Yes |
| **Multiple Reciters** | Yes (100+) | Yes (30+) | Yes (200+) | Yes (400+) | Yes (40+) | Yes |
| **Recitation Styles** | Murattal, Muallim | Murattal | Murattal | Murattal, Mujawwad | Murattal | Murattal |
| **Audio Format** | MP3 | MP3 | MP3 | MP3 | MP3 | MP3 |
| **Ayah Images** | No | No | Yes (PNG, JPG) | No | No | No |
| **API Type** | REST | REST | Direct file URLs | REST | REST | REST |
| **Auth Required** | No | No | No | No | No | Yes |
| **Multiple Narrations** | Partial | No | Partial | Yes | No | Yes |
| **Gapless Audio** | Yes | No | No | Yes | Yes | No |

## Search APIs

| Feature | [Quran.com API](./quran.com-api.md) | Al Quran Cloud | [Kalimat](https://kalimat.dev/) | [alfanous](../technologies/alfanous.md) | [Quran Hub API](https://github.com/misraj-ai/quranhub) |
|---------|:---:|:---:|:---:|:---:|:---:|
| **Search Type** | Full-text + Semantic | Full-text | Full-text | Semantic | Semantic |
| **Arabic Search** | Yes | Yes | Yes | Yes | Yes |
| **English Search** | Yes | Yes | Unstable | Yes | Unknown |
| **Root-Based Search** | Yes | No | No | Yes | Unknown |
| **Semantic/Meaning Search** | Yes (via Kalimat) | No | No | Yes | Yes |
| **Multi-Language Search** | Partial | Partial | Partial | Partial | Unknown |
| **API Type** | REST | REST | REST | REST / SDK | REST |
| **Auth Required** | No | No | No | No | Yes |
| **Open Source** | Yes | No | No | Yes | Yes |
| **Production Stability** | Stable | Stable | Intermittent issues | Stable | Not tested |

> **Note on Kalimat**: As of late 2025, Kalimat's search API has been observed returning 500 errors for non-Arabic queries. Arabic search remains functional. See the [development guidelines](../../docs/development-guidelines.md) for details.

## Data Packages and Static Sources

These are not traditional REST APIs but provide Quranic data as downloadable files or packages suitable for offline and embedded applications.

| Feature | [Tanzil](./tanzil.md) | [quran-json](./quran-json.md) | [Quran-API](https://quranapi.pages.dev/) | [quran-api (rzkytmgr)](https://github.com/rzkytmgr/quran-api) |
|---------|:---:|:---:|:---:|:---:|
| **Distribution** | Direct download | NPM + CDN | CDN + REST | REST API |
| **Formats** | XML, Text, SQL | JSON | JSON | JSON |
| **Quran Text** | Yes | Yes | Yes | Yes |
| **Translations** | Yes (40+ languages) | Yes (12 languages) | Yes (multi-language) | No |
| **Transliteration** | No | Yes | No | No |
| **Audio** | No | No | No | Yes |
| **Offline Ready** | Yes (files) | Yes (NPM package) | Yes (CDN cacheable) | No |
| **Granularity** | Full Quran, by chapter | Full Quran, by chapter, by verse | By chapter, by verse | By chapter, by verse |
| **Open Source** | No | Yes ([CC-BY-SA 4.0](https://github.com/risan/quran-json)) | Yes | Yes |
| **Programming Language** | N/A | JavaScript | Python | JavaScript |
| **CDN Available** | No | Yes (jsDelivr) | Yes (Cloudflare Pages) | No |
| **NPM Package** | No | Yes | No | No |

## Detailed API Profiles

### Quran.com API / Quran.Foundation

- **Base URL**: `https://api.quran.com/api/v4`
- **Documentation**: [api-docs.quran.foundation](https://api-docs.quran.foundation/docs/category/content-apis/)
- **Source Code**: [github.com/quran/quran.com-api](https://github.com/quran/quran.com-api) (Ruby)
- **RATQ Resource Page**: [quran.com-api](./quran.com-api.md)
- **Best for**: Full-featured Quran apps needing audio, translations, word-by-word, and user sync
- **Rate Limits**: Rate-limited; recommended to cache responses
- **Key Strengths**: The most comprehensive Quran API available. Supports both public content and authenticated user features (bookmarks, progress, notes, reflections, streaks). Powers the official Quran.com website and mobile apps. Includes semantic search via [Kalimat](../technologies/Kalimat.md) integration with Elasticsearch.
- **Limitations**: No bulk download option; source data is only available to contributors through their Slack channel. Rate limit details are not publicly documented.

### Al Quran Cloud

- **Base URL**: `https://api.alquran.cloud/v1`
- **Documentation**: [alquran.cloud/api](https://alquran.cloud/api)
- **Best for**: Simple integrations needing text and audio without authentication
- **Rate Limits**: 30 requests/minute (free tier)
- **Key Strengths**: Simple and straightforward REST API. No authentication needed. Good for small projects, prototyping, and learning. Includes audio recitations from multiple reciters. Supports bulk data download.
- **Limitations**: No tafsir, no word-by-word data, no user features. Limited documentation compared to Quran.com API. Signup required for API key.

### QUL (Tarteel)

- **Base URL**: `https://qul.tarteel.ai`
- **Documentation**: [qul.tarteel.ai](https://qul.tarteel.ai/)
- **Source Code**: [github.com/quran/qul-api](https://github.com/quran/qul-api) (Ruby)
- **Best for**: Applications needing script variants, recitations, tafsir, translations, fonts, glyphs, and mushaf layouts
- **Rate Limits**: Rate-limited; API key required
- **Key Strengths**: Rich set of resources including mushaf layouts, Quranic fonts, glyph data, multiple script variants, and multiple narrations (rewayat). Provides resources for script, recitation, tafsir, translation, and layout in a unified interface.
- **Limitations**: Requires signup and API key for access. Relatively new compared to other APIs.

### QuranEnc

- **URL**: [quranenc.com](https://quranenc.com/)
- **Documentation**: [quranenc.com/api](https://quranenc.com/en/home/api)
- **RATQ Resource Page**: [QuranEnc](./QuranEnc.md)
- **Best for**: Applications focused on translations and tafsir in many world languages
- **Key Strengths**: The widest translation coverage (100+ languages) from verified, trustworthy translators. Provides data in multiple formats (API, CSV, XLS, XML, PDF). Supervised by Islamic University of Madinah. Also available as Android and iOS apps.
- **Limitations**: No audio, no Uthmani/Simple script options, no advanced access patterns (page, juz, hizb). Limited API documentation.

### Tanzil

- **URL**: [tanzil.net](https://tanzil.net/)
- **RATQ Resource Page**: [Tanzil](./tanzil.md)
- **Access**: Download-based (XML, plain text, SQL dump)
- **Best for**: Offline applications requiring the highest text accuracy
- **Key Strengths**: The gold standard for Unicode Quran text accuracy. Manually verified against the Medina Mushaf. Available in multiple scripts (Uthmani, Simple, Simple Clean, Simple Enhanced). Includes pause marks, diacritics options. Provides translations in 40+ languages and Quranic fonts.
- **Limitations**: Not a REST API; requires downloading files. No audio. No search functionality. Minimal developer documentation. Source code is not available.

### EveryAyah

- **URL**: [everyayah.com](https://everyayah.com/)
- **Best for**: Applications needing verse-by-verse audio files and ayah images
- **Key Strengths**: Vast collection of reciters (200+). Provides both audio (MP3) and images (PNG, JPG) per ayah. Direct file URL access with predictable patterns. No authentication required.
- **Limitations**: No REST API; file-based access only. No search, translations, or structured metadata. No official documentation. No rate limit information.

### MP3Quran

- **URL**: [mp3quran.net](https://mp3quran.net/)
- **Documentation**: [mp3quran.net/api](https://www.mp3quran.net/eng/api)
- **Best for**: Applications focused on full surah audio with the widest reciter selection
- **Key Strengths**: Largest collection of reciters (400+). Supports multiple narrations and recitation styles (murattal, mujawwad). Provides gapless audio playback. REST API for programmatic access.
- **Limitations**: Audio only; no text, translations, or search. No verse-by-verse segmentation. Limited documentation.

### QuranicAudio

- **URL**: [audio.quran.com](https://audio.quran.com/)
- **Source Code**: [github.com/quran/audio.quran.com](https://github.com/quran/audio.quran.com) (JavaScript)
- **Best for**: Simple audio integration for surah-level recitations
- **Key Strengths**: Open source. Simple interface. Gapless audio support. Part of the Quran.com ecosystem.
- **Limitations**: Very minimal documentation. Limited reciter selection compared to EveryAyah and MP3Quran. No verse-level audio.

### quran-json

- **URL**: [github.com/risan/quran-json](https://github.com/risan/quran-json)
- **RATQ Resource Page**: [quran-json](./quran-json.md)
- **Best for**: Web and Node.js applications needing embedded Quran data
- **Key Strengths**: Available as NPM package and via CDN (jsDelivr). JSON format at multiple granularities (full Quran, by chapter, by verse). Includes transliteration. Multiple language translations. Open source (CC-BY-SA 4.0). Data sourced from [QuranEnc](./QuranEnc.md) and [Tanzil](./tanzil.md).
- **Limitations**: Static data only; no audio, search, or user features. Limited to 12 language translations.

### Quran-API (fawazahmed0)

- **URL**: [quranapi.pages.dev](https://quranapi.pages.dev/)
- **Source Code**: [github.com/fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api) (Python)
- **Best for**: Multi-language translation access via CDN
- **Key Strengths**: Hosted on Cloudflare Pages for reliable CDN access. Multiple language translations. Good documentation. Open source.
- **Limitations**: Translation-focused; limited Quran text features. No audio. No search.

### quran-api (rzkytmgr)

- **URL**: [github.com/rzkytmgr/quran-api](https://github.com/rzkytmgr/quran-api)
- **Best for**: Simple surah and ayah audio integration
- **Key Strengths**: Simple REST API for surah and ayah audio. Open source (JavaScript). Good documentation.
- **Limitations**: Limited feature set. Small community.

### Kalimat

- **URL**: [kalimat.dev](https://www.kalimat.dev/)
- **Best for**: Full-text Quran search integration
- **Key Strengths**: Dedicated Quran search engine. REST API. No authentication required.
- **Limitations**: Intermittent stability issues (500 errors for non-Arabic queries as of late 2025). Not open source. Very minimal documentation. Sometimes inaccurate results for certain Arabic queries.

### Quran Hub API

- **URL**: [github.com/misraj-ai/quranhub](https://github.com/misraj-ai/quranhub)
- **Best for**: Semantic/AI-powered Quran search
- **Key Strengths**: Semantic search capabilities. Open source (Python). Also available as an MCP server for AI agent integration.
- **Limitations**: Requires signup. Not independently tested for production readiness. Small community. Limited documentation.

## Choosing the Right API

### By Use Case

**"I need a complete backend for a Quran app"**
Use [Quran.com API](#qurancom-api--quranfoundation). It is the most comprehensive API, covering text, translations, audio, search, word-by-word, and user features (bookmarks, progress, notes). It powers the official Quran.com apps.

**"I need a simple API for prototyping or a small project"**
Use [Al Quran Cloud](#al-quran-cloud). It requires no authentication, has straightforward endpoints, and provides both text and audio. The 30 req/min free tier is sufficient for development and small deployments.

**"I need the most accurate Quran text for offline use"**
Use [Tanzil](#tanzil). It is the gold standard for text accuracy, manually verified against the Medina Mushaf. Download files in your preferred format (XML, text, SQL) and embed them in your application.

**"I need translations in as many languages as possible"**
Use [QuranEnc](#quranenc) for the widest translation coverage (100+ languages), or [Quran.com API](#qurancom-api--quranfoundation) which also supports 100+ translations with additional features.

**"I need verse-by-verse audio with many reciters"**
Use [EveryAyah](#everyayah) for verse-level audio files from 200+ reciters. For surah-level audio with the largest reciter collection, use [MP3Quran](#mp3quran) (400+ reciters).

**"I need word-level audio timestamps for highlighting"**
Use [Quran.com API](#qurancom-api--quranfoundation) or [QUL](#qul-tarteel). Both provide word-level timing data for synchronized text highlighting during audio playback.

**"I need Quran data as a static JSON package"**
Use [quran-json](#quran-json) via NPM or CDN. It provides JSON data at chapter and verse granularity with transliteration and translations, requiring no API calls at runtime.

**"I need mushaf layouts, fonts, and glyph data"**
Use [QUL](#qul-tarteel). It provides mushaf page layouts, Quranic fonts, and glyph mapping data for building faithful mushaf renderings.

**"I need semantic/meaning-based search"**
Use [Quran.com API](#qurancom-api--quranfoundation) (which integrates Kalimat for semantic search) or [alfanous](../technologies/alfanous.md) for root-based and semantic search. [Quran Hub API](#quran-hub-api) is also an option but has not been independently tested.

**"I need to integrate Quran data into an AI agent"**
Use [Quran Hub MCP](https://qurani.ai/en/docs/mcp) which provides Quran search as an MCP (Model Context Protocol) server for AI agent integration.

### By Technical Requirements

| Requirement | Recommended API |
|-------------|-----------------|
| No authentication needed | Al Quran Cloud, QuranEnc, EveryAyah, quran-json |
| OpenAPI/Swagger documentation | Quran.com API |
| Open source backend | Quran.com API, QUL, QuranicAudio, quran-json |
| Bulk data download | Tanzil, Al Quran Cloud, QuranEnc, quran-json |
| CDN-hosted static data | quran-json (jsDelivr), Quran-API (Cloudflare Pages) |
| Multiple response formats | QuranEnc (JSON, CSV, XLS, XML, PDF), Tanzil (XML, Text, SQL) |
| Mobile SDK | quran-sdk ([Android/iOS](https://github.com/TazkiyaTech/quran-sdk)) |
| User accounts and sync | Quran.com API (OAuth2) |

## Production Considerations

### Caching Strategy

All REST APIs recommend caching responses. Quran text and translations change infrequently, so aggressive caching is appropriate. Consider local database caching on first load, with periodic refresh checks.

### Rate Limiting

Plan for rate limits in production. Al Quran Cloud enforces 30 requests/minute on the free tier. Other APIs do not publicly document their limits but do enforce them. Use exponential backoff, request queuing, and local caching to stay within limits.

### Offline Support

For offline-capable apps, consider:
- [Tanzil](#tanzil) for pre-verified downloadable text files
- [quran-json](#quran-json) for bundled NPM packages
- [EveryAyah](#everyayah) for downloadable audio files
- Any REST API responses cached locally on first load

### Data Accuracy

Translation quality varies between providers. [QuranEnc](#quranenc) translations are supervised by the Islamic University of Madinah. [Tanzil](#tanzil) text is verified against the Medina Mushaf with checksums. Always verify the accuracy and recency of translations, as they are updated over time to correct errors. See the [development guidelines](../../docs/development-guidelines.md) for more details on handling translation accuracy.

### Attribution and Licensing

Check each API's terms of service for attribution requirements before deploying. Some services are open source with permissive licenses ([quran-json](./quran-json.md) uses CC-BY-SA 4.0), while others may have specific usage terms. Always review and comply with licensing requirements.

### Fallback Strategy

Consider using multiple APIs as fallbacks to improve reliability:
- **Primary**: Quran.com API for full functionality
- **Text fallback**: Al Quran Cloud or cached Tanzil data
- **Audio fallback**: EveryAyah or MP3Quran
- **Translation fallback**: QuranEnc

### Monitoring and Error Handling

Some services have experienced intermittent availability issues (notably [Kalimat](#kalimat) for non-Arabic queries). Implement health checks, circuit breakers, and graceful degradation in production applications.
