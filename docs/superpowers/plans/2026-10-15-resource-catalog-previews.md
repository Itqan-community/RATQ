# خطة تنفيذ نماذج معاينة مكتبة الموارد القرآنية الموثقة (Resource Catalog Previews)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## نظرة عامة والهدف
بناء 7 نماذج عرض تفاعلية ومستقلة بالكامل لصفحة **«مكتبة الموارد القرآنية الموثقة»**، ليتمكن المستخدم من استعراضها ومقارنتها وتقديمها للمدير التقني (CTO). وتوفير قائمة منسدلة أنيقة في رأس الموقع (`SiteHeader.tsx`) على عنصر «مكتبة الموارد» تتيح التنقل المباشر بين هذه النماذج وبين المكتبة الافتراضية.

مع مراعاة تصميم النظام بأسلوب معياري ومستقل تماماً (**Modular & Decoupled**)، بحيث يمكن في المستقبل حذف أو تعديل أي نموذج منها بنقرة زر ودون التأثير على الصفحة الأساسية للمكتبة.

---

## هيكل الملفات المزمع إنشاؤها وتعديلها

### ملفات التكوين والواجهات المشتركة:
* `src/pages/previews/previewConfig.ts`: مصفوفة تعريف النماذج السبعة (المعرف، المسار، العنوان، الوصف، الشارة، الأيقونة).
* `src/components/resources/previews/PreviewHeaderBanner.tsx`: شريط علوي موحد يظهر في كافة صفحات المعاينة لتسهيل التبديل الفوري والرجوع للأصل.

### صفحات المعاينة السبعة (`src/pages/previews/`):
1. `src/pages/previews/SectionsPreviewPage.tsx`: فكرة المدير المحسنة (أقسام رئيسية + شريط قفز لاصق + منع السكرول الطويل).
2. `src/pages/previews/DenseListPreviewPage.tsx`: القائمة البرمجية النحيفة للمحترفين (Raycast / High Density List).
3. `src/pages/previews/ProblemSolutionPreviewPage.tsx`: العرض الموجه حسب المشكلة والحل (Problem-Solution Directory).
4. `src/pages/previews/TreeExplorerPreviewPage.tsx`: مستكشف المجلدات الهرمي القابل للطي (VS Code Tree Explorer).
5. `src/pages/previews/BentoGridPreviewPage.tsx`: العرض الصندوقي الذكي (Bento Grid View).
6. `src/pages/previews/ConversationalPreviewPage.tsx`: شريط الفلترة الحوارية التفاعلية (Guided Conversational Bar).
7. `src/pages/previews/KanbanPreviewPage.tsx`: لوحة كانبان للفرز التقني (Kanban Architecture Board).

### الملفات المعدلة:
* `src/router.tsx`: تسجيل مسارات صفحات المعاينة السبعة.
* `src/components/layout/SiteHeader.tsx`: إضافة القائمة المنسدلة لعنصر «مكتبة الموارد» في النافبار وقائمة الجوال.

---

## المهام التنفيذية خطوة بخطوة

### المهمة 1: إعداد التكوين الموحد وشريط المعاينة المشترك (Config & Preview Banner)
- [x] إنشاء `src/pages/previews/previewConfig.ts` لتعريف بيانات وروابط النماذج السبعة.
- [x] إنشاء `src/components/resources/previews/PreviewHeaderBanner.tsx` مع قائمة تبديل منسدلة سريعة وزر رجوع.
- [x] التحقق من استيراد الأيقونات وتوافق الأنواع مع TypeScript.

### المهمة 2: تنفيذ النموذج 1 — فكرة المدير المحسنة (أقسام + شريط قفز لاصق)
- [x] إنشاء `src/pages/previews/SectionsPreviewPage.tsx`.
- [x] تصنيف الـ 124 مورداً حسب الفئات المعمارية.
- [x] إضافة شريط القفز اللاصق السريع (Sticky Scroll-Spy).
- [x] تفعيل زر "عرض المزيد / طي" داخل كل قسم لمنع السكرول الطويل.

