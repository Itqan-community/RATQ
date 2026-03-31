---
title: "Fonts & Typography"
arTitle: "الخطوط والطباعة"
group: "resources"
language: "en"
---

# Fonts & Typography for Quranic Applications

## Overview

Choosing the right font is one of the most critical decisions when developing a Quranic application. The Quran must be displayed with the highest level of accuracy — including correct letter forms, ligatures, diacritics (tashkeel), and positional shaping. A poorly chosen font can lead to rendering errors that distort the sacred text.

This guide covers the major Quranic font families, their sources, licensing, font formats, and practical guidance for developers integrating Arabic and Quranic typography into their applications.

## Table of Contents

- [Overview](#overview)
- [Understanding Quranic Script Types](#understanding-quranic-script-types)
- [Font Formats](#font-formats)
- [Major Quranic Font Families](#major-quranic-font-families)
- [General Arabic Fonts Suitable for Quranic Apps](#general-arabic-fonts-suitable-for-quranic-apps)
- [Font Sources and Downloads](#font-sources-and-downloads)
- [Licensing Guide](#licensing-guide)
- [Developer Integration Guide](#developer-integration-guide)
- [Common Pitfalls](#common-pitfalls)
- [Font Comparison Table](#font-comparison-table)
- [Additional Resources](#additional-resources)

## Understanding Quranic Script Types

Before selecting a font, it is important to understand the two primary script styles used for Quranic text:

### Uthmani Script (الرسم العثماني)

The Uthmani script follows the original orthography of the Quran as standardized during the era of Caliph Uthman ibn Affan. It preserves historical spelling conventions that differ from modern Arabic writing rules. For example:

- **الصلوة** instead of الصلاة (prayer)
- **الزكوة** instead of الزكاة (almsgiving)
- **بسطة** vs **بصطة** — variant spellings in different verses

Uthmani script requires specialized fonts that support these unique letter forms and ligatures. Not all Arabic fonts can render Uthmani text correctly.

### Imla'i Script (الرسم الإملائي)

Also called "Simple" or "Clean" script, the Imla'i style uses modern standard Arabic spelling rules. It is easier to search and index programmatically but does not match the traditional Mushaf layout.

### Which Script to Choose?

| Use Case | Recommended Script |
|----------|-------------------|
| Mushaf display (page-accurate rendering) | Uthmani |
| Search and indexing | Imla'i |
| General Quran reading apps | Uthmani (preferred) or Imla'i |
| Academic / linguistic analysis | Both — depending on research goals |
| Accessibility / simplified display | Imla'i |

## Font Formats

Understanding font file formats is important for cross-platform compatibility:

| Format | Extension | Best For | Notes |
|--------|-----------|----------|-------|
| TrueType | `.ttf` | Desktop & mobile apps | Widely supported, good for system-level installation |
| OpenType | `.otf` | Desktop & mobile apps | Supports advanced typographic features (ligatures, contextual alternates) |
| Web Open Font Format | `.woff` | Web applications | Compressed TTF/OTF for faster web loading |
| Web Open Font Format 2 | `.woff2` | Web applications | Better compression than WOFF, modern browser standard |
| Embedded OpenType | `.eot` | Legacy IE support | Rarely needed today |
| SVG Font | `.svg` | Older iOS Safari | Deprecated — avoid unless targeting very old devices |

**Recommendation**: For web applications, use `.woff2` with `.woff` fallback. For native mobile and desktop apps, use `.ttf` or `.otf`.

## Major Quranic Font Families

### 1. KFGQPC Fonts (King Fahd Glorious Quran Printing Complex)

The King Fahd Complex in Madinah is the world's largest Quran printing facility and the primary authority for Quranic typography. They produce and maintain several font families:

#### KFGQPC Uthmanic Script HAFS

- **Script**: Uthmani
- **Usage**: Displaying Quran text in the Hafs narration as printed in the Madinah Mushaf
- **Features**: Full tashkeel support, pause marks (علامات الوقف), sajda markers, juz/hizb markers
- **Source**: [qurancomplex.gov.sa/quran-dev](https://qurancomplex.gov.sa/quran-dev/)
- **License**: Free for Quranic usage (see [Licensing Guide](#licensing-guide))
- **Format**: TTF

#### KFGQPC Uthmanic Script Warsh / Qaloun / Shubah / Duri / Susi / Hesham

Each narration (riwayah) has its own font variant from the King Fahd Complex, matching the corresponding printed Mushaf edition.

- **Source**: [qurancomplex.gov.sa/quran-dev](https://qurancomplex.gov.sa/quran-dev/)
- **License**: Free for Quranic usage

#### KFGQPC Naskh Font

- **Script**: Naskh (modern Arabic)
- **Usage**: Tafsir text, translations, and supplementary content alongside Quranic text
- **Source**: [qurancomplex.gov.sa/quran-dev](https://qurancomplex.gov.sa/quran-dev/)

### 2. Amiri Font

- **Script**: Naskh (traditional book style)
- **Designer**: Khaled Hosny
- **Usage**: Classical Arabic typesetting, suitable for Tafsir and Islamic texts
- **Features**: Extensive OpenType features, full tashkeel, Quranic symbols
- **Source**: [github.com/aliftype/amiri](https://github.com/aliftype/amiri)
- **License**: OFL (SIL Open Font License) — free for any use
- **Format**: TTF, WOFF, WOFF2
- **Google Fonts**: Available at [fonts.google.com/specimen/Amiri](https://fonts.google.com/specimen/Amiri)
- **npm**: `@fontsource/amiri`

### 3. Scheherazade New

- **Script**: Naskh (designed for Arabic script languages)
- **Designer**: SIL International
- **Usage**: Arabic and Quranic text rendering, particularly good for languages using Arabic script
- **Features**: Full Unicode Arabic support, extensive diacritics, OpenType smart font features
- **Source**: [github.com/silnrsi/font-scheherazade](https://github.com/silnrsi/font-scheherazade)
- **License**: OFL (SIL Open Font License)
- **Format**: TTF, WOFF, WOFF2

### 4. Noto Naskh Arabic (Google Noto)

- **Script**: Naskh
- **Designer**: Google / Monotype
- **Usage**: General Arabic text display, UI elements, translations
- **Features**: Multiple weights (Regular, Bold, etc.), good screen readability, comprehensive Unicode coverage
- **Source**: [github.com/notofonts/arabic](https://github.com/notofonts/arabic)
- **License**: OFL (SIL Open Font License)
- **Format**: TTF, WOFF2
- **Google Fonts**: Available at [fonts.google.com/noto/specimen/Noto+Naskh+Arabic](https://fonts.google.com/noto/specimen/Noto+Naskh+Arabic)
- **Note**: While suitable for general Arabic, it may not handle all Uthmani-specific glyphs correctly. Best for UI text and translations, not for primary Mushaf display.

### 5. Noto Nastaliq Urdu

- **Script**: Nastaliq
- **Designer**: Google / Monotype
- **Usage**: Urdu translations alongside Quranic text
- **Source**: [fonts.google.com/noto/specimen/Noto+Nastaliq+Urdu](https://fonts.google.com/noto/specimen/Noto+Nastaliq+Urdu)
- **License**: OFL

### 6. QUL Fonts (Tarteel)

The QUL platform by Tarteel AI provides access to several font options used across Quran.com and related projects:

- **Source**: [qul.tarteel.ai/resources/fonts](https://qul.tarteel.ai/resources/fonts)
- **Fonts include**: Multiple Uthmani and Imla'i font variants
- **License**: Varies per font — check individual licenses on the platform
- **API Access**: Available through QUL API for programmatic font selection

### 7. Me Quran Font

- **Script**: Uthmani (IndoPak style)
- **Usage**: Quran display in South Asian / IndoPak Mushaf style
- **Source**: [github.com/AhmedAlBalworwordi/me_quran_font](https://github.com/AhmedAlBalworwordi/me_quran_font)
- **License**: Check repository for terms

### 8. Digital Khatt Fonts

- **Script**: Variable Arabic fonts with parametric design
- **Usage**: Experimental and research-oriented Arabic typography
- **Source**: [digitalkhatt.org](https://digitalkhatt.org/)
- **Note**: These are research-focused fonts exploring parametric Arabic type design. Useful for academic projects and experimental Quranic typography.

## General Arabic Fonts Suitable for Quranic Apps

These fonts are not Quran-specific but are well-suited for supplementary text in Quranic applications (translations, tafsir, UI):

| Font | Style | License | Source | Best For |
|------|-------|---------|--------|----------|
| Amiri | Naskh (classical) | OFL | [GitHub](https://github.com/aliftype/amiri) | Tafsir, classical Islamic text |
| Noto Naskh Arabic | Naskh (modern) | OFL | [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Naskh+Arabic) | UI, translations, general reading |
| Noto Kufi Arabic | Kufi | OFL | [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Kufi+Arabic) | Headings, decorative use |
| IBM Plex Arabic | Sans-serif | OFL | [GitHub](https://github.com/IBM/plex) | Modern UI, interface text |
| Cairo | Sans-serif | OFL | [Google Fonts](https://fonts.google.com/specimen/Cairo) | Modern app UI |
| Tajawal | Sans-serif | OFL | [Google Fonts](https://fonts.google.com/specimen/Tajawal) | Clean modern interface |
| Lateef | Nastaliq | OFL | [GitHub](https://github.com/silnrsi/font-lateef) | Urdu/Sindhi text |
| Harmattan | African Naskh | OFL | [GitHub](https://github.com/silnrsi/font-harmattan) | West African Arabic text |

## Font Sources and Downloads

### Official and Institutional Sources

| Source | URL | Content |
|--------|-----|---------|
| King Fahd Quran Complex | [qurancomplex.gov.sa/quran-dev](https://qurancomplex.gov.sa/quran-dev/) | KFGQPC font family, Mushaf data |
| QUL (Tarteel AI) | [qul.tarteel.ai/resources/fonts](https://qul.tarteel.ai/resources/fonts) | Multiple Quranic font options |
| Google Fonts | [fonts.google.com](https://fonts.google.com/?subset=arabic) | Arabic subset fonts (Amiri, Noto, Cairo, etc.) |
| SIL International | [software.sil.org](https://software.sil.org/arabicfonts/) | Scheherazade, Lateef, Harmattan |

### Community and Open Source

| Source | URL | Content |
|--------|-----|---------|
| Aliftype | [github.com/aliftype](https://github.com/aliftype) | Amiri and other Arabic fonts by Khaled Hosny |
| Google Noto Fonts | [github.com/notofonts](https://github.com/notofonts) | Noto font family (Arabic, Kufi, Nastaliq) |
| Tanzil | [tanzil.net](https://tanzil.net/) | Quran text with font recommendations |

## Licensing Guide

Understanding font licensing is essential to avoid legal issues:

### Common License Types

| License | Commercial Use | Modification | Redistribution | Embedding | Examples |
|---------|---------------|--------------|----------------|-----------|----------|
| OFL (SIL Open Font License) | Yes | Yes (under different name) | Yes | Yes | Amiri, Noto, Scheherazade |
| Apache 2.0 | Yes | Yes | Yes | Yes | Some Google fonts |
| KFGQPC License | Quranic use only | Limited | With attribution | Yes (Quranic apps) | KFGQPC fonts |
| Proprietary | Depends on vendor | No | No | Depends | Various commercial fonts |

### Key Licensing Considerations

1. **Always read the license file** included with the font download
2. **KFGQPC fonts** are generally free for Quranic applications — but check the specific terms on the King Fahd Complex website for commercial use outside Quran apps
3. **OFL fonts** (Amiri, Noto, Scheherazade) are the safest choice for open-source projects
4. **Web embedding**: Ensure the license permits `@font-face` embedding if you plan to use the font on the web
5. **App bundling**: Confirm the license allows including the font in distributed application packages

## Developer Integration Guide

### Web (CSS)

```css
/* Using WOFF2 for optimal web performance */
@font-face {
  font-family: 'KFGQPC Uthmanic Script HAFS';
  src: url('/fonts/KFGQPCUthmanicScriptHAFS.woff2') format('woff2'),
       url('/fonts/KFGQPCUthmanicScriptHAFS.woff') format('woff');
  font-display: swap;
}

/* Applying to Quranic text */
.quran-text {
  font-family: 'KFGQPC Uthmanic Script HAFS', 'Amiri', 'Scheherazade New', serif;
  direction: rtl;
  text-align: right;
  font-size: 1.6rem;
  line-height: 2.2;
}

/* Tafsir and supplementary text */
.tafsir-text {
  font-family: 'Amiri', 'Noto Naskh Arabic', serif;
  direction: rtl;
  font-size: 1.1rem;
  line-height: 1.8;
}
```

### Android (Kotlin)

```kotlin
// Place font files in res/font/ directory
// In your XML layout:
// android:fontFamily="@font/kfgqpc_uthmanic_hafs"

// Or load programmatically:
val quranTypeface = ResourcesCompat.getFont(context, R.font.kfgqpc_uthmanic_hafs)
textView.typeface = quranTypeface
```

### iOS (Swift)

```swift
// Add font file to your project bundle and register in Info.plist
// under "Fonts provided by application"

let quranFont = UIFont(name: "KFGQPCUthmanicScriptHAFS", size: 28)
label.font = quranFont
```

### Flutter (Dart)

```yaml
# In pubspec.yaml:
flutter:
  fonts:
    - family: KFGQPCUthmanicHAFS
      fonts:
        - asset: assets/fonts/KFGQPCUthmanicScriptHAFS.ttf
```

```dart
Text(
  quranVerse,
  style: TextStyle(
    fontFamily: 'KFGQPCUthmanicHAFS',
    fontSize: 28,
    height: 2.0,
  ),
  textDirection: TextDirection.rtl,
)
```

### React Native

```javascript
// Place font in assets/fonts/ and link
// In your component:
<Text style={{
  fontFamily: 'KFGQPCUthmanicScriptHAFS',
  fontSize: 28,
  textAlign: 'right',
  writingDirection: 'rtl',
  lineHeight: 56,
}}>
  {quranVerse}
</Text>
```

## Common Pitfalls

### 1. Missing Glyphs and Rendering Errors

Not all Arabic fonts support Uthmani-specific characters. If you see squares (□), question marks (?), or broken ligatures, the font lacks the required glyphs. Always test with actual Quranic text including edge cases:

- Bismillah (﷽)
- Verse-end markers (۝)
- Sajda markers
- Pause marks (ۖ ۗ ۘ ۙ ۚ ۛ)
- Rub el Hizb (۞)

### 2. Incorrect Line Height

Arabic script with full diacritics (tashkeel) needs significantly more vertical space than undiacritized text. Set `line-height` to at least `1.8` — preferably `2.0` or higher for Quranic text.

### 3. Bidirectional Text Issues

When mixing Arabic (RTL) and Latin (LTR) text (e.g., verse numbers, transliterations), ensure proper Unicode bidirectional algorithm support. Use `dir="rtl"` on containers and explicit `<bdi>` tags for embedded LTR content.

### 4. Font Loading Performance

Quranic fonts can be large (1-5 MB) due to the extensive glyph set. Optimize loading:

- Use `font-display: swap` to prevent invisible text during load
- Subset fonts to include only needed glyphs if possible
- Use WOFF2 format for web (30-50% smaller than TTF)
- Consider preloading critical fonts with `<link rel="preload">`

### 5. Tashkeel Positioning

Some fonts render diacritics (harakat) at incorrect vertical positions or with overlapping marks. Test with heavily diacritized text (e.g., Surah Al-Fatiha) to verify correct stacking of multiple marks.

### 6. Platform Font Rendering Differences

The same font may render differently across platforms (Windows, macOS, iOS, Android, Linux). Each OS uses different text shaping engines:

- **Windows**: DirectWrite / Uniscribe
- **macOS / iOS**: Core Text
- **Android**: HarfBuzz
- **Linux**: HarfBuzz + FreeType
- **Web**: Browser-dependent (most modern browsers use HarfBuzz)

Always test on all target platforms.

## Font Comparison Table

| Font | Script Type | Uthmani Support | Tashkeel | Pause Marks | Web Ready | License | Best For |
|------|------------|----------------|----------|-------------|-----------|---------|----------|
| KFGQPC Uthmanic HAFS | Uthmani | Full | Full | Yes | Needs conversion | KFGQPC | Primary Mushaf display |
| Amiri | Naskh | Partial | Full | No | Yes (WOFF2) | OFL | Tafsir, classical text |
| Scheherazade New | Naskh | Partial | Full | No | Yes (WOFF2) | OFL | Arabic script languages |
| Noto Naskh Arabic | Naskh | Limited | Good | No | Yes (WOFF2) | OFL | UI, translations |
| Noto Kufi Arabic | Kufi | No | Basic | No | Yes (WOFF2) | OFL | Headings, decoration |
| QUL Fonts | Various | Varies | Varies | Varies | Check source | Varies | Depends on variant |

## Additional Resources

- [King Fahd Complex Developer Portal](https://qurancomplex.gov.sa/quran-dev/) — Official Quranic fonts and Mushaf data
- [QUL Font Resources](https://qul.tarteel.ai/resources/fonts) — Curated font selection for Quran apps
- [Unicode Arabic Block](https://unicode.org/charts/PDF/U0600.pdf) — Official Unicode Arabic character chart
- [Unicode Arabic Presentation Forms-A](https://unicode.org/charts/PDF/UFB50.pdf) — Contextual forms used in Arabic rendering
- [Arabic Typesetting (Microsoft)](https://learn.microsoft.com/en-us/typography/font-list/arabic-typesetting) — Microsoft's Arabic typesetting guidance
- [Khaled Hosny's Arabic Font Projects](https://github.com/aliftype) — Open-source Arabic type design
- [SIL Arabic Font Resources](https://software.sil.org/arabicfonts/) — SIL International Arabic font collection
- [HarfBuzz](https://harfbuzz.github.io/) — The text shaping engine used by most modern platforms
