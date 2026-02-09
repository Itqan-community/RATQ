When you start developing a Quranic App (mobile or web)
You will need to take some decisions and make some choices:

# Content

### 1. The narrations (Rewayah) you want to include in your app
you need to decide if you are going to support one or multiple ones. i.e. (Hafs, Warsh, Shubah, Qaloun, etc...)
The resources for the quran Layout:
1. Hafs (حفص):
    1. Medina Transcript: King Fahd Quran Complex, Multiple Formats  [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/)
    2. Shamarly: PNG image per Page https://github.com/Mr-DDDAlKilanny/shamraly-images
    3. Medina Transcript: https://quraankarem.wordpress.com/qurancomplex/
    4. Shamarly Transcript: https://quraankarem.wordpress.com/shamarly/
    5. Medina: EveryAyah.com, PNG image per Ayah https://everyayah.com/data/quranpngs/  
    6. Medina: EveryAyah.com, JPG image per Ayah https://everyayah.com/data/QuranText_jpg/
    7. Multiple: https://qul.tarteel.ai/resources/mushaf-layout
        1. Script to Download Mushaf pages from QUL https://github.com/blueheron786/get-quran-mushaf-images
2. Warsh (ورش)
    1. Medina Transcript: King Fahd Quran Complex  [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/)
3. Shubah (شعبة)
    1. Medina Transcript: King Fahd Quran Complex  [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/)
4. Qaloun (قالون)
    1. Medina Transcript: King Fahd Quran Complex  [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/)
5. Duri (الدوري)
    1. Medina Transcript: King Fahd Quran Complex  [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/)
6. Susi (السوسي)
    1. Medina Transcript: King Fahd Quran Complex [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/)
7. Hesham (هشام)
    1. Medina Transcript: King Fahd Quran Complex  [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/)

### 2. Get annotations for the start and end of each ayah for the downloaded resource

> [!NOTE] Warning
> Some Resources do not have Ayah start and end annotation. You may need to split them yourself

> [!NOTE] Warning
> Recitations vary in the number of Ayahs in each transcript
> i.e. Hafs has 6236 Ayahs, while Warsh has 6214 Ayahs. They Quran is the same, but the Ayahs are split differently 
> You have to consider this variation whilst developing your app
> -- TODO: Hassaan: needs resource for this warning

#### Resources to annotate Quran Layout's ayah location
1. This tool https://github.com/quran/ayah-detection can help you in annotating the Ayahs
2. AI tool to detect annotation from Image Mushafs https://github.com/bllfoad/ayahai

### 3. Get the Quran Script for highlighting and naive search purposes
having the images of the Quran as SVG, PNG,  or JPG is not enough, you still need to have the Quran Script (QS) in order for the machine to understand it as well
you can get the content of the Quran as json, csv or SQL fromat from
1. Hafs (حفص):
    1. Quran Foundation, https://api-docs.quran.foundation/docs/content_apis_versioned/quran-verses-indopak [API]
    2. King Fahd Quran Complex, [csv, html, json, sql, txt, xlsx, xml]  [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/) [Downloadable]
    3. Every Ayah [XML] https://everyayah.com/data/XML/Arabic/ 
    4. Tanzil[Bar Seperated Values, XML, SQL (MySql dump)] https://tanzil.net/download/
    5. Mushaf Mauri: https://github.com/Zizwar/mushaf-mauri/tree/main/assets/pages/hafsTajweed
2. Warsh (ورش)
    1. Medina Transcript: King Fahd Quran Complex, [csv, html, json, sql, txt, xlsx, xml]  [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/) [Downloadable]
    2. Mushaf Mauri: https://github.com/Zizwar/mushaf-mauri/tree/main/assets/pages/muhammadi -- TODO: Hassaan: needs verification if this is warsh
3. Shubah (شعبة)
    1. Medina Transcript: King Fahd Quran Complex, [csv, html, json, sql, txt, xlsx, xml]  [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/) [Downloadable]
4. Qaloun (قالون)
    1. Medina Transcript: King Fahd Quran Complex, [csv, html, json, sql, txt, xlsx, xml]  [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/) [Downloadable]