### المهمة 3: تنفيذ النموذج 2 — القائمة البرمجية النحيفة للمحترفين (Dense List)
- [x] إنشاء `src/pages/previews/DenseListPreviewPage.tsx`.
- [x] تصميم سطر المورد المضغوط (أيقونة، عنوان، ناشر، رخصة، شارة إتقان، زر نسخ أمر التثبيت).
- [x] إضافة شريط بحث سريع وفلاتر فورية بنقرة واحدة في الأعلى.

### المهمة 4: تنفيذ النموذج 3 — العرض الموجه بحسب المشكلة والحل (Problem-Solution)
- [x] إنشاء `src/pages/previews/ProblemSolutionPreviewPage.tsx`.
- [x] تجميع الموارد في كتل غائية: "عرض المصحف"، "تشغيل الصوتيات وتظليلها"، "البحث الدلالي والتفسير"، "الذكاء الاصطناعي".
- [x] توفير شارات الحلول الموصى بها والمكملة لكل مشكلة هندسية.

### المهمة 5: تنفيذ النموذج 4 — مستكشف المجلدات الهرمي (Tree Explorer)
- [x] إنشاء `src/pages/previews/TreeExplorerPreviewPage.tsx`.
- [x] بناء لوحة شجرية باليسار/اليمين تعرض المجلدات الفرعية قابلة للطي والتوسيع.
- [x] عرض محتوى المجلد أو تفاصيل المورد المحدد في اللوحة المقابلة دون مغادرة الصفحة.

### المهمة 6: تنفيذ النموذج 5 — العرض الصندوقي الذكي (Bento Grid)
- [x] إنشاء `src/pages/previews/BentoGridPreviewPage.tsx`.
- [x] بناء شبكة Bento متجاوبة بأحجام كتل متباينة (Hero Cards للمصادر الذهبية، Medium للحزم الأساسية، Small للمكملات).
- [x] إضافة فلاتر سريعة وألوان مريحة للعين تتناغم مع هوية رتق.

### المهمة 7: تنفيذ النموذج 6 — الفلترة الحوارية التفاعلية (Conversational Bar)
- [x] إنشاء `src/pages/previews/ConversationalPreviewPage.tsx`.
- [x] بناء الجملة التفاعلية الذكية مع قوائم اختيار مدمجة بالكلمات: (المنصة، التخصص، الترخيص، إتقان).
- [x] ربط خيارات الجملة بالفلترة الحية وتحديث شبكة النتائج فوراً.

### المهمة 8: تنفيذ النموذج 7 — لوحة كانبان للفرز التقني (Kanban Board)
- [x] إنشاء `src/pages/previews/KanbanPreviewPage.tsx`.
- [x] بناء 4 أعمدة رئيسية: [بيانات ومتون خام]، [مكتبات SDK]، [خطوط وتيبوغرافيا]، [خدمات APIs].
- [x] دعم التمرير الأفقي للأعمدة وعرض إحصاءات كل عمود.

### المهمة 9: ربط الموجه (Router) وتحديث النافبار (`SiteHeader.tsx`)
- [x] إضافة مسارات النماذج السبعة في `src/router.tsx`.
- [x] تعديل عنصر «مكتبة الموارد» في `SiteHeader.tsx` ليحتوي على القائمة المنسدلة التفاعلية (Desktop & Mobile).
- [x] اختبار التنقل بين النماذج بسلاسة.

### المهمة 10: الفحص والتحقق الكامل (Verification & Local Commit)
- [x] تشغيل الفحوصات الآلية `npm test -- --run` والتأكد من اجتياز جميع الاختبارات.
- [x] تشغيل `npm run build` والتأكد من خلو المشروع من أخطاء TypeScript.
- [x] عمل commit محلي للتغييرات مع الالتزام التام بعدم عمل `git push`.
