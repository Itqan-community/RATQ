# Quranic Fonts & Typography Guide

A comprehensive reference for Quranic fonts, their sources, licensing, and usage in digital applications.

---

## Overview

Quranic typography requires specialized fonts that properly render Arabic script with all its diacritical marks (tashkeel), proper ligatures, and the unique requirements of Quranic text. This guide covers the most commonly used fonts in Quranic applications.

---

## Major Quranic Fonts

### 1. KFGQPC (King Fahd Glorious Quran Printing Complex) Fonts

The most widely used and officially recognized Quranic fonts.

| Font Name | Description | Format | Use Case |
|-----------|-------------|--------|----------|
| **Uthmanic Hafs** | Standard Hafs narration | OTF, TTF | Digital apps, websites |
| **Uthmanic Warsh** | Warsh narration (North Africa) | OTF, TTF | Regional apps |
| **Uthmanic Qaloon** | Qaloon narration | OTF, TTF | Specialized apps |
| **Uthmanic Shu'bah** | Shu'bah narration | OTF, TTF | Specialized apps |
| **Uthmanic Dorf** | Dorf narration | OTF, TTF | Specialized apps |
| **Uthmanic Qumbul** | Qumbul narration | OTF, TTF | Specialized apps |

**Source:** [KFGQPC Official Website](https://qurancomplex.gov.sa/)

**License:** Free for personal and commercial use with attribution

**Download:** [KFGQPC Fonts Portal](https://qurancomplex.gov.sa/kfgqpc-quran-hafs/)

**Features:**
- Accurate tashkeel positioning
- Proper ayah markers (end of verse symbols)
- Sajdah indicators
- Multiple narration support
- Optimized for both screen and print

---

### 2. Amiri Quran Font

A classical-style font designed specifically for Quranic text.

**Source:** [Amiri Font GitHub](https://github.com/alif-type/amiri)

**License:** SIL Open Font License 1.1

**Download:** [Google Fonts](https://fonts.google.com/specimen/Amiri+Quran)

**Features:**
- Traditional calligraphic style
- Excellent readability
- Full tashkeel support
- Wide character coverage
- Suitable for both body text and headings

---

### 3. Scheherazade New

A professionally designed Arabic font with Quranic support.

**Source:** [SIL International](https://software.sil.org/scheherazade/)

**License:** SIL Open Font License 1.1

**Download:** [SIL Website](https://software.sil.org/scheherazade/download/)

**Features:**
- Large character set
- Professional typographic quality
- Good for academic works
- Supports multiple Arabic-based scripts

---

### 4. Kitab Font

Modern font optimized for readability in digital interfaces.

**Source:** [The.sinkin.sh](https://the.sinkin.sh/kitab)

**License:** Free for commercial use

**Features:**
- Optimized for screen reading
- Clean, modern design
- Good for mobile applications
- Various weights available

---

### 5. Al-Quds Font

Popular open-source Quranic font.

**Source:** [Open Source Islamic Projects](https://github.com/islamic-apps/quran-fonts)

**License:** Open Source (varies by variant)

**Features:**
- Multiple variants available
- Community-maintained
- Good compatibility

---

## Font Comparison Matrix

| Font | Tashkeel Quality | Screen Optimized | Print Optimized | Mobile Friendly | License Type |
|------|------------------|------------------|-----------------|-----------------|--------------|
| KFGQPC Uthmanic | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Free with attribution |
| Amiri Quran | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | SIL OFL |
| Scheherazade | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | SIL OFL |
| Kitab | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free |
| Al-Quds | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | Open Source |

---

## Font Formats Explained

### TrueType (TTF)
- Most widely supported format
- Works on all platforms
- Good for general use

### OpenType (OTF)
- Advanced typographic features
- Better for complex scripts like Arabic
- Recommended for Quranic text

### Web Fonts (WOFF/WOFF2)
- Optimized for web use
- Smaller file sizes
- Faster loading on websites

### Variable Fonts
- Single file with multiple weights
- Efficient for web applications
- Modern browser support required

---

## Usage Recommendations

### For Mobile Apps
1. **Primary:** KFGQPC Uthmanic Hafs
2. **Alternative:** Kitab (for UI elements)
3. **Fallback:** Amiri Quran

### For Web Applications
1. **Primary:** KFGQPC (via CDN or self-hosted)
2. **Alternative:** Amiri Quran from Google Fonts
3. **Backup:** System Arabic fonts

### For Desktop Applications
1. **Primary:** KFGQPC Uthmanic
2. **Alternative:** Scheherazade New
3. **Print:** Amiri Quran or Scheherazade

### For Publishers/Print
1. **Primary:** KFGQPC fonts
2. **Alternative:** Scheherazade New
3. **Classical style:** Amiri Quran

---

## Technical Considerations

### Text Rendering
- Use HarfBuzz or similar text shaping engine
- Ensure proper RTL (Right-to-Left) support
- Test tashkeel positioning carefully

### Font Size Recommendations
| Context | Minimum Size | Recommended Size |
|---------|-------------|------------------|
| Mobile | 16px / 12pt | 18-20px / 14-16pt |
| Tablet | 18px / 14pt | 20-24px / 16-18pt |
| Desktop | 20px / 16pt | 24-28px / 18-20pt |
| Print | 12pt | 14-16pt |

### Line Height
- Quranic text requires more line height than regular Arabic
- Recommended: 1.8 to 2.2 line height
- Ensures tashkeel doesn't overlap

---

## Quick Start for Developers

### Web (CSS)
```css
@import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap');

.quranic-text {
  font-family: 'Amiri Quran', 'KFGQPC Uthmanic Hafs', serif;
  font-size: 24px;
  line-height: 2;
  direction: rtl;
}
```

### Flutter
```yaml
dependencies:
  google_fonts: ^6.0.0
```
```dart
Text(
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  style: GoogleFonts.amiriQuran(
    fontSize: 24,
    height: 2.0,
  ),
  textDirection: TextDirection.rtl,
)
```

### React Native
```javascript
import { Text } from 'react-native';

<Text style={{
  fontFamily: 'Amiri-Quran',
  fontSize: 24,
  lineHeight: 48,
  writingDirection: 'rtl'
}}>
  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
</Text>
```

---

## Resources & Links

- [KFGQPC Official Fonts](https://qurancomplex.gov.sa/kfgqpc-quran-hafs/)
- [Amiri Font GitHub](https://github.com/alif-type/amiri)
- [Quran.com Fonts CDN](https://cdn.quran.com/)
- [Tanzil Fonts](https://tanzil.net/docs/download)
- [Islamic Network Fonts](https://fonts.islamic.network/)

---

## Contributing

If you know of additional Quranic fonts or have corrections to this guide, please submit a PR to the RATQ repository.

---

*Last Updated: February 2026*
