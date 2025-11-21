عند بدأ العمل على تطوير **تطبيق قرآنيّ** سواء كان هذا على الهاتف أو الويب، ستحتاج إلى اتّخاذ الكثير من القرارات:

# المحتوى

## 1. الروايات التي تريد تضمينها في التطبيق
عليك الاختيار بين دعم رواية واحدة أو عدّة روايات، مثل رواية حفص، ورش، شعبة، قالون أو غيرها. هذه بعض الموارد التي توفّر البيانات القرآنيّة بالروايات المتعددة:

1. رواية حفص:
	1. مصحف المدينة: من مجمع الملك فهد، متاح بصيغ متعددة. [تصفّحه من هنا](https://qurancomplex.gov.sa/quran-dev/)
	2. مصحف الشمرلي: متاح على شكل صور PNG لكل صفحة. [تصفّحه من هنا](https://github.com/Mr-DDDAlKilanny/shamraly-images)
	3. مصحف المدينة: إصدارات مجمع الملك فهد بدقة عالية. [تصفّحه من هنا](https://quraankarem.wordpress.com/qurancomplex/)
	4. مصحف الشمرلي: نسخة غاية في الوضوح على ملف PDF. [تصفّحه من هنا](https://quraankarem.wordpress.com/shamarly/)
	5. مصحف المدينة: من موقع EveryAyah.com صور PNG لكل آية. [تصفّحه من هنا](https://everyayah.com/data/quranpngs/)
	6. مصحف المدينة: من موقع EveryAyah.com صورة JPG لكل آية. [تصفّحه من هنا](https://everyayah.com/data/QuranText_jpg/)
	7. مصاحف متعددة: من [موقع قٌل](https://qul.tarteel.ai/resources/mushaf-layout) وسكريبت برمجيّ لتحميل صفحات المصحف من قٌل. [استخدمه من هنا](https://github.com/blueheron786/get-quran-mushaf-images)
2. رواية ورش:
	1. مصحف المدينة: مجمع الملك فهد للقرآن الكريم. [تصفّحه من هنا](https://qurancomplex.gov.sa/quran-dev/)
3. رواية شعبة: 
	1. مصحف المدينة: مجمع الملك فهد للقرآن الكريم. [تصفّحه من هنا](https://qurancomplex.gov.sa/quran-dev/) 
4. رواية قالون:
	1. مصحف المدينة: مجمع الملك فهد للقرآن الكريم. [تصفّحه من هنا](https://qurancomplex.gov.sa/quran-dev/) 
5. رواية الدوري:
	1. مصحف المدينة: مجمع الملك فهد للقرآن الكريم. [تصفّحه من هنا](https://qurancomplex.gov.sa/quran-dev/)
6. رواية السوسي:
	1. مصحف المدينة: مجمع الملك فهد للقرآن الكريم. [تصفّحه من هنا](https://qurancomplex.gov.sa/quran-dev/)
7. رواية هشام: 
	1. مصحف المدينة: مجمع الملك فهد للقرآن الكريم. [تصفّحه من هنا](https://qurancomplex.gov.sa/quran-dev/)

## 2. العلامات في بداية ونهاية كلّ آية

> [!NOTE] تنويه
> بعض المصادر لا تضمّن علامات في بداية ونهاية كلّ آية. قد يكون عليك فصل الآيات بنفسك.

> [!NOTE] تنويه
> التلاوات قد تختلف في عدد الآيات لكل رواية.
> على سبيل المثال: في رواية حفص هناك 6236 آية بينما في رواية ورش هناك 6214 آية. القرآن نفسه، لكنّ الآيات مقسومة بطريقة مختلفة.
> عليك أخذ هذا بعين الاعتبار عند تطوير تطبيقك

### موارد لتعليم أماكن الآيات في رسم القرآن
1. هذه الأداة تساعدك في تعليم أماكن الآيات. [استخدمها من هنا](https://github.com/quran/ayah-detection)
2. هذه أداة بالذكاء الاصطناعي تساعدك في تعليم الآيات الموجودة في المصاحف المصوّرة. [استخدمها من هنا](https://github.com/bllfoad/ayahai)

## 3. احصل على النصّ القرآني بغرض التحديد النصّي والبحث
لا يكفي الحصول على النصّ القرآنيّ على شكل صور SVG أو PNG أو JPG، إذ ستبقى بحاجة للنصّ القرآني - QS - كي تكون الآلة قادرة على التفاعل مع النصّ.
يمكنك الحصول على النصّ القرآنيّ بصيغة JSON أو CSV أو SQL من هذه المصادر:

1. رواية حفص:
	1. قرآن فاونديشن: [من الرابط التالي](https://api-docs.quran.foundation/docs/content_apis_versioned/quran-verses-indopak) [API]
	2. مجمع الملك فهد للقرآن الكريم: [من الرابط التالي](https://qurancomplex.gov.sa/quran-dev/) [csv, html, json, sql, txt, xlsx, xml] - [Downloadable]
	3. كلّ آية - Every Ayah: [من الرابط التالي](https://everyayah.com/data/XML/Arabic/) [XML]
	4. تنزيل: [من الرابط التالي](https://tanzil.net/download/) [Bar Seperated Values, XML, SQL (MySql dump)]
	5. مصحف موري: [من الرابط التالي](https://github.com/Zizwar/mushaf-mauri/tree/main/assets/pages/hafsTajweed) 
2. رواية ورش:
	1. مصحف المدينة: مجمع الملك فهد للقرآن الكريم: [من الرابط التالي](https://qurancomplex.gov.sa/quran-dev/) [csv, html, json, sql, txt, xlsx, xml] - [Downloadable]
	2. مصحف موري: [من الرابط التالي](https://github.com/Zizwar/mushaf-mauri/tree/main/assets/pages/muhammadi)
3. رواية شعبة:
	1. 


4. Shubah (شعبة)
    1. Medina Transcript: King Fahd Quran Complex, [csv, html, json, sql, txt, xlsx, xml]  [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/) [Downloadable]
5. Qaloun (قالون)
    1. Medina Transcript: King Fahd Quran Complex, [csv, html, json, sql, txt, xlsx, xml]  [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/) [Downloadable]
6. Duri (الدوري)
    1. Medina Transcript: King Fahd Quran Complex, [csv, html, json, sql, txt, xlsx, xml]  [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/) [Downloadable]
7. Susi (السوسي)
    1. Medina Transcript: King Fahd Quran Complex, [csv, html, json, sql, txt, xlsx, xml] [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/) [Downloadable]
8. Hesham (هشام)
    1. Medina Transcript: King Fahd Quran Complex, [csv, html, json, sql, txt, xlsx, xml]  [https://qurancomplex.gov.sa/quran-dev/](https://qurancomplex.gov.sa/quran-dev/) [Downloadable]
9. Collection: https://qul.tarteel.ai/resources/quran-script


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


