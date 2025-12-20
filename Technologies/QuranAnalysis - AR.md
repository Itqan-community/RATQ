# Quran Analysis - التوثيق الكامل

## جدول المحتويات

1. [المقدمة](#المقدمة)
2. [نظرة عامة على المشروع](#نظرة-عامة-على-المشروع)
3. [بنية النظام](#بنية-النظام)
4. [المكونات الأساسية](#المكونات-الأساسية)
5. [شرح خوارزمية البحث](#شرح-خوارزمية-البحث)
6. [مرجع API](#مرجع-api)
7. [الاعتمادات والترخيص](#الاعتمادات-والترخيص)

---

## المقدمة

**Quran Analysis (QA)** هو نظام بحث دلالي ذكي للقرآن. يوفر قدرات بحث متقدمة تشمل:

- **البحث الدلالي**: يفهم المعنى، وليس فقط الكلمات المفتاحية
- **التحليل الصرفي**: يبحث في جذور الكلمات ومشتقاتها
- **الإجابة على الأسئلة**: يحاول الإجابة على أسئلة حول القرآن
- **البحث القائم على الأنطولوجيا**: يستخدم علاقات المفاهيم
- **دعم متعدد الخطوط**: العربية (البسيط/العثماني) والإنجليزية
- **التصور**: رسوم بيانية وإحصائيات تفاعلية

## الروابط

- الكود المصدري: [url](https://github.com/karimouda/qurananalysis/)
- الويب: [url](https://qurananalysis.com/)

## الميزات الرئيسية

- البحث النصي الكامل مع التوسع الصرفي
- البحث بالعبارة مع المطابقة الدقيقة
- نظام الإجابة على الأسئلة
- البحث القائم على المفاهيم في الأنطولوجيا
- البحث بالحروف اللاتينية (العربية الصوتية)
- استخراج جذر الكلمة والجذع
- رسوم بيانية معرفية تفاعلية
- التحليل الإحصائي والتصورات

---

## نظرة عامة على المشروع

### التاريخ

بدأ Quran Analysis كمشروع ماجستير في جامعة ليدز في 2015، تحت إشراف Eric Atwell. الهدف كان:

1. دمج أبحاث معالجة اللغة الطبيعية القرآنية السابقة
2. توفير إطار عمل مفتوح المصدر لتحليل القرآن
3. تمكين قدرات البحث الدلالي
4. تسهيل البحث الأكاديمي

### المكدس التقني

- **الخلفية**: PHP 5.3+
- **التخزين المؤقت**: APC (Alternative PHP Cache)
- **الواجهة الأمامية**: HTML, CSS, JavaScript
- **التصور**: D3.js
- **تنسيقات البيانات**: XML, TXT, OWL (أنطولوجيا)

### الموارد الخارجية

1. **[مشروع Tanzil](./tanzil.md)**: نص القرآن (البسيط/العثماني)، الترجمات، الحروف اللاتينية
2. **[Quranic Arabic Corpus (QAC)](https://corpus.quran.com/)**: التعليقات الصرفية، وسم أجزاء الكلام
3. **Qurana**: حل الإشارة الضميرية
4. **WordNet**: قاموس دلالي إنجليزي
5. **DBPedia**: بيانات دلالية منظمة
6. **Microsoft Translator API**: خدمات الترجمة

---

## بنية النظام

### البنية عالية المستوى

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────────┐
│  Apache/PHP     │
│  Web Server     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  APC Memory     │◄──── All models cached here
│  Cache Layer    │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────────┐
│  Data Processing Layer      │
├─────────────────────────────┤
│ • Query Analyzer            │
│ • Inverted Index Search     │
│ • QAC Morphology Processor  │
│ • Ontology Reasoner         │
│ • Question Answering Engine │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────┐
│  Data Files     │
├─────────────────┤
│ • Quran Text    │
│ • QAC Corpus    │
│ • Ontology      │
│ • WordNet       │
└─────────────────┘
```

### هيكل نموذج الذاكرة

كل شيء مخزن مؤقتاً في APC بمفاتيح هرمية:

```
{LANG}/MODEL/{MODEL_TYPE}/{KEY}/{ENTRY}

Examples:
- AR/MODEL_CORE/QURAN_TEXT/[sura][aya]
- AR/MODEL_SEARCH/INVERTED_INDEX/{word}
- ALL/MODEL_QA_ONTOLOGY/CONCEPTS/{concept_id}
- AR/MODEL_QAC/QAC_MASTERTABLE/{location}
```

---

## المكونات الأساسية

### 1. المكتبة الأساسية (`libs/core.lib.php`)

**الغرض**: وظائف الأساس للنظام بأكمله

**الوظائف الرئيسية**:

- `loadModels()` - يحمّل ويخزن مؤقتاً جميع نماذج البيانات
- `getModelEntryFromMemory()` - يسترجع البيانات المخزنة مؤقتاً من APC
- `addValueToMemoryModel()` - يخزن البيانات في ذاكرة APC المؤقتة
- `myLevensteinEditDistance()` - يحسب تشابه السلاسل (متعدد اللغات)
- `removeTashkeel()` - يزيل علامات التشكيل العربية
- `isArabicString()` - يكتشف النص العربي
- `buckwalterReverseTransliteration()` - يحول Buckwalter إلى العربية

**الميزات**:

- عمليات سلاسل متعددة اللغات
- معالجة أحرف آمنة لـ Unicode
- توحيد النص العربي
- أدوات إدارة الذاكرة

---

### 2. مكتبة البحث (`libs/search.lib.php`)

**الغرض**: وظيفة البحث الأساسية والترتيب

**الوظائف الرئيسية**:

#### توسيع الاستعلام

- `posTagUserQuery()` - وسم أجزاء الكلام للاستعلامات
- `extendQueryWordsByDerivations()` - يضيف صيغ الجمع والمفرد
- `extendQueryWordsByConceptTaxRelations()` - يضيف مفاهيم ذات صلة من الأنطولوجيا
- `extendQueryByExtractingQACDerviations()` - يستخرج جذور/جذوع العربية

#### البحث والترتيب

- `getScoredDocumentsFromInveretdIndex()` - يبحث في الفهرس المقلوب
- `getSimilarWords()` - يجد كلمات مشابهة للاقتراحات
- `getDistanceByCommonUniqueChars()` - مقياس تشابه ثانوي

#### معالجة النتائج

- `printResultVerses()` - يعرض نتائج البحث مع التمييز
- `getStatsByScoringTable()` - يولد إحصائيات البحث
- `searchResultsToWordcloud()` - ينشئ سحابة كلمات من النتائج

**صيغة التقييم**:

```php
SCORE = (FREQ / 2) +                    // Term frequency
        (DISTANCE * 1) +                // Word proximity
        (QUERY_WORDS_IN_VERSE * 10) +   // Unique query terms
        (PRONOUNS * 1) +                // Pronoun matches
        (WORD_OCCURENCES_COUNT * 1) +   // Total occurrences
        (IS_FULL_QUERY_IN_VERSE * 20)   // Exact phrase match
```

---

### 3. الإجابة على الأسئلة (`libs/question.answering.lib.php`)

**الغرض**: يجيب على أسئلة حول محتوى القرآن

**الوظائف الرئيسية**:

- `answerUserQuestion()` - منسق QA الرئيسي
- `containsQuestionWords()` - يكتشف نوع السؤال
- `removeQuestionCluesFromArr()` - ينظف الاستعلام للبحث

**أنواع الأسئلة المدعومة**:

| الإنجليزية  | العربية              | النوع     |
| -------- | ------------------- | -------- |
| who      | من هو، من هم، من هى | Person   |
| what     | ما هو، ما هى، ماذا  | General  |
| how many | كم                  | Quantity |
| how long | -                   | Time     |

**عملية QA**:

1. اكتشاف نوع السؤال (من، ما، إلخ)
2. استخراج مفاهيم السؤال
3. العثور على مفاهيم ذات صلة في الأنطولوجيا
4. البحث عن آيات ذات صلة
5. إعادة التقييم بناءً على:
   - المفاهيم المشتركة (×10)
   - مفاهيم نوع السؤال (×10)
   - الجذور المشتركة (×10)
   - المشتقات المشتركة (×10)
6. إرجاع أفضل 3 إجابات

---

### 4. مكتبة الأنطولوجيا (`libs/ontology.lib.php`)

**الغرض**: يدير أنطولوجيا QA (المفاهيم والعلاقات)

**هيكل الأنطولوجيا**:

```
Concepts:
- Classes (categories): animal, person, place
- Instances (specific items): horse, Moses, Mecca

Relations:
- is-a: horse is-a animal
- has-property: Moses has-property prophet
- located-in: Kaaba located-in Mecca

Metadata:
- Arabic labels
- English labels
- Frequency in Quran
- Wikipedia links
- Images
```

**الوظائف الرئيسية**:

- `buildRelationHashID()` - ينشئ معرف علاقة فريد
- `stripOntologyNamespace()` - ينظف مساحات الأسماء OWL
- `cleanWordnetCollocation()` - يوحد عبارات WordNet

---

### 5. مكتبة الرسم البياني (`libs/graph.lib.php`)

**الغرض**: يولد تصورات D3.js

**الوظائف الرئيسية**:

- `ontologyTextToD3Graph()` - ينشئ رسوم بيانية معرفية من نتائج البحث
- `createNewConceptObj()` - يبني عقد الرسم البياني
- `formatEnglishConcept()` - ينسق تسميات المفاهيم

**أنواع التصور**:

1. **رسم بياني موجه بالقوة**: المفاهيم والعلاقات
2. **خريطة شجرية هرمية**: تصنيف المفاهيم
3. **سحب الكلمات**: تصور تكرار المصطلحات
4. **مخططات إحصائية**: توزيع نتائج البحث

---

### 6. وسم أجزاء الكلام (`libs/pos.tagger.lib.php`)

**الغرض**: وسم أجزاء الكلام للاستعلامات الإنجليزية

**مبني على**: مكتبة PHPIR مع معجم Brown Corpus

**الوسوم المستخدمة**:

- `NN` - اسم، مفرد
- `NNS` - اسم، جمع
- `VB` - فعل، صيغة أساسية
- `VBD` - فعل، ماضي
- `VBG` - فعل، مصدر/اسم فاعل
- `JJ` - صفة

**العملية**:

1. تقسيم الاستعلام إلى وحدات
2. البحث عن كل كلمة في المعجم
3. تطبيق قواعد التحويل
4. إرجاع الكلمات المميزة

---

## شرح خوارزمية البحث

### **نظرة عامة على البنية**

هذا **محرك بحث دلالي** مع:

- **فهرس مقلوب** للبحث السريع
- تكامل **QAC (Quranic Arabic Corpus)** للتحليل الصرفي
- توسيع استعلام **قائم على الأنطولوجيا**
- قدرات **الإجابة على الأسئلة**
- **دعم متعدد الخطوط** (العربية العثمانية/البسيطة، الإنجليزية)

---

### هياكل البيانات الأساسية

### 1. نموذج الذاكرة (ذاكرة APC المؤقتة)

كل شيء مخزن في APC (Alternative PHP Cache) بمفاتيح هرمية:

```
{LANG}/MODEL/{MODEL_TYPE}/{KEY}/{ENTRY}

Examples:
- AR/MODEL_CORE/QURAN_TEXT/[sura][aya]
- AR/MODEL_SEARCH/INVERTED_INDEX/{word}
- ALL/MODEL_QA_ONTOLOGY/CONCEPTS/{concept_id}
- AR/MODEL_QAC/QAC_MASTERTABLE/{location}
```

### 2. هيكل الفهرس المقلوب

```php
INVERTED_INDEX[word] = [
    [
        'SURA' => 0,
        'AYA' => 5,
        'INDEX_IN_AYA_EMLA2Y' => 3,      // Position in simple text
        'INDEX_IN_AYA_UTHMANI' => 3,     // Position in Uthmani
        'WORD_TYPE' => 'ROOT'|'LEM'|'NORMAL_WORD'|'PRONOUN_ANTECEDENT',
        'EXTRA_INFO' => 'additional context'
    ],
    // ... more occurrences
]
```

### 3. جدول QAC الرئيسي

```php
QAC_MASTERTABLE[sura:aya:word] = [
    segment_index => [
        'FORM_AR' => 'الكتاب',
        'FORM_EN' => 'AlkitAb',
        'TAG' => 'NN',  // Part of speech
        'FEATURES' => [
            'ROOT' => 'كتب',
            'LEM' => 'كِتَاب',
            'STEM' => '...'
        ]
    ]
]
```

### 4. هيكل الأنطولوجيا

```php
CONCEPTS[concept_id] = [
    'label_ar' => 'حيوان',
    'label_en' => 'animal',
    'frequency' => 50,
    'weight' => 0.85,
    'meaning_wordnet_en' => 'living organism',
    'image_url' => '...'
]

RELATIONS[hash] = [
    'SUBJECT' => 'horse',
    'VERB' => 'هو',  // is-a
    'OBJECT' => 'animal',
    'FREQUENCY' => 10
]

GRAPH_INDEX_SOURCES[concept] = [ all relations where concept is source ]
GRAPH_INDEX_TARGETS[concept] = [ all relations where concept is target ]
```

---

### تدفق البحث الكامل - خطوة بخطوة

### المرحلة 1: تحليل الاستعلام (`query.handling.common.php`)

#### 1.1 اكتشاف اللغة

```php
isArabicString($query) → sets $lang = "AR" or "EN"
```

#### 1.2 اكتشاف نوع البحث

```php
- Phrase: Contains quotes "exact phrase"
- Question: Contains ? or question words (who, what, من, ما)
- Chapter/Verse: Pattern like "2:255" or just "2"
- Concept: Prefix "CONCEPTSEARCH:"
- Transliteration: English phonetic Arabic
- Normal: Default keyword search
```

#### 1.3 تنظيف الاستعلام

```php
For Arabic:
1. convertUthamniQueryToSimple() - removes diacritics
2. removeNonArabicAndSpaceChars() - strips non-Arabic
3. Keeps ال (Al-) prefix

For English:
1. strtolower()
2. removeSpecialCharactersFromMidQuery()
```

---

### المرحلة 2: توسيع الاستعلام (`search.lib.php`)

هذا هو المكان الذي يحدث فيه **السحر** - تحويل استعلام بسيط إلى بحث شامل.

#### 2.1 وسم أجزاء الكلام (`posTagUserQuery`)

```php
For English:
- Uses PHPIR lexicon-based tagger
- Tags: NN (noun), VB (verb), JJ (adjective), etc.
- Example: "good book" → [good/JJ, book/NN]

For Arabic:
- Uses stopword list
- Everything not a stopword = NN (noun)
```

#### 2.2 توسيع المشتقات (`extendQueryWordsByDerivations`)

**المشتقات الإنجليزية:**

```php
Input: "book"
Process:
- If POS = NN → add plural: "books"
- If POS = NNS → add singular: "book"

Output: ["book", "books"]
```

**المشتقات العربية (معقدة!):**

```php
Input: "حيوان" (animal)

Step 1: Search ontology for similar words
- Use myLevensteinEditDistance() ≤ 5 chars
- Use getDistanceByCommonUniqueChars()

Step 2: Handle Arabic patterns
- If word ends with "ات" → mark as NNS (plural)
  Example: "حيوانات" ← "حيوان"
- If word starts with "ال" → handle definite article
  Example: "الحيوانات" ← "حيوان"

Step 3: Find all morphological variants
- Searches concept synonyms
- Checks if concepts are related by "ات" or "ال" patterns

Output: ["حيوان", "حيوانات", "الحيوان", "الحيوانات"]
```

**التعرف على الأنماط:**

```php
getStringDiff($word1, $word2) determines:
- "ات" = plural suffix
- "ال" = definite article
- "الات" = definite + plural

Example:
حيوان → الحيوانات
Diff = "الات" → valid plural derivation
```

#### 2.3 توسيع الأنطولوجيا (`extendQueryWordsByConceptTaxRelations`)

**علاقات IS-A (التصنيف):**

```php
Input: "horse"

Step 1: Find in ontology
- Translate EN→AR: "horse" → "حصان"

Step 2: Find IS-A relations
- INBOUND: X is-a horse → ["mare", "stallion"]
- OUTBOUND: horse is-a X → ["animal", "mammal"]

Step 3: Add to query
Output: ["horse", "mare", "stallion", "animal", "mammal"]
```

**للأسئلة - علاقات الفعل:**

```php
Input: "who created man?"
Query terms: ["create", "man"]

Step 1: Extract verb "create"
Step 2: Find verb relations in VERB_INDEX:
- create(SUBJECT=Allah, OBJECT=man)
- create(SUBJECT=Allah, OBJECT=earth)

Step 3: Add related concepts:
Output: ["create", "man", "Allah", "earth"]
```

**توسيع المرادفات:**

```php
SYNONYMS_INDEX["righteous"] = "صالح"

If word is a synonym → add main concept
Output: ["righteous", "صالح"]
```

#### 2.4 استخراج مشتقات QAC (`extendQueryByExtractingQACDerviations`)

**للعربية فقط:**

```php
Input: "كتاب" (book)

Step 1: Look up word in INVERTED_INDEX
→ Find all verses containing "كتاب"

Step 2: For each occurrence:
- Get QAC location: "2:1:5" (sura:aya:word)
- Lookup QAC_MASTERTABLE["2:1:5"]

Step 3: Extract morphological info:
- ROOT: "كتب" (k-t-b)
- LEM: "كِتَاب" (lemma)
- STEM: base form

Step 4: Add to query:
Output: ["كتاب", "كتب", "كِتَاب", "يكتب", "كاتب", ...]
         (book, write, book, writes, writer, ...)
```

**تعيين العثماني ↔ البسيط:**

```php
// Uthmani (with diacritics) → Simple (without)
UTHMANI_TO_SIMPLE_WORD_MAP["ٱلْكِتَٰبِ"] = "الكتاب"

// Used to convert QAC results back to searchable text
```

---

### المرحلة 3: بحث الفهرس (`getScoredDocumentsFromInveretdIndex`)

#### 3.1 بحث العمود (السورة/الآية)

```php
If searching for "2:255":
- Directly return that verse with SCORE=1
- Skip inverted index entirely
```

#### 3.2 البحث في الفهرس المقلوب

```php
For each word in extendedQueryWordsArr:

    1. Fetch from index:
       invertedIndexEntry = INVERTED_INDEX[word]

    2. For each document (verse) containing word:
       - Extract: SURA, AYA, WORD_INDEX, WORD_TYPE

    3. Phrase search check:
       if isPhraseSearch:
           - Use regex: "/(^|[ ])$query([ ]|\$)/umi"
           - Only keep if FULL query matches
           - Skip if not found

    4. Initialize scoring entry:
       scoringTable[SURA:AYA] = {
           SCORE: 0,
           FREQ: 0,
           DISTANCE: 0,
           WORD_OCCURENCES_COUNT: 0,
           QUERY_WORDS_IN_VERSE: 0,
           IS_FULL_QUERY_IN_VERSE: 0,
           POSSIBLE_HIGHLIGHTABLE_WORDS: [],
           PRONOUNS: []
       }
```

#### 3.3 معالجة نوع الكلمة

```php
If WORD_TYPE == "PRONOUN_ANTECEDENT":
    // Mark pronoun location
    scoringTable[verse]['PRONOUNS'][pronoun_text] = word_index

If WORD_TYPE == "ROOT" or "LEM":
    // Add segment form + converted simple form
    segment_word = getItemFromUthmaniToSimpleMappingTable(EXTRA_INFO)
    scoringTable[verse]['POSSIBLE_HIGHLIGHTABLE_WORDS'][segment_word] = type

If WORD_TYPE == "NORMAL_WORD":
    // Add exact word
    scoringTable[verse]['POSSIBLE_HIGHLIGHTABLE_WORDS'][word] = type
```

#### 3.4 حساب التقييم

```php
SCORE = (FREQ / 2) +                    // Term frequency (low weight)
        (DISTANCE * 1) +                // Word proximity
        (QUERY_WORDS_IN_VERSE * 10) +   // Unique terms (high weight!)
        (PRONOUNS * 1) +                // Pronoun matches
        (WORD_OCCURENCES_COUNT * 1) +   // Total occurrences
        (IS_FULL_QUERY_IN_VERSE * 20)   // Exact phrase (highest!)
```

**لماذا هذا التقييم؟**

- **العبارات الدقيقة تحصل على 20 نقطة** - الأولوية الأعلى
- **المزيد من مصطلحات الاستعلام = 10 نقاط لكل منها** - التنوع مهم
- **تكرار المصطلح = 0.5 نقطة** - يمنع الرسائل غير المرغوب فيها من الكلمات عالية التكرار

---

### المرحلة 4: الإجابة على الأسئلة (`answerUserQuestion`)

**للأسئلة فقط:**

#### 4.1 استخراج نوع السؤال

```php
containsQuestionWords("who created man?", "EN")
→ Returns "Person"

Question types:
- "who" → Person
- "what" → General
- "how many" → Quantity
- "how long" → Time
```

#### 4.2 الحصول على مفاهيم نوع السؤال

```php
questionType = "Person"
conceptID = "person" (from ontology)

Find all IS-A relations where target = person:
- Adam is-a person
- Moses is-a person
- Noah is-a person

questionTypeConceptsArr = ["Adam", "Moses", "Noah", ...]
```

#### 4.3 تقييم مرشحي الإجابة

```php
For each verse in results:

    1. Extract concepts from verse text
    2. Calculate similarity factors:

    COMMON_CONCEPTS = intersection(question_concepts, verse_concepts) * 10
    COMMON_QUESTION_TYPE = intersection(question_type_concepts, verse_concepts) * 10
    COMMON_ROOTS = intersection(question_roots, verse_roots) * 10
    COMMON_DERIVATIONS = shared_word_substrings * 10

    3. Update score:
    SCORE += COMMON_CONCEPTS + COMMON_QUESTION_TYPE +
             COMMON_ROOTS + COMMON_DERIVATIONS
```

#### 4.4 إرجاع أفضل الإجابات

```php
// Sort by new scores
rsortBy($scoredAnswers, 'SCORE')

// Return top 3 verses
return array_slice($scoredAnswers, 0, 3)
```

---

### المرحلة 5: مقاييس التشابه (`core.lib.php`)

#### 5.1 مسافة Levenshtein (`myLevensteinEditDistance`)

```php
// Classic dynamic programming algorithm
// Multilingual support (uses mb_substr)

Example:
word1 = "كتاب"
word2 = "كتب"

Matrix:
    ""  ك  ت  ب
""   0  1  2  3
ك    1  0  1  2
ت    2  1  0  1
ا    3  2  1  1
ب    4  3  2  1

Distance = 1 (one deletion)
```

#### 5.2 الأحرف الفريدة المشتركة (`getDistanceByCommonUniqueChars`)

```php
word1 = "كتاب"
word2 = "كتابة"

unique_chars(word1) = [ك, ت, ا, ب]
unique_chars(word2) = [ك, ت, ا, ب, ة]
intersection = [ك, ت, ا, ب]

score = 4 (common chars)
+ 1 (same first char: ك)
+ 0 (different last: ب ≠ ة)
= 5
```

#### 5.3 التشابه المدمج (`getSimilarWords`)

```php
For each word in corpus:
    if abs(len(word) - len(query)) <= 3:
        edit_dist = getDistanceBetweenWords(word, query)

        if edit_dist <= 3:
            similarity = (1/edit_dist) + commonUniqueChars(word, query)

// Sort by similarity (descending)
// Return top matches
```

---

### المرحلة 6: معالجة النتائج

#### 6.1 التمييز (`printResultVerses`)

```php
For each verse:
    1. Mark query words:
       $TEXT = preg_replace("/(word1|word2)/", "<marked>\\1</marked>", $TEXT)

    2. Mark pronouns:
       For each pronoun:
           markSpecificWordInText($TEXT, pronoun_index, pronoun_text, "marked")

    3. Mark prospect answers (for questions):
       For each significant_collocation_word:
           markWordWithoutWordIndex($TEXT, word, "marked_prospect_answer")
```

#### 6.2 الإحصائيات (`getStatsByScoringTable`)

```php
uniqueSuras = count(unique sura IDs)
uniqueVerses = count(unique sura:aya pairs)
totalRepetitions = sum(word occurrences)

return [
    'UNIQUE_REP' => totalRepetitions,
    'CHAPTERS_COUNT' => uniqueSuras,
    'VERSES_COUNT' => uniqueVerses
]
```

#### 6.3 سحابة الكلمات (`searchResultsToWordcloud`)

```php
For each verse in results:
    words = split(verse)
    For each word:
        if not stopword:
            wordCloud[word]++

// Sort by frequency
// Return top 50
```

---

### الميزات المتقدمة

#### 1. البحث بالحروف اللاتينية

```php
If English + not question + word in TRANSLITERATION_WORDS_INDEX:
    isTransliterationSearch = true

    // Search phonetic Arabic
    // e.g., "bismillah" → finds "بسم الله"
```

#### 2. الحروف اللاتينية Buckwalter

```php
// Arabic ↔ ASCII encoding for QAC
arabicToBuckwalter("الْكِتَابِ")
→ "AlkitAbi"

buckwalterReverseTransliteration("AlkitAbi")
→ "الْكِتَابِ"
```

#### 3. تحويل الخط

```php
shallowUthmaniToSimpleConversion():
    1. Remove all diacritics
    2. Replace "ءا" → "آ"
    3. Replace final "ى" → "ي"
    4. Replace superscript alef (ٰ) → "ا"
    5. Replace alef wasla (ٱ) → "ا"
```

#### 4. معالجة علامات الوقف

```php
// Arabic Quran has pause marks: ۗ ۚ ۘ
removePauseMarkFromVerse():
    - Strips all pause marks
    - Used for clean text matching
```

---

### تحسينات الأداء

#### 1. التخزين المؤقت APC

```php
// All models cached in memory
// No file I/O during search
// ~100ms search time
```

#### 2. تحديد الاستعلام

```php
// Max 25 extended query words
if count($extendedQuery) > 25:
    $extendedQuery = array_slice($extendedQuery, 0, 25)
```

#### 3. تحديد المفاهيم

```php
// For Arabic derivations
// Max 10 derived forms
$taggedSignificantWords = array_slice($words, 0, 10)
```

#### 4. الإنهاء المبكر

```php
// For word info lookup with fast=true
if $fast && !empty($versesArr):
    break  // Stop after first result
```

---

### ملخص الخوارزميات الرئيسية

| الخوارزمية             | الغرض            | التعقيد   |
| --------------------- | ------------------ | ------------ |
| Levenshtein Distance  | تصحيح الأخطاء الإملائية    | O(m×n)       |
| Common Unique Chars   | تشابه سريع    | O(m+n)       |
| POS Tagging           | بناء جملة إنجليزي     | O(n)         |
| Ontology Traversal    | توسيع دلالي | O(relations) |
| Inverted Index Lookup | بحث سريع        | O(1) average |
| Dynamic Scoring       | ترتيب الصلة  | O(results)   |

---

### مخطط تدفق البيانات

```
User Query
    ↓
[Language Detection] → AR or EN
    ↓
[Query Cleaning] → Remove noise
    ↓
[POS Tagging] → Identify word types
    ↓
[Derivation Expansion] → Add plurals/variants
    ↓
[Ontology Expansion] → Add related concepts
    ↓
[QAC Expansion] → Add roots/stems (AR only)
    ↓
[Inverted Index Search] → Find matching verses
    ↓
[Scoring] → Rank by relevance
    ↓
[Question Answering?] → YES: Re-score with QA factors
    ↓                    NO: Continue
[Sort Results] → By final score
    ↓
[Highlight] → Mark matched words
    ↓
[Generate Stats] → Charts + metrics
    ↓
Display Results
```

---

## مرجع API

### نقطة نهاية البحث الرئيسية

**URL**: `/search/dosearch.ajax.service.php`

**Method**: GET

**Parameters**:

```
q       - Query string (required)
script  - Display script: 'simple' or 'uthmani' (optional, default: simple)
```

**Example**:

```
GET /search/dosearch.ajax.service.php?q=محمد&script=uthmani
```

**Response**: HTML fragment with search results

---

### معالجة الاستعلام

**URL**: `/search/index.php`

**Method**: GET

**Parameters**:

```
q - Query string (required)
```

**Example**:

```
GET /search/index.php?q=Muhammad
```

**Response**: Full HTML page with results, graphs, and statistics

---

### معدلات الاستعلام

**البحث بالعبارة**:

```
q="exact phrase"
```

**بحث السورة**:

```
q=2          (entire chapter 2)
q=2:255      (chapter 2, verse 255)
```

**بحث المفهوم**:

```
q=CONCEPTSEARCH:animal
```

**القيود**:

```
q=muhammad CONSTRAINT:NODERIVATION
q=muhammad CONSTRAINT:NOEXTENTIONFROMONTOLOGY
```

---

## الاعتمادات والترخيص

### المؤلف الرئيسي

**Karim Ouda**

- مشروع ماجستير، جامعة ليدز (2015)
- المشرف: Eric Atwell
- البريد الإلكتروني: [Contact via website]
- الموقع: https://www.qurananalysis.com

### الترخيص

**GNU General Public License v3.0**

```
Quran Analysis (www.qurananalysis.com)
Full Semantic Search and Intelligence System for the Quran
Copyright (C) 2015 Karim Ouda

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
```

**الاستخدام التجاري**: يمكن استخدام كود Quran Analysis والإطار والمدونات في المواقع أو التطبيقات (تجارية/غير تجارية) بشرط أن يقوم المطور بـ:

- الربط مرة أخرى إلى www.qurananalysis.com
- إعطاء اعتمادات كافية

