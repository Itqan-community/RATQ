# Quran API Comparison Matrix

This document provides a side-by-side comparison of the major Quran APIs and data resources available to developers. It covers authentication, rate limits, data formats, and feature availability to help developers choose the right provider for their project.

For detailed information about each provider, see the individual resource pages linked in the table below.

This matrix focuses on APIs and data resources that provide Quran content (text, audio, translations, tafsir). Search-only engines and analysis tools (such as alfaNous, Quran Hub API, quranic-search-v2) are covered in the [Technologies Overview](../technologies/Technologies.md).

## How to Use This Matrix

- **Type**: Whether the provider offers a live REST API, static file downloads, an SDK/package, or a combination.
- **Authentication**: Whether signup, an API key, or no authentication is needed.
- **Rate Limits**: Published rate limit policies. "Not published" means the provider does not document rate limits.
- **Data Format**: The response or download formats available.
- **Feature columns**: Whether the provider offers Quran text, translations, audio recitations, tafsir (exegesis), word-level data, and search capabilities.
- **License**: The licensing terms for using the API or data. "Proprietary" means the provider controls terms of use; "Free" means free to use without a formal open license; specific licenses (e.g. CC-BY-SA 4.0) are noted where published.

## Comparison Table

| Provider | Type | Auth | Rate Limits | Data Format | Quran Text | Translations | Audio | Tafsir | Word-Level | Search | License |
|----------|------|------|-------------|-------------|------------|-------------|-------|--------|------------|--------|---------|
| [Quran.com API](./quran.com-api.md) | REST API | API key (free, request via Slack) | Not published | JSON | Yes | Yes (100+) | Yes (verse-level + word timestamps) | Yes | Yes | Yes (Elasticsearch + Kalimat) | Proprietary (free access) |
| [QuranEnc](./QuranEnc.md) | REST API | None | Not published | JSON, CSV, XLS, XML, PDF | No | Yes (79+ languages, 100+ translations) | No | No | No | No | Free (King Fahd Complex) |
| [Tanzil](./tanzil.md) | Static downloads | None | N/A (static files) | TXT, XML, SQL | Yes (Uthmani + Imlaei) | Yes (40 languages) | No (links to everyayah) | No | No | No | Free |
| [quran-json](./quran-json.md) | npm package / CDN | None | N/A (CDN) | JSON | Yes | Yes (~11 languages) | No | No | No | No | CC-BY-SA 4.0 |
| [alquran.cloud](https://alquran.cloud/) | REST API | None | Not published | JSON | Yes | Yes (multiple) | Yes (verse-level) | No | No | Yes (text editions) | Free |
| [QUL (Tarteel)](https://qul.tarteel.ai/) | REST API | API key (signup required) | Not published | JSON | Yes | Yes (193 translations) | Yes (with timestamps) | Yes (114 tafsirs) | Yes | Yes | Free (open source) |
| [everyayah](https://www.everyayah.com/) | Static downloads | None | N/A (static files) | MP3, JPG, PNG, XML, JS | No | No | Yes (verse-level + page-level) | No | No | No | Free |
| [Quran-API](https://quranapi.pages.dev/) | REST API | None | No rate limit (advertised) | JSON | Yes | Yes | No | Yes (full surah tafsir) | No | No | Free |
| [quran-api (rzkytmgr)](https://github.com/rzkytmgr/quran-api) | REST API | None | Not published | JSON | Yes | No | Yes (full surah + ayah) | No | No | No | Open source |
| [QuranicAudio](https://github.com/quran/audio.quran.com) | Web app + API | None | Not published | JSON, MP3 | No | No | Yes (full surah) | No | No | No | Open source |

## Feature Comparison Summary

### Best for Each Use Case

| Use Case | Recommended Provider | Why |
|----------|---------------------|-----|
| Full-featured Quran app | [Quran.com API](./quran.com-api.md) or [QUL](https://qul.tarteel.ai/) | Text + audio + translations + tafsir + search + word-level data |
| Translations only | [QuranEnc](./QuranEnc.md) | 79+ languages, multiple translators per language, multiple export formats |
| Static Quran text for offline apps | [Tanzil](./tanzil.md) | Highly verified text in Uthmani and Imlaei scripts, SQL/XML/TXT downloads |
| Quick JSON integration | [quran-json](./quran-json.md) or [alquran.cloud](https://alquran.cloud/) | No auth needed, CDN/API access, JSON format |
| Audio recitations | [everyayah](https://www.everyayah.com/) or [Quran.com API](./quran.com-api.md) | everyayah for static MP3 downloads; Quran.com for API with timestamps |
| Tafsir / exegesis | [QUL](https://qul.tarteel.ai/) or [Quran.com API](./quran.com-api.md) | QUL has 114 tafsirs; Quran.com has multiple tafsir resources |
| No authentication needed | [QuranEnc](./QuranEnc.md), [Tanzil](./tanzil.md), [alquran.cloud](https://alquran.cloud/), [quran-json](./quran-json.md) | All free with no signup |

## Detailed Notes

### Quran.com API (Quran Foundation)

- The most comprehensive Quran API available, powering quran.com and QuranReflect.
- API key is free but must be requested through their Slack channel.
- Source data dumps are not publicly available; only contributors can request a mini dump through Slack.
- Backend is written in Ruby. Source code: [quran/quran.com-api](https://github.com/quran/quran.com-api).
- Search uses a hybrid Elasticsearch + [Kalimat](../technologies/Kalimat.md) architecture for both keyword and semantic search.
- Provides word-level audio timestamps via the Audio SDK.
- User-related APIs (bookmarks, notes, reading history) require OAuth2.

### QuranEnc

- Operated by the King Fahd Glorious Quran Printing Complex.
- The API focuses exclusively on translations — it does not expose standalone Quran text endpoints or audio. Note: the QuranEnc website displays Quran text alongside translations in its browser interface, and other projects (e.g. quran-json) source their Arabic text data from QuranEnc, but the public API endpoints serve translations only.
- Translations are reviewed by specialized bodies and considered highly reliable.
- Available in multiple export formats (API, CSV, XLS, XML, PDF), making it flexible for different use cases.
- Provides mobile apps (Android + iOS) and a PWA.

### Tanzil

- Not a live API — provides static file downloads only.
- The most trusted source for verified Unicode Quran text. Many other projects source their transliterations and translations from Tanzil.
- Provides text in multiple scripts (Uthmani, Imlaei) with options for diacritics, pause marks, and tanween shapes.
- Translations available in 40 languages in TXT, XML, and SQL dump formats.
- Does not provide its own audio but links to [everyayah](https://www.everyayah.com/) for verse-by-verse recitations.
- Not open source.

### quran-json

- A JavaScript npm package by [Risan Bagja Pradana](https://risanb.com) providing Quran text and translations in JSON format.
- Available via CDN (jsdelivr) for direct web usage — no server needed.
- Supports ~11 languages for translations. Arabic text sourced from [QuranEnc](./QuranEnc.md); transliteration and most translations sourced from [Tanzil](./tanzil.md).
- Licensed under CC-BY-SA 4.0.

### alquran.cloud

- Free REST API with no authentication required for content endpoints (verified: `api.alquran.cloud/v1/ayah/1` returns data without an API key). Note: the [Technologies Overview](../technologies/Technologies.md) lists this as requiring signup — the API itself does not require it for read access.
- Provides access to Quran text and audio through multiple structural divisions (Surah, Juz, Page, Hizb, Ruku, Manzil).
- Search is available but limited to text editions only.
- Supports gzip and zstd compression for responses.
- Multiple API domains available including a Russia-based alternative.

### QUL (Tarteel)

- Developed by the Tarteel AI team. Open source: [GitHub](https://github.com/quran/qul).
- The most feature-rich alternative to Quran.com API: 193 translations, 114 tafsirs, recitations with timestamps, mushaf layouts, fonts, morphology data.
- Requires signup for an API key.
- Relatively new (launched June 2024) but actively maintained.

### everyayah

- Provides static audio files (MP3) for every verse of the Quran.
- Also provides Quran images (JPG, PNG), text, timing files (XML), and JavaScript data.
- No API — files are accessed via direct URLs.
- No authentication or rate limits.
- Used by Tanzil as their audio source.

### Quran-API (quranapi.pages.dev)

- Free API with explicitly no rate limits.
- Written in Python.
- Provides Quran text, translations, and recently added full surah tafsir.
- No authentication required.

### quran-api (rzkytmgr)

- Open source REST API written in JavaScript.
- Provides full surah and ayah-level audio access.
- No authentication required.

### QuranicAudio

- Open source project by the Quran Foundation team.
- Primarily a web application frontend for audio.quran.com that also exposes API endpoints.
- Focused specifically on audio recitations (full surah level).
- Written in JavaScript. Source: [quran/audio.quran.com](https://github.com/quran/audio.quran.com).

## See Also

- [Technologies Overview](../technologies/Technologies.md) — Full list of Quranic technologies with additional metadata
- [Word-Level Audio Resources](./quranic-word-level-audio-resources.md) — Detailed comparison of word-level audio solutions
