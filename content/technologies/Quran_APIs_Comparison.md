# Quran APIs Comparison Matrix

This document provides a detailed comparison of popular Quran APIs to help developers choose the right tool for their needs.

| API Name | Rate Limits | Features | Data Formats | Authentication | Documentation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Quran.com API (V4)** | Unspecified / Open (Fair Usage) | • Quran Text (Uthmani, Indopak, etc.)<br>• Translations (100+)<br>• Tafsirs<br>• Audio Recitations<br>• Word-by-word Analysis<br>• Advanced Search | JSON | None required (Open).<br>OAuth2 available for user data sync. | [Docs](https://api-docs.quran.com/) |
| **Al Quran Cloud** | ~10 req/sec<br>Cumulative: 70 req/7 sec | • Quran Text & Editions<br>• Audio (Surah & Ayah)<br>• Metadata (Juz, Hizb, Sajda)<br>• Tajweed Images<br>• Audio styling | JSON | None required. | [Docs](https://alquran.cloud/api) |
| **QuranEnc** | Tier-based limits | • Verified Translations (Primary capability)<br>• Browse by Surah/Ayah/Page<br>• Tafsir | JSON | **API Key Required** (v2) | [Docs](https://quranenc.com/en/home#api) |
| **Alfanous** | Unspecified / Self-hosted options | • **Advanced Semantic Search**<br>• Search by root, pattern, derivatives<br>• Linguistic Analysis | JSON | None (for public instance). | [Docs](https://www.alfanous.org/api/) |
| **EveryAyah** | Unspecified (Fair Usage) | • **Audio Focus** (Verse-by-verse)<br>• Wide range of reciters (30+)<br>• Ayah splitting | JSON, MP3 | None. | [Docs](https://everyayah.com/) |
| **QuranHub** | Unspecified (High performance via Cloudflare) | • Fast response times<br>• Quran Text<br>• Translations | JSON | None. | [Docs](https://github.com/misraj-ai/quranhub) |

## Summary & Recommendations

- **For General App Development**: **Quran.com API** or **Al Quran Cloud** offer the most comprehensive feature sets (text, audio, translations).
- **For Semantic Search**: **Alfanous** is the clear leader for linguistic and topic-based search.
- **For Audio Apps**: **EveryAyah** provides granular audio control (ayah-by-ayah).
- **For Verified Translations**: **QuranEnc** is the authoritative source for approved translations.
