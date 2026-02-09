# ألفانوس: محرك بحث القرآن الكريم باللغة العربية

## [نظرة عامة](#table-of-contents)

**ألفانوس** هو محرك بحث في القرآن الكريم مجاني ومفتوح المصدر من خلال API للنصوص العربية. يدعم عمليات البحث البسيطة والمتقدمة في النص الكامل للقرآن، باستخدام فهرس فعال لتقديم نتائج سريعة وذات صلة. المحرك مبني على مكتبة **Whoosh** (محرك بحث Python خالص)، ويتضمن معالجة خاصة بالعربية (الاشتقاق، تحليل الجذر، إلخ) للتعامل مع تعقيدات اللغة.

## جدول المحتويات

- [نظرة عامة](#نظرة-عامة)
- [جدول المحتويات](#جدول-المحتويات)
- [المميزات](#المميزات)
- [التثبيت والاستخدام](#التثبيت-والاستخدام)
- [الاستعلامات المتقدمة](#الاستعلامات-المتقدمة)
- [تنسيق النتائج](#تنسيق-النتائج)
- [الهندسة المعمارية وبنية الكود](#الهندسة-المعمارية-والبنية-اللكود)
- [التطوير والمساهمة](#التطوير-والمساهمة)
- [الموارد](#الموارد)
- [الترخيص](#الترخيص)

## [المميزات](#جدول-المحتويات)

- **صيغة استعلام متقدمة**: يدعم العبارات المقتبسة، العوامل المنطقية (`+`، `|`، `-`)، الأحرف البديلة، واستعلامات النطاق.
- **متعدد اللغات والتحويل الصوتي**: يمكن أن تكون الاستعلامات بالعربية أو بأشكال محولة (Buckwalter، ISO، ArabTeX، إلخ).
- **مخرجات قابلة للتخصيص**: يدعم علامات لنصوص البرامج النصية، الترجمات، التمييز، التصفح، والترتيب.
- **نتائج غنية**: يُرجع JSON منظم مع معلومات الآية، السياق، التعليقات التوضيحية، والتلاوات الاختيارية.
- **واجهات متعددة**: يوفر Python API، CLI، الويب، وواجهة المستخدم الرسومية.

## [التثبيت والاستخدام](#جدول-المحتويات)

### الحزمة

قم بتثبيت API الفانوس عبر pip:

```bash
sudo pip3 install alfanous
```

الآن، يمكنك استخدام API على النحو التالي:

1. **سطر الأوامر**

```bash
$ alfanous-console -a search -q الله     # البحث عن "الله"
$ alfanous-console -a suggest -q مءصدة   # الحصول على اقتراحات الإملاء
```

2. **Python API**

```python
import alfanous
results = alfanous.search(u"الله")
# أو استخدم واجهة do() العامة مع قاموس:
results = alfanous.do({"action": "search", "query": u"Allh"})  # تحويل Buckwalter
```

هذه تُرجع نفس بنية JSON مثل وحدة التحكم.

### المصدر

> **ملاحظة**: الكود المصدري مكتوب بـ Python 2.7 وهو غير متوافق مع Python 3. تحتاج إلى استخدام إصدار متوافق من Python 2.7.

> **ملاحظة**: اختبرت الكود بعد إجراء العديد من التغييرات على الكود لجعله متوافقًا مع python3 ولم أختبره مع python2.

1. استنساخ المستودع:

```bash
git clone https://github.com/Alfanous-team/alfanous.git
```

2. الانتقال إلى المجلد:

```bash
cd alfanous
```

3. تثبيت التبعيات:

```bash
pip3 install pyparsing epydoc sphinx
```

4. بناء الفهارس:

```bash
make build
```

5. الانتقال إلى مجلد alfanous

````

6. إعداد الحزمة:

```bash
python3 setup.py install
````

الآن، يمكنك استخدام أمر `alfanous-console` للبحث عن كلمة أو عبارة.

> **ملاحظة أخرى**: بعد اختبار الكود، واجهت مشكلة حيث لا يُرجع أي نتائج ويفشل دائمًا، كلما بحثت عن أي شيء. أنا حاليًا أصلح المشكلة.

### Web API

الخدمة JSON متاحة عبر الإنترنت. على سبيل المثال:

```url
http://alfanous.org/jos2?action=search&query=الله or
http://alfanous.org/jos2?action=search&query=Allh
```

سيقوم بإجراء بحث وإرجاع JSON.

> **ملاحظة**: Web API متاح عبر الإنترنت ولكن يبدو أن لديه بعض المشاكل، العديد من الطلبات تحصل على خطأ تجاوز الحد، وأنا لست متأكدًا من السبب. أيضًا، لديه بعض الاستجابات غير الملائمة، لذلك لا يمكن الاعتماد على هذه الاستجابات.

**علامات الاستعلام والمعاملات لـ Web API**

| **المعامل**     | **الوصف**                                 |
| ----------------- | ----------------------------------------------- |
| `action`          | نوع العملية: `search`، `suggest`، أو `show`. |
| `query`           | كلمات البحث (عربية أو تحويل صوتي).    |
| `script`          | `standard` أو `uthmani`.                        |
| `vocalized`       | تضمين التشكيل.                             |
| `recitation`      | معرف التلاوة الصوتية.                            |
| `translation`     | معرف الترجمة.                                 |
| `highlight`       | تنسيق التمييز (`css`، `html`، إلخ.).         |
| `sortedby`        | طريقة الترتيب.                                 |
| `page`، `perpage` | التصفح.                                     |

## [الاستعلامات المتقدمة](#جدول-المحتويات)

يدعم ألفانوس لغة استعلام غنية. أمثلة:

### البحث عن عبارة:

ضع النص بين علامات اقتباس، على سبيل المثال `"الحمد لله"` للعثور على العبارة الدقيقة

### المنطق المنطقي:

استخدم `+` لـ `AND`، `|` لـ `OR`، `-` لـ `NOT`. على سبيل المثال `الصلاة + الزكاة` (آيات تحتوي على كليهما)، (`الصلاة - الزكاة`) (آيات مع `الصلاة` ولكن بدون `الزكاة`)

### الأحرف البديلة:

العلامة النجمية `*` تطابق أي عدد من الأحرف، على سبيل المثال `*نبي*` (كلمات تحتوي على `نبي`)، وعلامة الاستفهام `?` لحرف واحد (على سبيل المثال `نعم؟` لمطابقة نعم متبوعًا بأي حرف)

### البحث في الحقول:

ابحث في حقول محددة بالبادئة، على سبيل المثال `سورة:يس` للبحث داخل أسماء السور، أو `رقم_السورة:114 + aya_id:1` لتحديد السورة 114 الآية 1. راجع قائمة الحقول لجميع الحقول المفهرسة (على سبيل المثال `موضوع` للموضوع، `آية_` للنص المشكل جزئيًا).

### استعلامات النطاق:

حدد النطاقات الرقمية، على سبيل المثال `رقم_السورة:[1 الى 5]` لتقييد السور 1–5، وربما مجتمعة مع مصطلح: `رقم_السورة:[1 الى 5] + الله`.

### التشكيل المحدد جزئيًا:

استخدم استعلامات الحقل بحرف عربي رئيسي، على سبيل المثال `آية_:'مَن'` يطابق الآيات حيث بعض الحركات تُنطق "مَن"

### البحث عن الجذر/اللفظ:

استخدم `{root,type=...}` لمرشحات جزء الكلام، أو رموز الاشتقاق: `>مالك` يجد كلمات مع لفظ مالك، `>>مالك` يجد كلمات مع جذر مالك.

هذه الخيارات القوية تتيح لك إنشاء عمليات بحث محددة جدًا. (على سبيل المثال، للعثور على جميع الآيات حول `الله` في الفصول الخمسة الأولى: استخدم `رقم_السورة:[1 الى 5] + الله`.)

### مثال

علامات

```json
{
  "action": "search",
  "query": "الكوثر",
  "sortedby": "score",
  "page": 1,
  "word_info": true,
  "highlight": "css",
  "script": "standard",
  "prev_aya": true,
  "next_aya": true,
  "sura_info": true,
  "aya_position_info": true,
  "aya_theme_info": true,
  "aya_stat_info": true,
  "aya_sajda_info": true,
  "annotation_word": true,
  "annotation_aya": true,
  "translation": "None",
  "recitation": 1
}
```

## [تنسيق النتائج](#جدول-المحتويات)

يُرجع API JSON. على سبيل المثال، استجابة [العلامات](#example) أعلاه:

```json
{
  "search": {
    "runtime": 1.0951571464538574,
    "interval": {
      "start": 1,
      "total": 1,
      "end": 1
    },
    "words": {
      "global": {
        "nb_words": 1,
        "nb_matches": 1,
        "nb_vocalizations": 1
      },
      "individual": {
        "1": {
          "word": "\u0627\u0644\u0643\u0648\u062b\u0631",
          "nb_matches": 1,
          "nb_ayas": 1,
          "nb_vocalizations": 1,
          "vocalizations": [
            "\u0627\u0644\u0652\u0643\u064e\u0648\u0652\u062b\u064e\u0631\u064e"
          ]
        }
      }
    },

    "ayas": {
      "1": {
        "identifier": {
          "gid": 6205,
          "aya_id": 1,
          "sura_id": 108,
          "sura_name": "\u0627\u0644\u0643\u0648\u062b\u0631"
        },
        "aya": {
          "id": 1,
          "text": "\u0625\u0650\u0646\u0651\u064e\u0627\u0623\u064e\u0639\u0652\u0637\u064e\u064a\u0652\u0646\u064e\u0627\u0643\u064e <span class=\"match term0\">\u0627\u0644\u0652\u0643\u064e\u0648\u0652\u062b\u064e\u0631\u064e</span>",
          "recitation": "http://www.everyayah.com/data/Abdul_Basit_Murattal_64kbps/108001.mp3",
          "translation": null,
          "prev_aya": {
            "id": 7,
            "sura": "\u0627\u0644\u0645\u0627\u0639\u0648\u0646",
            "text": "\u0648\u064e\u064a\u064e\u0645\u0652\u0646\u064e\u0639\u064f\u0648\u0646\u064e \u0627\u0644\u0652\u0645\u064e\u0627\u0639\u064f\u0648\u0646\u064e"
          },
          "next_aya": {
            "id": 2,
            "sura": "\u0627\u0644\u0643\u0648\u062b\u0631",
            "text": "\u0641\u064e\u0635\u064e\u0644\u0651\u0650 \u0644\u0650\u0631\u064e\u0628\u0651\u0650\u0643\u064e \u0648\u064e\u0627\u0646\u0652\u062d\u064e\u0631\u0652"
          }
        },

        "sura": {
          "id": 108,
          "name": "\u0627\u0644\u0643\u0648\u062b\u0631",
          "type": "\u0645\u0643\u064a\u0629",
          "order": 15,
          "ayas": 3,
          "stat": {
            "words": 10,
            "letters": 42,
            "godnames": 0
          }
        },
        "theme": {
          "chapter": "\u0623\u0631\u0643\u0627\u0646 \u0627\u0644\u0625\u0633\u0644\u0627\u0645 ",
          "topic": "\u0627\u0644\u062d\u062c \u0648\u0627\u0644\u0639\u0645\u0631\u0629 ",
          "subtopic": null
        },

        "position": {
          "rub": 0,
          "manzil": 7,
          "ruku": 550,
          "hizb": 60,
          "page": 602
        },
        "sajda": {
          "exist": false,
          "id": null,
          "type": null
        },

        "stat": {
          "letters": 16,
          "godnames": 0,
          "words": 3
        },
        "annotations": {
          "1": {
            "arabicroot": null,
            "arabicmood": null,
            "number": null,
            "spelled": "\u0627\u0646\u0627\u0653",
            "aspect": null,
            "word_gid": 75871,
            "word_id": 1,
            "mood": null,
            "arabicspecial": "\u0625\u0650\u0646\u0651",
            "state": null,
            "arabiclemma": "\u0625\u0650\u0646\u0651",
            "gid": 116333,
            "type": "Particles",
            "aya_id": 1,
            "arabictoken": null,
            "form": null,
            "pos": "Accusative particle",
            "arabiccase": "\u0645\u0646\u0635\u0648\u0628",
            "part": "\u062c\u0630\u0639",
            "normalized": "\u0625\u0646\u0627\u0653",
            "case": "Accusative case",
            "sura_id": 108,
            "word": "\u0625\u0650\u0646\u0651\u064e\u0627\u0653",
            "derivation": null,
            "arabicpos": "\u062d\u0631\u0641 \u0646\u0635\u0628",
            "person": null,
            "token": null,
            "gender": null,
            "voice": null,
            "order": 1
          },
          "2": {
            "arabicroot": "\u0639\u0637\u0648",
            "arabicmood": null,
            "number": "\u062c\u0645\u0639",
            "spelled": "\u0627\u0639\u0637\u064a\u0646\u0670\u0643",
            "aspect": "Perfect verb",
            "word_gid": 75872,
            "word_id": 2,
            "mood": null,
            "arabicspecial": null,
            "state": null,
            "arabiclemma": null,
            "gid": 116335,
            "type": "Verbs",
            "aya_id": 1,
            "arabictoken": null,
            "form": "Fourth form",
            "pos": "Verb",
            "arabiccase": null,
            "part": "\u062c\u0630\u0639",
            "normalized": "\u0623\u0639\u0637\u064a\u0646\u0670\u0643",
            "case": null,
            "sura_id": 108,
            "word": "\u0623\u064e\u0639\u0652\u0637\u064e\u064a\u0652\u0646\u064e\u0670\u0643\u064e",
            "derivation": null,
            "arabicpos": "\u0641\u0639\u0644",
            "person": "\u0645\u062a\u0643\u0644\u0645",
            "token": null,
            "gender": "\u0645\u0630\u0651\u0643\u0631",
            "voice": null,
            "order": 1
          },
          "3": {
            "arabicroot": null,
            "arabicmood": null,
            "number": null,
            "spelled": "\u0671\u0644\u0643\u0648\u062b\u0631",
            "aspect": null,
            "word_gid": 75873,
            "word_id": 3,
            "mood": null,
            "arabicspecial": null,
            "state": null,
            "arabiclemma": null,
            "gid": 116337,
            "type": "determiner",
            "aya_id": 1,
            "arabictoken": "\u0627\u0644",
            "form": null,
            "pos": null,
            "arabiccase": null,
            "part": "\u0633\u0627\u0628\u0642",
            "normalized": "\u0671\u0644\u0643\u0648\u062b\u0631",
            "case": null,
            "sura_id": 108,
            "word": "\u0671\u0644\u0652\u0643\u064e\u0648\u0652\u062b\u064e\u0631\u064e",
            "derivation": null,
            "arabicpos": null,
            "person": null,
            "token": "al",
            "gender": null,
            "voice": null,
            "order": 1
          }
        }
      }
    },
    "translation_info": {}
  },

  "error": {
    "code": 0,
    "msg": "success ## action=search ; query=\u0627\u0644\u0643\u0648\u062b\u0631"
  }
}
```

يوضح هذا البنية: تحت `ayas`، كل نتيجة لديها `identifier` (معرف الآية العام، معرف/اسم السورة)، نص الآية وأي وسائط مطلوبة (على سبيل المثال `recitation`)، بالإضافة إلى الآيات المجاورة الاختيارية (`prev_aya`/`next_aya`). كائن `sura` يصف معلومات الفصل (id، الاسم، ترتيب الوحي، عدد الكلمات، إلخ). كائن `annotations` (إذا تم تفعيله) يعطي تفاصيل لغوية لكل كلمة (الجذور، جزء الكلام، الحالة، إلخ)
(إذا حدث أي خطأ، كتلة الخطأ تبلغ عنه.)

## [الهندسة المعمارية وبنية الكود](#جدول-المحتويات)

ألفانوس منظم في عدة حزم Python. API الأساسي موجود في حزمة `alfanous`، والتي تحتوي على وحدات لكل خطوة من المعالجة:

- **Data.py** – يحمل نص القرآن، الترجمات، والجداول المساعدة (من JSON أو قاعدة البيانات).
- **TextProcessing.py** – يعيد تطبيع وفهرسة النص العربي (معالجة التشكيل، التطبيع).
- **QueryProcessing.py** – يحلل استعلام المستخدم، يطبق المنطق المنطقي ويبني استعلام Whoosh.
- **Indexing.py / Searching.py** – يدير وينفذ عمليات البحث على فهارس Whoosh.
- **ResultsProcessing.py** – ينسق نتائج البحث الخام في بنية JSON.
- **Suggestions.py** – يولد اقتراحات الإملاء عند استخدام `action=suggest`.
- **Romanization.py** – يحول النص العربي إلى مخططات النسخ اللاتينية.
- **Threading.py** – يدعم الاستعلامات متعددة الخيوط للبحوث الكبيرة.
- **Configs/Resources**: بيانات القرآن واللغوية الثابتة مخزنة تحت `resources/` (JSON) ومترجمة إلى Python في `dynamic_resources/` للسرعة. فهارس Whoosh نفسها مخزنة في `indexes/`
  ملفات التكوين (`configs/`) تسمح بتخصيص السلوكيات الافتراضية.

- **alfanous-import**: حزمة أداة منفصلة لبناء وتحديث البيانات. لديها أدوات لتنزيل الموارد الخام، تحليلها، وتشغيل Transformer الذي يملأ قاعدة البيانات وينشئ فهارس Whoosh.

هذا التصميم المعياري يجعل المحرك قابلًا للتمديد: على سبيل المثال، إضافة مخطط تحويل صوتي جديد يتضمن تحديث Romanization.py، وواجهة بحث جديدة يمكنها ببساطة استدعاء API.

## [التطوير والمساهمة](#جدول-المحتويات)

مرخص تحت **AGPL-3.0**.
استنسخ وابنِ محليًا للتطوير:

```bash
git clone https://github.com/Alfanous-team/alfanous.git
cd alfanous
make build
```

قبل البناء، تحتاج إلى إجراء بعض التغييرات على الكود المصدري إذا كنت بحاجة لتشغيله مع python 3:

1. في `MAKEFILE`، تحتاج إلى التأكد من أنه لا يحاول تشغيل البرامج النصية مع python 2. فعلت ذلك على النحو التالي، ولكن يمكنك القيام بذلك كما تراه مناسبًا.

```bash
## Python version and command
PYTHON_VERSION_MAJ=$(shell python -c 'import sys; print(sys.version_info[0])')
ifeq '$(PYTHON_VERSION_MAJ)' '3'
PYTHON_COMMAND="python3"
else
PYTHON_COMMAND="python"
endif
```

2. الكود قديم ويستخدم صيغة python2، لذلك تحتاج إلى إجراء تغييرات لجعله يعمل. على سبيل المثال:

   1. العديد من عبارات `print` تستخدم الصيغة القديمة.
   2. في العديد من الأماكن، الكود يستخدم طريقة قديمة للقاموس `has_key()`، لذلك تحتاج إلى استخدام الصيغة الجديدة، `key in dict`.
   3. يستخدم نوع بيانات مهجور `Encode`، لذلك تحتاج إلى تغييره إلى `str` إذا لم يكن كذلك بالفعل.
   4. إلخ...
      > إذا كنت بحاجة إلى جميع التغييرات التي قمت بها بالفعل، يمكنك استخدام [نسختي المحدثة من المشروع](https://github.com/IbrahimMurad/alfanous).

3. تحتاج إلى تثبيت بعض الحزم المطلوبة، `pyparsing`، `epydoc`، `sphinx`.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip3 install pyparsing epydoc sphinx
```

4. غيّر `cgi` إلى `html` في `/src/alfanous/Support/whoosh/highlight.py`

```python
from html import escape as htmlescape
```

## [الموارد](#جدول-المحتويات)

- [Tanzil](../resources/tanzil-AR.md): لنص القرآن والترجمات.
- [QuranCorpus](https://corpus.quran.com/): للمجموعة القرآنية.

## [الترخيص](#جدول-المحتويات)

ترخيص AGPL-3.0
