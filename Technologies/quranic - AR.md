# محرك البحث الدلالي القرآني - وثيقة المراجعة

**تاريخ المراجعة:** 2025-11-11  

**المراجع:** [Ibrahim Morad](https://github.com/IbrahimMurad/)  

**مستودع المشروع**: [https://github.com/kyb3r/quranic](https://github.com/kyb3r/quranic)

**إصدار المشروع:** 0.0.1

---

## الملخص التنفيذي

ينفذ هذا المشروع محرك بحث دلالي للترجمات القرآنية والحديثية باستخدام تضمينات الجمل. يدعم النظام نماذج تضمين متعددة (متغيرات SGPT، CocoSearch، و Instructor Embedding) ويوفر واجهة برمجية بسيطة للبحث في النصوص الدينية دلالياً.

---

## 1. نظرة عامة على المشروع

### 1.1 الغرض
- البحث الدلالي في ترجمات القرآن (ترجمة Clear Quran)
- البحث الدلالي في مجموعات الحديث (البخاري ومسلم)
- استخدام تضمينات الجمل للعثور على آيات/أحاديث متشابهة دلالياً

### 1.2 الميزات الرئيسية
- دعم نماذج تضمين متعددة (SGPT، CocoSearch، Instructor)
- تضمينات محسوبة مسبقاً للبحث الأسرع
- واجهة برمجية Python بسيطة
- دعم مجموعات القرآن والحديث

### 1.3 المكدس التقني
- **Python** (مختبر على Python 3.11.14)
- **PyTorch** (مختبر على PyTorch 2.9.0)
- **Transformers** 4.27.1
- **NumPy** (مختبر على NumPy 2.3.4)
- **Sentence Transformers** (مختبر على 5.1.2)
- **Instructor Embedding** (مختبر على 1.0.1)

---

## 2. البنية والتصميم

### 2.1 هيكل الكود

```bash
quranic/
├── __init__.py          # Exports SearchEngine, Quran, HadithCollection
├── engine.py            # Embedding models (SemanticSearch, CocoSearch, Instructor)
├── corpus.py            # Main search engine and data structures
└── data/                # Pre-computed embeddings and text files
    ├── translation-clear-quran.txt
    ├── surah_names.txt
    ├── bukhari.txt
    ├── muslim.txt
    └── *-instruct       # Pre-computed embeddings
    └── *-embeddings      # Pre-computed embeddings
```

### 2.3 المكونات الرئيسية

#### SearchEngine (corpus.py)
- الواجهة الرئيسية للبحث الدلالي
- يدير تضمينات المستندات وعمليات البحث
- يدعم التحميل الكسول للتضمينات المحسوبة مسبقاً

#### نماذج التضمين (engine.py)
- **SemanticSearch**: نماذج SGPT مع تجميع متوسط مرجح
- **CocoSearch**: نموذج CocoDR للتضمينات
- **Instructor**: نموذج Instructor Embedding (موصى به من المؤلف)

#### هياكل البيانات
- **Surah**: يمثل سورة من القرآن
- **Verse**: آية فردية مع ترجمة
- **Hadith**: نص حديث فردي
- **HadithCollection**: مجموعة أحاديث

---

## 3. التبعيات والتوافق

### 3.1 تحليل التبعيات

**التبعيات الحالية:**
```python
transformers==4.25.1  # Released: Nov 2022
torch==1.13.1        # Released: Oct 2022
numpy==1.24.1        # Released: Feb 2023
sentence_transformers  # Version not specified
```

**المشاكل:**
- ⚠️ التبعيات قديمة أكثر من سنتين
- ⚠️ إصدار `sentence_transformers` غير محدد (تغييرات محتملة كاسرة)
- ⚠️ `InstructorEmbedding` مفقود في setup.py (مطلوب لكن غير مدرج)
- ⚠️ لا يوجد متطلب إصدار Python محدد
- ⚠️ لا يوجد ملف requirements.txt

### 3.2 مخاوف التوافق
- PyTorch القديم قد لا يعمل مع إصدارات CUDA الأحدث
- Transformers 4.25.1 قد يكون لديه مشاكل أمنية
- قد لا يعمل مع Python 3.11+
- تبعية مفقودة: حزمة `InstructorEmbedding`

---
## 4. ملاحظاتي

### الملاحظات العامة

- تطلب الكثير من التحديثات للتبعيات لجعله يعمل.
- ليس مشروعاً جاهزاً للإنتاج.
- الكود غير منظم بشكل جيد وليس سهلاً للفهم بسبب نقص التوثيق واتفاقيات التسمية.

### ملاحظات الاختبار

- تم الاختبار مع الاستعلامات الموجودة مسبقاً ومع استعلامات جديدة.
- النتائج دائماً غير دقيقة.
- هناك نتيجة أولى دائماً نفسها لمعظم الاستعلامات وهي (سورة المرسلات آية 23) والتي ليست دائماً النتيجة الأكثر صلة.
- النتائج بالإنجليزية بدون دعم للنص العربي.
- يعطي نتائج حتى للاستعلامات غير ذات الصلة مثل "Hello, how are you?" والتي لا تتعلق بالقرآن أو الحديث.

