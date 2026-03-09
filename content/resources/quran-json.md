# quran-json

## Introduction

A JavaScript package for Quran text and translations in JSON format. It provides Quran text, transliteration, and translations in JSON format.

## Features

- Quran text and translations structured for easy consumption by applications.
- JSON data available at different granularities: entire Quran, individual chapters (surahs), individual verses.
- Multi-language support.
- Access via CDN links for direct web usage or integration.
- Ability to generate JSON files locally from source for customization or offline usage.
- Provides both Quran text and transliterations together in files.

## Usage

### Using CDN

- Access full Quran text JSON `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran.json`.
- Access full Quran with specific language translation, e.g., English `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json`.
- Access single chapter text only `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/{chapterNumber}.json`
- Access single chapter with translation: `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/{langCode}/{chapterNumber}.json`
- Access single verse `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/verses/{verseNumber}.json`.

The CDN allows quick integration with no need for hosting files.

### Using NPM (local build):

- Clone the repository:

```bash

git clone git@github.com:risan/quran-json.git
cd quran-json
```

- Install dependencies:

```bash
npm install
```

- Generate JSON files locally:

```bash
npm run build
```

This process builds the Quran JSON data locally, useful for customization or offline access.

## Data Source

- The Uthmani Quran text is from [The Noble Qur'an Encyclopedia](https://quranenc.com/en/home).
- The English transliteration is from [tanzil](./tanzil.md).
- The Bengali translation is authored by Muhiuddin Khan, and it's sourced from [tanzil](./tanzil.md).
- The English translation is authored by Umm Muhammad (Saheeh International), and it's sourced from [tanzil](./tanzil.md).
- The Spanish translation is authored by Muhammad Isa García, and it's sourced from [tanzil](./tanzil.md).
- The French translation is authored by Muhammad Hamidullah, and it's sourced from [tanzil](./tanzil.md).
- The Indonesian translation is authored by Indonesian Islamic Affairs Ministry, and it's sourced from [The Noble Qur'an Encyclopedia](https://quranenc.com/en/browse/indonesian_affairs).
- The Russian translation is authored by Elmir Kuliev, and it's sourced from [tanzil](./tanzil.md).
- The Swedish translation is authored by Knut Bernström, and it's sourced from [tanzil](./tanzil.md).
- The Turkish translation is authored by Turkish Directorate of Religious Affairs, and it's sourced from [tanzil](./tanzil.md).
- The Urdu translation is authored by Abul A'la Maududi, and it's sourced from [tanzil](./tanzil.md).
- The Chinese translation is authored by Muhammad Makin, and it's sourced from [The Noble Qur'an Encyclopedia](https://quranenc.com/en/browse/chinese_makin).

## License

[CC-BY-SA 4.0](https://github.com/risan/quran-json/blob/master/LICENSE.txt) · [Risan Bagja Pradana](https://risanb.com).
