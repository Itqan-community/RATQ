# quran-json

## مقدمة

حزمة JavaScript لنص القرآن والترجمات بصيغة JSON. توفر نص القرآن، لفظ الكلمات بأحرف لاتينية والترجمات بصيغة JSON.

## المميزات

- نص القرآن والترجمات منظم لسهولة الاستخدام من قبل التطبيقات.
- بيانات JSON متاحة بمستويات مختلفة: القرآن كامل، فصول فردية (سور)، آيات فردية.
- دعم متعدد اللغات.
- الوصول عبر روابط CDN للاستخدام المباشر على الويب أو التكامل.
- القدرة على إنشاء ملفات JSON محليًا من المصدر للتخصيص أو الاستخدام دون اتصال.
- يوفر كلًا من نص القرآن ولفظ الكلمات بالأحرف اللاتينية معًا في الملفات.

## الاستخدام

### استخدام CDN

- الوصول إلى نص القرآن الكامل JSON `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran.json`.
- الوصول إلى القرآن الكامل مع ترجمة لغة محددة، على سبيل المثال، الإنجليزية `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json`.
- الوصول إلى نص فصل واحد فقط `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/{chapterNumber}.json`
- الوصول إلى فصل واحد مع الترجمة: `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/{langCode}/{chapterNumber}.json`
- الوصول إلى آية واحدة `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/verses/{verseNumber}.json`.

CDN يسمح بالتكامل السريع دون الحاجة لاستضافة الملفات.

### استخدام NPM (بناء محلي):

- استنساخ المستودع:

```bash

git clone git@github.com:risan/quran-json.git
cd quran-json
```

- تثبيت التبعيات:

```bash
npm install
```

- إنشاء ملفات JSON محليًا:

```bash
npm run build
```

هذه العملية تبني بيانات القرآن JSON محليًا، مفيدة للتخصيص أو الوصول دون اتصال.

## مصدر البيانات

- نص القرآن العثماني من [موسوعة القرآن الكريم](https://quranenc.com/en/home).
- التحويل الصوتي الإنجليزي من [tanzil](./tanzil.md).
- الترجمة البنغالية من تأليف محي الدين خان، ومصدرها [tanzil](./tanzil.md).
- الترجمة الإنجليزية من تأليف أم محمد (صحيح إنترناشيونال)، ومصدرها [tanzil](./tanzil.md).
- الترجمة الإسبانية من تأليف محمد عيسى غارسيا، ومصدرها [tanzil](./tanzil.md).
- الترجمة الفرنسية من تأليف محمد حميد الله، ومصدرها [tanzil](./tanzil.md).
- الترجمة الإندونيسية من تأليف وزارة الشؤون الإسلامية الإندونيسية، ومصدرها [موسوعة القرآن الكريم](https://quranenc.com/en/browse/indonesian_affairs).
- الترجمة الروسية من تأليف المير كوليف، ومصدرها [tanzil](./tanzil.md).
- الترجمة السويدية من تأليف كنوت برنستروم، ومصدرها [tanzil](./tanzil.md).
- الترجمة التركية من تأليف المديرية التركية للشؤون الدينية، ومصدرها [tanzil](./tanzil.md).
- الترجمة الأردية من تأليف أبو الأعلى المودودي، ومصدرها [tanzil](./tanzil.md).
- الترجمة الصينية من تأليف محمد ماكين، ومصدرها [موسوعة القرآن الكريم](https://quranenc.com/en/browse/chinese_makin).

## الترخيص

[CC-BY-SA 4.0](https://github.com/risan/quran-json/blob/master/LICENSE.txt) · [Risan Bagja Pradana](https://risanb.com).

