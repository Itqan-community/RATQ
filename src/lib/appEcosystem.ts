// src/lib/appEcosystem.ts
// Ecosystem Apps and their verified resource usages across RATQ Platform
import { EcosystemApp } from '@/types';

export const ECOSYSTEM_APPS: EcosystemApp[] = [
  {
    id: 'quran-com',
    name_ar: 'منصة القرآن الكريم العالمية',
    name_en: 'Quran.com',
    tagline_ar: 'أضخم منصة ومصحف ويب مفتوح المصدر في العالم (أكثر من 12 مليون زيارة شهرياً)',
    description_ar: 'معمارية ويب حديثة تعتمد على العرض الهجين لتوفير استجابة فورية لملايين القراء حول العالم.',
    icon_url: '/images/apps/quran-com.jpg',
    app_type: 'web',
    live_url: 'https://quran.com',
    used_resource_slugs: [
      'cms-144',
      'uthmanic-hafs-font',
      'cms-156',
      'tafsir-cross-reference-dataset',
      'quran-morphology-js',
      'quran-search-indexer-py',
    ],
    used_resource_names: [
      'مصحف المدينة النبوية برواية حفص 1441هـ',
      'خط مصحف حفص العثماني الرقمي OpenType',
      'محرك تلاوات EveryAyah وخرائط التوقيت',
      'مجموعة بيانات المقارنات التفسيرية والترجمات',
      'مكتبة الصرف والإعراب القرآني',
    ],
  },
  {
    id: 'ayah-app',
    name_ar: 'تطبيق آية',
    name_en: 'Ayah App',
    tagline_ar: 'التجربة البصرية المرجعية على الجوال الحائزة على تقييم 4.9/5 لأكثر من 15 مليون مستخدم',
    description_ar: 'معمارية هواتف أصيلة قائمة على تقنية المتجهات (Vector Tile) بدون إنترنت.',
    icon_url: '/images/apps/ayah.jpg',
    app_type: 'mushaf',
    live_url: 'https://ayahapp.com',
    used_resource_slugs: [
      'cms-144',
      'mukhtasar-tafsir',
      'uthmanic-hafs-font',
      'cms-156',
      'quran-flutter-audio-sdk',
    ],
    used_resource_names: [
      'المصحف المطبوع المتجه برواية حفص 1441هـ',
      'المختصر في تفسير القرآن الكريم',
      'خط حاسوبي للرسم العثماني ونظم الرموز',
      'المصحف المرتل برواية حفص عن عاصم (تسجيل الحرم المكي)',
    ],
  },
  {
    id: 'wahy-app',
    name_ar: 'تطبيق وَحي',
    name_en: 'Wahy App',
    tagline_ar: 'القرآن تلاوة وتفسير كلمة بكلمة ومتابعة الحفظ والتسميع بأسلوب مبتكر',
    description_ar: 'مصحف رقمي تفاعلي لفهم واستماع القرآن كلمة بكلمة مع التظليل اللحظي أثناء التلاوة.',
    icon_url: '/images/apps/wahy.png',
    app_type: 'mushaf',
    live_url: 'https://apps.apple.com/sa/app/%D9%88-%D8%AD%D9%8A-%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86-%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85/id1615454207',
    used_resource_slugs: [
      'cms-144',
      'uthmanic-hafs-font',
      'cms-156',
      'tafsir-cross-reference-dataset',
      'quran-morphology-js',
    ],
    used_resource_names: [
      'مصحف المدينة النبوية برواية حفص 1441هـ',
      'خط مصحف حفص العثماني الرقمي OpenType',
      'محرك تلاوات EveryAyah وخرائط التوقيت',
      'مجموعة بيانات المقارنات التفسيرية والترجمات',
    ],
  },
  {
    id: 'mushaf-mecca',
    name_ar: 'مصحف مكة',
    name_en: 'Mushaf Mecca',
    tagline_ar: 'تطبيق قرآني متطور بخصائص فريدة وتلاوات أئمة الحرم المكي الشريف',
    description_ar: 'تطبيق قرآني متكامل يجمع بين نقاء الإخراج الطباعي وتنوع الروايات المعتمدة والتلاوات المتزامنة.',
    icon_url: '/images/apps/mushaf-mecca.png',
    app_type: 'mushaf',
    live_url: 'https://apps.apple.com/us/app/id1438777424',
    used_resource_slugs: [
      'cms-150',
      'cms-144',
      'uthmanic-hafs-font',
      'cms-156',
      'mukhtasar-tafsir',
    ],
    used_resource_names: [
      'نصوص المصاحف بالروايات المتواترة (حفص، ورش، قالون)',
      'خط حاسوبي للرسم العثماني ونظم الرموز',
      'المصحف المرتل برواية حفص عن عاصم (تسجيل الحرم المكي)',
      'المختصر في تفسير القرآن الكريم',
    ],
  },
  {
    id: 'mushaf-altdabbor',
    name_ar: 'مصحف التدبر',
    name_en: 'Mushaf Altdabbor',
    tagline_ar: 'مصحف إلكتروني تفاعلي للعيش مع معاني القرآن وهدايات الآيات',
    description_ar: 'منظومة متخصصة في تدبر القرآن الكريم تجمع بين النص العثماني الموثق ولطائف التفسير.',
    icon_url: '/images/apps/mushaf-altdabbor.png',
    app_type: 'mushaf',
    live_url: 'https://apps.apple.com/us/app/id1466597208',
    used_resource_slugs: [
      'cms-144',
      'tafsir-cross-reference-dataset',
      'uthmanic-hafs-font',
      'mukhtasar-tafsir',
    ],
    used_resource_names: [
      'مصحف المدينة النبوية برواية حفص 1441هـ',
      'مجموعة بيانات المقارنات التفسيرية والترجمات',
      'خط مصحف حفص العثماني الرقمي OpenType',
    ],
  },
  {
    id: 'surah-app',
    name_ar: 'تطبيق سورة',
    name_en: 'Surah App',
    tagline_ar: 'مصحف رقمي موثوق مع التفسير من مبادرات مركز تفسير للدراسات القرآنية',
    description_ar: 'نسخة رقمية أصيلة من المصحف الشريف صُممت بإشراف مركز تفسير لتقديم تلاوة نقية وتفسير وجيز.',
    icon_url: '/images/apps/surah.png',
    app_type: 'mushaf',
    live_url: 'https://apps.apple.com/us/app/surah-al-quran/id1615829761',
    used_resource_slugs: [
      'cms-144',
      'mukhtasar-tafsir',
      'uthmanic-hafs-font',
      'cms-156',
    ],
    used_resource_names: [
      'مصحف المدينة النبوية برواية حفص 1441هـ',
      'المختصر في تفسير القرآن الكريم',
      'خط حاسوبي للرسم العثماني ونظم الرموز',
      'محرك تلاوات EveryAyah وخرائط التوقيت',
    ],
  },
  {
    id: 'quran-hafs',
    name_ar: 'مصحف حفص (مجمع الملك فهد)',
    name_en: 'Quran Hafs Official App',
    tagline_ar: 'النسخة الرقمية الرسمية لطبعة مجمع الملك فهد برواية حفص عن عاصم',
    description_ar: 'التطبيق الرسمي الصادر عن مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة.',
    icon_url: '/images/apps/quran-hafs.png',
    app_type: 'mushaf',
    live_url: 'https://apps.apple.com/sa/app/quran-hafs-by-kfgqpc/id1616321992',
    used_resource_slugs: [
      'cms-177',
      'cms-144',
      'uthmanic-hafs-font',
      'tafsir-cross-reference-dataset',
    ],
    used_resource_names: [
      'مصحف المدينة لأعمال الطباعة والنشر (حفص، ورش، قالون، الدوري)',
      'خط مصحف المدينة النبوية V2 ومكتبة علامات الوقف',
      'قاعدة بيانات التفسير الميسر و63 ترجمة معتمدة',
    ],
  },
  {
    id: 'quran-warsh',
    name_ar: 'مصحف ورش (مجمع الملك فهد)',
    name_en: 'Quran Warsh Official App',
    tagline_ar: 'النسخة الرقمية الرسمية الصادرة من مجمع الملك فهد برواية ورش عن نافع',
    description_ar: 'تطبيق رسمي موثق يتضمن نسخة عالية الدقة من مصحف المدينة النبوية برواية ورش عن نافع.',
    icon_url: '/images/apps/quran-warsh.png',
    app_type: 'mushaf',
    live_url: 'https://apps.apple.com/us/app/id1603047183',
    used_resource_slugs: [
      'cms-177',
      'cms-150',
      'uthmanic-hafs-font',
      'tafsir-cross-reference-dataset',
    ],
    used_resource_names: [
      'مصحف المدينة لأعمال الطباعة والنشر (حفص، ورش، قالون، الدوري)',
      'خط مصحف المدينة النبوية V2 ومكتبة علامات الوقف',
      'قاعدة بيانات التفسير الميسر و63 ترجمة معتمدة',
    ],
  },
  {
    id: 'kfp-official',
    name_ar: 'مصحف المدينة النبوية',
    name_en: 'King Fahd Complex',
    tagline_ar: 'المرجع الرسمي والتقني الأعلى موثوقية لطباعة ونشر المصحف الشريف عالمياً',
    description_ar: 'معمارية مؤسسية صارمة تُبنى حول الأمان الرقمي والتوقيع الإلكتروني لمطابقة المصحف الورقي.',
    icon_url: '/images/apps/kfp-mushaf.jpg',
    app_type: 'mushaf',
    live_url: 'https://qurancomplex.gov.sa',
    used_resource_slugs: [
      'cms-177',
      'cms-144',
      'uthmanic-hafs-font',
      'tafsir-cross-reference-dataset',
    ],
    used_resource_names: [
      'خط مصحف المدينة النبوية V2 ومكتبة علامات الوقف',
      'مصحف المدينة لأعمال الطباعة والنشر',
      'قاعدة بيانات التفسير الميسر و63 ترجمة معتمدة',
    ],
  },
  {
    id: 'tarteel-ai',
    name_ar: 'تطبيق ترتيل',
    name_en: 'Tarteel AI',
    tagline_ar: 'رائد الذكاء الاصطناعي والتعرف الصوتي على التلاوة اللحظية (أكثر من 5 ملايين مستخدم)',
    description_ar: 'معمارية ذكاء اصطناعي متطورة تجمع بين معالجة الصوت الحافة وشبكات التعرف العصبي على الفونيمات القرآنية.',
    icon_url: '/images/apps/tarteel.jpg',
    app_type: 'ai',
    live_url: 'https://tarteel.ai',
    used_resource_slugs: [
      'quran-morphology-js',
      'cms-150',
      'cms-156',
      'cms-144',
    ],
    used_resource_names: [
      'مكتبة الصرف والإعراب القرآني',
      'نصوص المصاحف بالروايات المتواترة',
      'بيانات التلاوات الصوتية المجزأة لتدريب نماذج الذكاء الاصطناعي',
    ],
  },
  {
    id: 'maher-app',
    name_ar: 'تطبيق ماهر',
    name_en: 'Maher',
    tagline_ar: 'تسميع القرآن الكريم ومتابعة الحفظ الشفهي باستخدام الذكاء الاصطناعي',
    description_ar: 'تطبيق ذكي يساعد الحفظة والطلاب على تسميع وردهم القرآني شفهياً وتصحيح التلاوة بدقة.',
    icon_url: '/images/apps/maher.png',
    app_type: 'ai',
    live_url: 'https://apps.apple.com/sa/app/maher-%D9%85%D8%A7%D9%87%D8%B1/id6737059750',
    used_resource_slugs: [
      'quran-morphology-js',
      'cms-144',
      'cms-156',
      'uthmanic-hafs-font',
    ],
    used_resource_names: [
      'مكتبة الصرف والإعراب القرآني',
      'مصحف المدينة النبوية برواية حفص 1441هـ',
      'محرك تلاوات EveryAyah وخرائط التوقيت',
    ],
  },
  {
    id: 'modaker-app',
    name_ar: 'مقرأة وتطبيق مدّكِر',
    name_en: 'Modaker',
    tagline_ar: 'منصة التعليم والتسميع القرآني المباشر مع المقرئين المعتمدين (أكثر من 3 ملايين طالب)',
    description_ar: 'معمارية تفاعلية تعتمد على بروتوكولات الاتصال الصوتي اللحظي مع لوحة مصحف متزامنة.',
    icon_url: '/images/apps/modaker.jpg',
    app_type: 'ai',
    live_url: 'https://modaker.com',
    used_resource_slugs: [
      'cms-144',
      'uthmanic-hafs-font',
      'cms-156',
    ],
    used_resource_names: [
      'مصحف التجويد الملون وقواعد ضبط أحكام التلاوة',
      'مصحف المدينة النبوية برواية حفص 1441هـ',
    ],
  },
  {
    id: 'quran-mobasher',
    name_ar: 'قرآن مباشر',
    name_en: 'Quran Mobasher',
    tagline_ar: 'تطبيق التسميع القرآني المباشر والربط مع المعلمين على مدار الساعة',
    description_ar: 'بوابة تواصل تعليمية تربط الطلاب بمعلمي القرآن الكريم المعتمدين مع تتبع الأداء.',
    icon_url: '/images/apps/quran-mobasher.png',
    app_type: 'memorize',
    live_url: 'https://quranlive.online',
    used_resource_slugs: [
      'cms-144',
      'cms-156',
      'uthmanic-hafs-font',
    ],
    used_resource_names: [
      'محرك تلاوات EveryAyah وخرائط التوقيت',
      'مصحف المدينة النبوية برواية حفص 1441هـ',
    ],
  },
  {
    id: 'elmohafez-app',
    name_ar: 'تطبيق المحفّظ',
    name_en: 'Elmohafez',
    tagline_ar: 'تطبيق متخصص في المساعدة على حفظ القرآن الكريم عبر التكرار والتظليل الذكي',
    description_ar: 'أداة تعليمية تتيح تكرار الآيات وتحديد مقاطع الحفظ مع دعم التلاوات المرتلة بمختلف المقامات.',
    icon_url: '/images/apps/elmohafez.png',
    app_type: 'memorize',
    live_url: 'https://apps.apple.com/us/app/id1158498877',
    used_resource_slugs: [
      'cms-144',
      'cms-156',
      'quran-flutter-audio-sdk',
    ],
    used_resource_names: [
      'مصحف المدينة النبوية برواية حفص 1441هـ',
      'محرك تلاوات EveryAyah وخرائط التوقيت',
    ],
  },
  {
    id: 'ehfaz-alquran',
    name_ar: 'تطبيق احفظ القرآن',
    name_en: 'Ehfaz Alquran',
    tagline_ar: 'تطبيق تفاعلي ذكي لإعانة المسلم على تثبيت ومراجعة محفوظه من كتاب الله',
    description_ar: 'منظومة متابعة يومية ذكية للحفاظ تتيح إنشاء خطط الحفظ وجداول المراجعة الآلية.',
    icon_url: '/images/apps/ehfaz-alquran.png',
    app_type: 'memorize',
    live_url: 'https://apps.apple.com/sa/app/id1527376043',
    used_resource_slugs: [
      'cms-144',
      'uthmanic-hafs-font',
      'cms-156',
    ],
    used_resource_names: [
      'مصحف المدينة النبوية برواية حفص 1441هـ',
      'خط مصحف حفص العثماني الرقمي OpenType',
    ],
  },
  {
    id: 'wiqaya-app',
    name_ar: 'تطبيق وقاية',
    name_en: 'Wiqaya',
    tagline_ar: 'بوابة الحصن القرآني والرقية الشرعية الموثقة من الكتاب والسنة',
    description_ar: 'منصة تفاعلية تضم نصوص الرقية الشرعية والأدعية القرآنية مع التخريج العلمي المعتمد.',
    icon_url: '/images/apps/wiqaya.png',
    app_type: 'web',
    live_url: 'https://wiqaya.org',
    used_resource_slugs: [
      'cms-144',
      'tafsir-cross-reference-dataset',
      'uthmanic-hafs-font',
    ],
    used_resource_names: [
      'مصحف المدينة النبوية برواية حفص 1441هـ',
      'مجموعة بيانات المقارنات التفسيرية والترجمات',
    ],
  },
];

/**
 * Returns all apps that use a specific resource by slug or Arabic title
 */
export function getAppsUsingResource(
  resourceSlugOrId: string,
  resourceName?: string
): EcosystemApp[] {
  if (!resourceSlugOrId && !resourceName) return [];

  const targetSlug = (resourceSlugOrId || '').toLowerCase().trim();
  const targetName = (resourceName || '').trim();

  return ECOSYSTEM_APPS.filter((app) => {
    // 1. Check slug match
    if (targetSlug) {
      const slugMatched = app.used_resource_slugs.some(
        (slug) => slug.toLowerCase() === targetSlug
      );
      if (slugMatched) return true;
    }

    // 2. Check title/name match
    if (targetName && app.used_resource_names) {
      const nameMatched = app.used_resource_names.some((name) =>
        targetName.includes(name) || name.includes(targetName)
      );
      if (nameMatched) return true;
    }

    return false;
  });
}

/**
 * Returns count of apps using the resource
 */
export function getResourceAppCount(
  resourceSlugOrId: string,
  resourceName?: string
): number {
  return getAppsUsingResource(resourceSlugOrId, resourceName).length;
}
