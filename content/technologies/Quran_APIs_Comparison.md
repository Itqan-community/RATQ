# Quran APIs Comparison Matrix

This document provides a detailed comparison of popular Quran APIs to help developers choose the right tool for their needs.

| API Name | Rate Limits | Features | Data Formats | Authentication | Documentation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Quran.com API (V4)** | None required (Open) | • Quran Text (Uthmani, Indopak, etc.)<br>• Audio Recitations<br>• Translations & Tafsirs (+100)<br>• Morphology (Word-by-word)<br>• Advanced Search | JSON | OAuth2 Client Credentials required for Content APIs. | [Docs](https://api-docs.quran.foundation/) |
| **Al Quran Cloud** | ~10 req/sec<br>Cumulative: 70 req/7 sec | • Quran Text & Editions<br>• Audio (Surah & Ayah)<br>• Metadata (Juz, Hizb, Sajda)<br>• Tajweed Images<br>• Audio styling | JSON | None required. | [Docs](https://alquran.cloud/api) |
| **QuranEnc** | Tier-based limits | • Verified Translations (Primary capability)<br>• Browse by Surah/Ayah/Page<br>• Tafsir | JSON | **API Key Required** (v2) | [Docs](https://quranenc.com/en/home#api) |
| **Alfanous** | Unspecified / Self-hosted options | • **Advanced Semantic Search**<br>• Search by root, pattern, derivatives<br>• Linguistic Analysis | JSON | None (for public instance). | [Docs](https://www.alfanous.org/api/) |
| **EveryAyah** | Unspecified (Fair Usage) | • **Massive Audio Library** (Verse-by-verse)<br>• 30+ Reciters available<br>• Audio segmentation | JSON, MP3 | None. | [Docs](https://everyayah.com/data/status.php) |
| **QuranHub** | Unspecified (High performance via Cloudflare) | • Fast response times<br>• Quran Text<br>• Translations | JSON | None. | [Docs](https://github.com/misraj-ai/quranhub) |

## Summary & Recommendations

- **General App Development:** **Quran.com API** and **Al Quran Cloud** are the top choices due to their comprehensive data (text, audio, translations) and stability.
- **Semantic Search Use Cases:** **Alfanous** is the undisputed leader for applications requiring deep linguistic analysis and root-based search.
- **Audio-Focused Apps:** **EveryAyah** provides excellent flexibility for verse-level audio handling, making it ideal for memorization apps.
- **For Verified Translations**: **QuranEnc** is the authoritative source for approved translations.
