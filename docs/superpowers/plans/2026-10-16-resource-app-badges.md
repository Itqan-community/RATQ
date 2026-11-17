# خطة تنفيذ: عرض أيقونات التطبيقات المعتمدة للمورد في صفحة الأقسام المصنفة (Resource App Badges)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** عرض أيقونات التطبيقات القرآنية الشهيرة (الموجودة في حزم التطبيقات / Tech Stacks) داخل بطاقة المورد في صفحة العرض بالأقسام المصنفة (`SectionsPreviewPage`) كتوثيق واعتماد فني موثوق (Social Proof & Technical Verification) للمطورين.

**Architecture:** استخراج وتوحيد بيانات التطبيقات وحزمها المعمارية في طبقة بيانات موحدة (`src/lib/appEcosystem.ts`) وتوفير دالة بحث سريعة `getAppsUsingResource`، ثم بناء مكون واجهة مصغر ومتقن (`ResourceAppBadges.tsx`) يعرض أيقونات التطبيقات بحجم مصغر وواضح (Squircle w-5.5 h-5.5) مع تلميحات (Tooltips) تفاعلية، ودمجه بانسيابية في بطاقة المورد (`ResourceCard.tsx`) ضمن صفحة الأقسام المصنفة.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React, Vitest.

**Spec:** متطلبات المستخدم لعرض أيقونات التطبيقات القرآنية (مثل آية، ترتيل، مصحف المدينة، قرآن.كوم، وحي، ماهر...) التي تعتمد على المورد البرمجي بصورة مصغرة وواضحة فقط دون تشويش على البطاقة.

---

## Global Constraints

- الالتزام الصارم بعدم تنفيذ أمر `git push` نهائياً.
- المحافظة الكاملة على نجاح الاختبارات الحالية (28/28 tests passing).
- بقاء الكود متوافقاً مع TypeScript دون أخطاء (`tsc --noEmit`).
- الحفاظ على تجاوب وتناسق شبكة العمودين (`grid-cols-1 sm:grid-cols-2`) في صفحة `SectionsPreviewPage.tsx`.
- ظهور المكون فقط عندما يكون للمورد تطبيقات فعلية مستخدمة (Zero-clutter للموارد التي لا تملك تطبيقات مرتبطة).

---

## Review Focus

1. **حالة عدم وجود تطبيقات للمورد (Zero Apps):** يجب ألا يترك المكون أي مساحة فارغة أو حيز شاذ في البطاقة (Graceful omission).
2. **تعدد التطبيقات (أكثر من 4 تطبيقات للمورد الواحد):** عرض أول 4 أيقونات مع شارة عداد متبقي أنيقة `+N` لمنع كسر عرض البطاقة في الشاشات الصغيرة.
3. **فشل تحميل صورة الأيقونة (Image Load Error):** توفير بديل نصي/أيقوني تلقائي ناعم (Fallback) يحمل الحرف الأول من اسم التطبيق أو أيقونة مصحف مصغرة عند غياب أو بطء تحميل الصورة.
4. **التفاعل وسهولة القراءة (Tooltips & Hover States):** إظهار اسم التطبيق العربي بوضوح عند تمرير الفأرة (Hover) على الأيقونة مع تأثير حركة خفيف (subtle scale-up).
5. **توافق وضعي السمة (Light & Dark Mode):** ظهور حدود الأيقونات وخلفيتها بوضوح وتباين متقن في الوضعين الفاتح والداكن.

---

## هيكل الملفات المزمع إنشاؤها وتعديلها

- **إنشاء:** `src/lib/appEcosystem.ts` (قاعدة بيانات التطبيقات المعتمدة ودوال الربط والاستعلام).
- **إنشاء:** `src/components/resources/ResourceAppBadges.tsx` (مكون عرض عنقود/صف أيقونات التطبيقات المصغرة والتلميحات).
- **إنشاء:** `src/test/appEcosystem.test.ts` (اختبارات التحقق من ربط الموارد بالتطبيقات والحدود القصوى).
- **تعديل:** `src/types/index.ts` (إضافة واجهات `EcosystemApp` و `ResourceAppUsage`).
- **تعديل:** `src/components/resources/ResourceCard.tsx` (دعم خاصية `showAppUsages` وتضمين المكون في موضع أنيق فوق الفوتر).
- **تعديل:** `src/pages/previews/SectionsPreviewPage.tsx` (تفعيل عرض أيقونات التطبيقات في بطاقات الموارد).

---

## المهام التنفيذية خطوة بخطوة

### Task 1: تعريف أنواع البيانات لبيئة التطبيقات (App Ecosystem Types)

**Files:**
- Modify: `src/types/index.ts:325-338`

**Interfaces:**
- Produces:
  ```typescript
  export interface EcosystemApp {
    id: string;
    name_ar: string;
    name_en: string;
    icon_url: string;
    app_type: 'mushaf' | 'ai' | 'memorize' | 'web';
    live_url?: string;
    used_resource_slugs: string[];
    used_resource_names?: string[];
  }
  ```

- [ ] **Step 1: إضافة واجهة `EcosystemApp` إلى `src/types/index.ts`**
- [ ] **Step 2: التحقق من التوافق البرمجي عبر `npx tsc --noEmit`**
- [ ] **Step 3: التوثيق والتثبيت محلياً (Commit)**

---

### Task 2: إنشاء وحدة بيانات وربط التطبيقات بالمصادر (`src/lib/appEcosystem.ts`)

**Files:**
- Create: `src/lib/appEcosystem.ts`
- Test: `src/test/appEcosystem.test.ts`

