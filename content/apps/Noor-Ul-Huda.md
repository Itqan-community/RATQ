# Noor Ul Huda

Noor-Ul-Huda is an offline Quran app with Prayer Time and Duas (supplications).

## Features

Customize your reading experience the way you want:

* Choose Quranic **script**: Imla'ei or Uthmani.
* Choose from different Arabic **fonts** (requires download), adjust font contrast and **size**.
* Set comfortable **background tone** and screen brightness.
* Choose from **Page Mode** or continuous reading.
* **Dark theme** and multiple theme colors supported.

Make Quran reading more profitable:

* **Translations** in different languages.
* Quickly take notes by creating **Tags** with Title and Description.
* Conveniently tag Ayahs by long pressing.
* **Search** in Quranic text or translations.
* **Share** or copy Ayahs (with translation) by long pressing.

Easy navigation:

* **Bookmark** Ayahs by long pressing.
* Go to desired page, Surah, Juz or Manzil.

More:

* Quranic and Masnoon Supplications (**Duas**), general and for special occasions.
* **Prayer Time** notifications and Adhan, and **Qibla** direction for set location.
* **Backup and Restore** preferences, Tags and Bookmarks.

## Usage Requirements

1. **INTERNET** permission is required to check for updates, download Quranic texts and translations, fonts and Adhan audio file, and for (reverse) geocoding.
   
   If you do not use any of these features, NUH makes no connection to internet, ever. Once a required resource is downloaded (with your approval), the app functions completely offline. The domains NUH may connect to include [https://github.com](https://github.com), [https://mirfatif.github.io](https://mirfatif.github.io) and [https://www.geonames.org](https://www.geonames.org).

2. **FOREGROUND_SERVICE** permission is required to show persistent widget notification and play Adhan.

3. **WAKE_LOCK** is required to play Adhan alarm.

4. **RECEIVE_BOOT_COMPLETED** is required to reset alarms (for Prayer notifications and Adhan) when device is restarted.

## Download

you can download it from [here](https://f-droid.org/en/packages/com.mirfatif.noorulhuda/).

## For Developers

This is an open source mobile app written in Java. You can find the source code [here](https://github.com/ya27hw/equran_app).

### Libraries

* [Android Jetpack](https://github.com/androidx/androidx)
* [Material Components for Android](https://github.com/material-components/material-components-android)
* [Adhan Java](https://github.com/batoulapps/adhan-java)
* [Time4A](https://github.com/batoulapps/adhan-java)
* [BetterLinkMovementMethod](https://github.com/saket/Better-Link-Movement-Method)
* [LeakCanary](https://github.com/square/leakcanary)
* [Google Java Format](https://github.com/sherter/google-java-format-gradle-plugin)
* [Guava](https://github.com/google/guava)

### Search Technique

The searching feature in this project uses SQLite's built-in `INSTR()` function. You can find the search query (and all other queries) in this file [`https://github.com/mirfatif/NoorUlHuda/blob/master/app/src/main/java/com/mirfatif/noorulhuda/db/QuranDao.java#L83`](https://github.com/mirfatif/NoorUlHuda/blob/master/app/src/main/java/com/mirfatif/noorulhuda/db/QuranDao.java#L83)

### Resources

1. **Translations**: [Crowdin](https://crowdin.com/project/nuh)
2. **Quranic Texts and Translations:** [Tanzil](https://tanzil.net/download). 
3. **Fonts:** Noor Ul Huda uses Arabic fonts created by:
   * [King Fahd Quran Complex](https://fonts.qurancomplex.gov.sa)
   * [Pakistan Data Management Services](https://pakdata.com/products/arabicfont)
   * [SIL International](https://software.sil.org/arabicfonts)
   * [Noor-e-Hidayat](https://www.noorehidayat.org)
   * [Meor Ridzuan](https://github.com/icikiwir/me_quran)
   * [Quran Academy](https://github.com/quranacademy/kitab-font)
4. **Adhan:** Qari Islam Sobhi