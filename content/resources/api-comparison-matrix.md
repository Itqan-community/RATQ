# Quran API Comparison Matrix

A detailed comparison of publicly available Quran APIs to help developers choose the right provider for their applications.

## Table of Contents

- [Overview](#overview)
- [Comparison Matrix](#comparison-matrix)
- [Detailed API Profiles](#detailed-api-profiles)
- [Choosing an API](#choosing-an-api)

## Overview

Several organizations provide APIs for accessing Quranic content programmatically. Each API differs in scope, authentication requirements, rate limits, and supported data formats. This comparison matrix provides a side-by-side view to help developers evaluate their options.

## Comparison Matrix

### Core Features

| Feature | Quran.com API | Al Quran Cloud | Tanzil | QuranEnc | Quran.Foundation |
|---------|:---:|:---:|:---:|:---:|:---:|
| **Verse Text (Arabic)** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Uthmani Script** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Simple Script** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Translations** | ✅ (100+) | ✅ (70+) | ✅ (40+) | ✅ (100+) | ✅ (100+) |
| **Tafsir** | ✅ | ❌ | ❌ | ✅ | ✅ |
| **Audio Recitations** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Word-by-Word** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Search** | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Juz/Hizb/Manzil** | ✅ | ✅ | ❌ | ❌ | ✅ |

### Technical Specifications

| Specification | Quran.com API | Al Quran Cloud | Tanzil | QuranEnc | Quran.Foundation |
|---------------|:---:|:---:|:---:|:---:|:---:|
| **API Type** | REST | REST | Download | REST | REST |
| **Response Format** | JSON | JSON | XML/Text | JSON | JSON |
| **Authentication** | Optional (OAuth2) | None | N/A | None | Optional (OAuth2) |
| **Rate Limiting** | Yes | Yes (30/min free) | N/A | Unknown | Yes |
| **API Key Required** | No (public) | No (public) | N/A | No | No (public) |
| **HTTPS** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **CORS** | ✅ | ✅ | N/A | ✅ | ✅ |
| **Versioned API** | v4 | v1 | N/A | v1 | v4 |
| **OpenAPI/Swagger** | ✅ | ❌ | N/A | ❌ | ✅ |
| **Documentation** | Extensive | Good | Minimal | Moderate | Extensive |

### Data Access Patterns

| Pattern | Quran.com API | Al Quran Cloud | Tanzil | QuranEnc | Quran.Foundation |
|---------|:---:|:---:|:---:|:---:|:---:|
| **By Chapter** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **By Verse** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **By Page** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **By Juz** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **By Hizb** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Range Queries** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Bulk Download** | ❌ | ✅ | ✅ | ✅ | ❌ |
| **Pagination** | ✅ | ✅ | N/A | ✅ | ✅ |

### User & Social Features (Authenticated)

| Feature | Quran.com API | Al Quran Cloud | Tanzil | QuranEnc | Quran.Foundation |
|---------|:---:|:---:|:---:|:---:|:---:|
| **Bookmarks** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Reading Progress** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Notes** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Reflections** | ✅ | ❌ | ❌ | ❌ | ✅ |

## Detailed API Profiles

### Quran.com API / Quran.Foundation

- **Base URL**: `https://api.quran.com/api/v4`
- **Documentation**: [api-docs.quran.foundation](https://api-docs.quran.foundation/docs/category/content-apis/)
- **Source Code**: [github.com/quran/quran.com-api](https://github.com/quran/quran.com-api) (Ruby)
- **Best for**: Full-featured Quran apps needing audio, translations, word-by-word, and user sync
- **Rate Limits**: Rate-limited; recommended to cache responses
- **Notes**: The most comprehensive Quran API. Supports both public content and authenticated user features. Powers the official Quran.com website and mobile apps.

### Al Quran Cloud

- **Base URL**: `https://api.alquran.cloud/v1`
- **Documentation**: [alquran.cloud/api](https://alquran.cloud/api)
- **Source Code**: Open source data available
- **Best for**: Simple integrations needing text and audio without authentication
- **Rate Limits**: 30 requests/minute (free tier)
- **Notes**: Simple and straightforward API. Good for small projects and prototyping. Includes audio recitations from multiple reciters.

### Tanzil

- **URL**: [tanzil.net](https://tanzil.net/)
- **Access**: Download-based (XML, plain text files)
- **Best for**: Offline applications and verified Quran text
- **Notes**: Not a REST API. Provides highly verified Unicode Quran text files for download. The gold standard for text accuracy. Available in multiple scripts (Uthmani, Simple, Simple Clean, Simple Enhanced).

### QuranEnc

- **URL**: [quranenc.com](https://quranenc.com/)
- **Documentation**: [quranenc.com/api](https://quranenc.com/api)
- **Best for**: Translations and tafsir in many world languages
- **Notes**: Specializes in translations and exegeses. Covers 100+ languages. Managed by Madinah-based Islamic University. Also see the [QuranEnc resource page](./QuranEnc.md).

## Choosing an API

### Decision Guide

**"I need a full-featured Quran app backend"**
→ Use **Quran.com API** — most complete, supports audio/translations/user features

**"I need simple text and audio integration"**
→ Use **Al Quran Cloud** — simple REST API, no auth needed, good documentation

**"I need the most accurate Quran text for offline use"**
→ Use **Tanzil** — gold standard for text accuracy, downloadable files

**"I need translations in many languages"**
→ Use **QuranEnc** — 100+ language translations and tafsir

**"I need user sync (bookmarks, progress, notes)"**
→ Use **Quran.com API** with OAuth2 authentication

### Considerations for Production Apps

1. **Caching**: All REST APIs recommend caching responses. Quran text rarely changes, so aggressive caching is appropriate.
2. **Offline Support**: Consider downloading data for offline access. Tanzil provides ready-to-use files; other APIs can be cached on first load.
3. **Rate Limits**: Plan for rate limiting in production. Use exponential backoff and local caching.
4. **Attribution**: Check each API's terms of service for attribution requirements.
5. **Fallback Strategy**: Consider using multiple APIs as fallbacks (e.g., Al Quran Cloud as backup for Quran.com API).