**Interfaces:**
- Consumes: `EcosystemApp` from `src/types`
- Produces:
  - `ECOSYSTEM_APPS: EcosystemApp[]`
  - `getAppsUsingResource(resourceSlugOrId: string, resourceName?: string): EcosystemApp[]`
  - `getResourceAppCount(resourceSlugOrId: string): number`

- [ ] **Step 1: كتابة اختبار الوحدة التمهيدي في `src/test/appEcosystem.test.ts`**
  - فحص استرجاع التطبيقات لمورد شهير مثل `cms-144` أو `uthmanic-hafs-font` أو `quran-morphology-js` (يجب أن يعيد تطبيقات مثل آية، ترتيل، قرآن.كوم).
  - فحص مورد غير مرتبط بأي تطبيق (يجب أن يعيد مصفوفة فارغة `[]`).

- [ ] **Step 2: تشغيل الاختبار والتحقق من فشله المبدئي**
  - الأمر: `npm test -- src/test/appEcosystem.test.ts --run`

- [ ] **Step 3: إنشاء وتنفيذ `src/lib/appEcosystem.ts`**
  - تصدير بيانات التطبيقات الـ 16 المأخوذة من `TechStacks.tsx` مع صورها في `/images/apps/`.
  - ربط كل تطبيق بمعرفات الموارد (Slugs & Names) الدقيقة.
  - تنفيذ دالة `getAppsUsingResource`.

- [ ] **Step 4: إعادة تشغيل الاختبار والتحقق من نجاحه التام**
  - الأمر: `npm test -- src/test/appEcosystem.test.ts --run`

- [ ] **Step 5: التثبيت المحلي (Commit)**

---

### Task 3: بناء مكون أيقونات التطبيقات المصغرة (`ResourceAppBadges.tsx`)

**Files:**
- Create: `src/components/resources/ResourceAppBadges.tsx`

**Interfaces:**
- Consumes:
  - `apps: EcosystemApp[]`
  - `maxDisplay?: number` (افتراضياً 4)
  - `size?: 'sm' | 'md'` (افتراضياً 'sm': `w-5.5 h-5.5`)
- Produces:
  - المكون `ResourceAppBadges: React.FC<ResourceAppBadgesProps>`

- [ ] **Step 1: بناء هيكل المكون المتقن**
  - أيقونات مستطيلة الحواف بزوايا دائرية ناعمة (Squircle `rounded-md`).
  - حدود دقيقة وظل خفيف (`border border-border/80 shadow-2xs`).
  - نص تلميح تفاعلي `title={app.name_ar}` مع تصميم Tooltip أنيق عند تمرير الماوس.
  - معالجة فشل الصورة (`onError`) بالتحول إلى بديل نصي ناعم بحرف التطبيق الأول.
  - شارة `+N` للأيقونات الإضافية في حال زاد عدد التطبيقات عن 4.
  - عبارة إرشادية خفيفة بجانب الأيقونات: `"مُعتمد في:"` تمنح مصداقية واضحة ومباشرة.

- [ ] **Step 2: التحقق من التجميع عبر `npx tsc --noEmit`**
- [ ] **Step 3: التثبيت المحلي (Commit)**

---

### Task 4: دمج الأيقونات في بطاقة المورد (`ResourceCard.tsx`)

**Files:**
- Modify: `src/components/resources/ResourceCard.tsx`

**Interfaces:**
- Consumes:
  - `showAppUsages?: boolean` (إضافة إلى `ResourceCardProps`)
  - `getAppsUsingResource` from `@/lib/appEcosystem`
  - `ResourceAppBadges` from `@/components/resources/ResourceAppBadges`

- [ ] **Step 1: إضافة خاصية `showAppUsages?: boolean` إلى `ResourceCardProps`**
- [ ] **Step 2: استدعاء `getAppsUsingResource(resource.slug, resource.title_ar)`**
- [ ] **Step 3: عرض مكون `ResourceAppBadges` في البطاقة**
  - في النمط الافتراضي (Full Card): يوضع في سطر خفيف مخصص أسفل وسوم التقنية (Tech Chips) وقبل الفوتر، مع فاصل هوائي مريح.
  - في النمط المدمج (Compact Mode): يُعرض بجانب الرخصة ورابط التفاصيل إن كانت المساحة تسمح.
  - في حال عدم وجود أي تطبيق للمورد: لا يتم حجز أي مساحة إضافية إطلاقاً.

- [ ] **Step 4: التحقق من خلو الملف من أخطاء الأنواع `npx tsc --noEmit`**
- [ ] **Step 5: التثبيت المحلي (Commit)**

---

### Task 5: تفعيل الميزة في صفحة الأقسام المصنفة (`SectionsPreviewPage.tsx`)

**Files:**
- Modify: `src/pages/previews/SectionsPreviewPage.tsx`

- [ ] **Step 1: تفعيل `showAppUsages={true}` في استدعاء `ResourceCard` داخل شبكة الموارد**
- [ ] **Step 2: مراجعة المظهر في شبكة العمودين (`grid-cols-1 sm:grid-cols-2`) للتأكد من الاتساق البصري التام**
- [ ] **Step 3: التحقق من تأثيرات التعتيم والتركيز (Dimming & Focus Mode) لضمان عدم تأثر الأيقونات سلباً**

---

### Task 6: التحقق الشامل وبناء المشروع (Verification & Build)

- [ ] **Step 1: تشغيل الاختبارات الآلية الشاملة والتأكد من اجتيازها بالكامل**
  - الأمر: `npm test -- --run`
- [ ] **Step 2: بناء المشروع الإنتاجي بنجاح تام**
  - الأمر: `npm run build`
- [ ] **Step 3: عمل Commit محلي نهائي والتأكد من عدم استخدام `git push` نهائياً**
