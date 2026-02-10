
# eQuran

A mobile application for every user.

## Features

- List all the quran by surah, juz', or your favorites.
- Add surahs to your favorites.
- Search by the name or the number of the surah for quick filtering.
- You can jump to last-read ayah.
- The surah browsing is aya-by-aya, offering the layout and the translation of the aya below it.
- You can run a recitation of the aya (by sheikh Mashari), but requires connection to the internet.
- While browsing the sura, you can jump to a specific verse. (tab the three-doted icon above)
- In settings you can customize your experience as follows:
    - Turn on or off the haptic feedback when navigating.
    - Display each verse separately, or all in one page (still aya-by-aya where each aya is in its own card, but you choose to list one aya or all the ayat of the surah in one page).
    - You can choose if the last read lists only one result or up to 7.
    - You can choose your translation from 8 translations available.
    - Customize the playback rate of the recitation.
    - Choose your best color theme.
    - Change the font size.
    - Clear your history, or favorites.

## Download

you can download it from [https://f-droid.org/en/packages/com.app.equran/](https://f-droid.org/en/packages/com.app.equran/).

## For Developers

This is an open source mobile app written using flutter. You can find the source code [https://github.com/ya27hw/equran_app](https://github.com/ya27hw/equran_app).
The source data is a json file in  `equran_app/blob/main/assets/index.json` which lists all the surahs of the quran in the following form
```json
[
    {
        "id": 1,
        "name": "الفاتحة",
        "transliteration": "Al-Fatihah",
        "type": "meccan",
        "total_verses": 7,
        "link": "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/1.json",
    },
    {
        ...
    }
]        
```
The source of this file is `https://cdn.jsdelivr.net/npm/quran-json` which returns this file as a response.