5. Duri (الدوري)
    1. Medina Transcript: King Fahd Quran Complex, [csv, html, json, sql, txt, xlsx, xml]  [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/) [Downloadable]
6. Susi (السوسي)
    1. Medina Transcript: King Fahd Quran Complex, [csv, html, json, sql, txt, xlsx, xml] [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/) [Downloadable]
7. Hesham (هشام)
    1. Medina Transcript: King Fahd Quran Complex, [csv, html, json, sql, txt, xlsx, xml]  [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/) [Downloadable]
8. Collection: https://qul.tarteel.ai/resources/quran-script


### 4. Search
If you want to add search functionality, you can do it manually but be aware of the pitfalls, such as Hamza (ء) and Taa marbota (ة). It is always recommended to use a production ready search.
Available search engines are divided into Full Text Search and Semantic Search.
#### Full Text Search
Full text search: User can search for a word or a phrase and even if the user has typos in their search query, the search engine will stay return relevant results
1. Arabic:
    1. Kalimat.dev https://www.kalimat.dev/ 
        1. sometimes is not accurate for instance searching for "عرب" returns results that are not related to search
    2. Quran Foundation: https://api-docs.quran.foundation/docs/content_apis_versioned/search
2. English:
    1. https://www.kalimat.dev/
    -- Hypothetically kalimat.dev supports many languages, but their search api returns 500 response for any search request as of this writing 2025-10-01
#### Semantic Search
Semantic Search (Search by Meaning): The search will not be applied on the quran script but you can search by Meaning or the root of the word (الجذر اللغوي), this type of search is particularly helpful for users who do not know for certain what they are looking for, and/or for quran translations.
1. https://www.alfanous.org/en/aya/


### Translations

> [!NOTE] Errors!
> Translations are written by human, thus there are errors in these translation. Subsequently these translations are updated frequently, please make sure that you use an up-to-date version of the translation and continue updating your app to have the latest corrections from well-known resources. 
> We encourage any developer to use an API or any CMS to maintain the latest versions. In order to avoid spreading any misinformation.

#### Available Resources
1. https://tanzil.net/trans/
2. https://qul.tarteel.ai/resources/translation
3. https://github.com/fawazahmed0/quran-api
4. https://api-docs.quran.foundation/docs/content_apis_versioned/list-surah-translations
5. [QuranEnc](https://quranenc.com/en/home)

### Tafsir
You may also want to include Tafsir in your application.
There are multiple Tafsir books. Some are more famous than others. The list also can grow as more books get published.


> [!NOTE] Copyrights!
> Tafsirs are books and they may be protected by copyright laws, make sure that you check the copyright license of each book you want to include. if the license does not allow you to use a book, try to reach out to the publisher to get their approval.

> [!NOTE] Errors!
> Tafsirs are also is susceptible to the same issue as Translations, where there may be some errors that get fixed overtime. so make sure that you are getting an up to date copy of any book.
> Even very old books, sometimes get some fixes related to a typo or some content that was misread by OCR.

#### Sources:
1. Spa5k: https://github.com/spa5k/tafsir_api
2. QUL: https://qul.tarteel.ai/resources/tafsir
3. Quran Foundation: https://api-docs.quran.foundation/docs/content_apis_versioned/list-surah-tafsirs

### Audio Recitations
People Also like to listen to their favorite reciters, you can also 

> [!NOTE] Errors!
> Audio Recitation are also is susceptible to the same issue as Translations, They are made by humans and there could be various errors in each recitation. i.e. Tajwid, Mispronunciation, etc...
> Make sure that you are using an up to date version if you are downloading the assets or use an API to get an up to date version of the Recitation

#### Resources:
1. MP3Quran https://www.mp3quran.net/eng/api
2. 

--TODO: Hassaan: add postman collection for Quran Foundation API
# Technologies
These can vary by Technology, we need to have a list most popular frameworks, 
Address any known difficulties in them.
Kotlin, Swift, Flutter, React.
### Best Practices for Displaying Mushaf 
### Audio Players
### Video Players


