// src/views/TechStacks.tsx
// حزم التطبيقات وجدول المواصفات التقني (Tech Spec Table) - الصفحة المعتمدة
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ItqanBadge } from '@/components/ui/ItqanBadge';
import { AccessBadge } from '@/components/ui/AccessBadge';
import { LicenseBadge } from '@/components/ui/LicenseBadge';
import { RatingStars } from '@/components/ui/RatingStars';
import { mockRepo } from '@/lib/supabase';
import { Resource } from '@/types';
import {
  Layers,
  Table,
  ExternalLink,
  Code2,
  Cpu,
  Database,
  Type,
  Headphones,
  BookOpen,
  Search,
  Copy,
  Check,
  X,
  Download,
  Eye,
} from 'lucide-react';

export interface StackLayer {
  category: 'text' | 'font' | 'audio' | 'tafsir' | 'nlp' | 'infra';
  icon: React.ElementType;
  resourceName: string;
  resourceSlug?: string;
  badgeLevel: 'gold' | 'certified' | 'verified';
}

export interface AppTechStack {
  id: string;
  name_ar: string;
  name_en: string;
  tagline_ar: string;
  description_ar: string;
  icon_url: string;
  app_type: 'mushaf' | 'ai' | 'memorize' | 'web';
  live_url?: string;
  layers: StackLayer[];
}

export const INDUSTRY_STACKS: AppTechStack[] = [
  // 1. Quran.com
  {
    id: 'quran-com',
    name_ar: 'منصة القرآن الكريم العالمية',
    name_en: 'Quran.com Next.js Stack',
    tagline_ar: 'أضخم منصة ومصحف ويب مفتوح المصدر في العالم (أكثر من 12 مليون زيارة شهرياً)',
    description_ar:
      'معمارية ويب حديثة تعتمد على العرض الهجين (SSR + Static Pages) مع تقسيم الخطوط على مستوى الصفحة لتوفير استجابة فورية لملايين القراء حول العالم.',
    icon_url: '/images/apps/quran-com.jpg',
    app_type: 'web',
    live_url: 'https://quran.com',
    layers: [
      {
        category: 'text',
        icon: BookOpen,
        resourceName: 'مصحف المدينة النبوية برواية حفص 1441هـ',
        resourceSlug: 'cms-144',
        badgeLevel: 'gold',
      },
      {
        category: 'font',
        icon: Type,
        resourceName: 'خط مصحف حفص العثماني الرقمي OpenType',
        resourceSlug: 'uthmanic-hafs-font',
        badgeLevel: 'certified',
      },
      {
        category: 'audio',
        icon: Headphones,
        resourceName: 'محرك تلاوات EveryAyah وخرائط التوقيت',
        resourceSlug: 'cms-156',
        badgeLevel: 'verified',
      },
      {
        category: 'tafsir',
        icon: Database,
        resourceName: 'مجموعة بيانات المقارنات التفسيرية والترجمات',
        resourceSlug: 'tafsir-cross-reference-dataset',
        badgeLevel: 'certified',
      },
      {
        category: 'nlp',
        icon: Cpu,
        resourceName: 'مكتبة الصرف والإعراب القرآني (Quran Morphology JS)',
        resourceSlug: 'quran-morphology-js',
        badgeLevel: 'gold',
      },
    ],
  },

  // 2. Ayah App
  {
    id: 'ayah-app',
    name_ar: 'تطبيق آية • Ayah App',
    name_en: 'Ayah Mobile Vector Stack',
    tagline_ar: 'التجربة البصرية المرجعية على الجوال الحائزة على تقييم 4.9/5 لأكثر من 15 مليون مستخدم',
    description_ar:
      'معمارية هواتف أصيلة قائمة على تقنية المتجهات (Vector Tile Rendering) بدون إنترنت (Offline-First)، تضمن تجربة قراءة فائقة النقاء تحاكي المصحف الورقي بدقة متناهية.',
    icon_url: '/images/apps/ayah.jpg',
    app_type: 'mushaf',
    live_url: 'https://ayahapp.com',
    layers: [
      {
        category: 'text',
        icon: BookOpen,
        resourceName: 'المصحف المطبوع المتجه برواية حفص 1441هـ',
        resourceSlug: 'cms-144',
        badgeLevel: 'gold',
      },
      {
        category: 'tafsir',
        icon: Database,
        resourceName: 'المختصر في تفسير القرآن الكريم (مركز تفسير)',
        resourceSlug: 'mukhtasar-tafsir',
        badgeLevel: 'certified',
      },
      {
        category: 'font',
        icon: Type,
        resourceName: 'خط حاسوبي للرسم العثماني ونظم الرموز',
        resourceSlug: 'uthmanic-hafs-font',
        badgeLevel: 'certified',
      },
      {
        category: 'audio',
        icon: Headphones,
        resourceName: 'المصحف المرتل برواية حفص عن عاصم (تسجيل الحرم المكي)',
        resourceSlug: 'cms-156',
        badgeLevel: 'gold',
      },
    ],
  },

  // 3. Wahy App
  {
    id: 'wahy-app',
    name_ar: 'تطبيق وَحي • Wahy',
    name_en: 'Wahy Word-by-Word Stack',
    tagline_ar: 'القرآن تلاوة وتفسير كلمة بكلمة ومتابعة الحفظ والتسميع بأسلوب مبتكر',
    description_ar:
      'مصحف رقمي متكامل يوفر تجربة تفاعلية لفهم واستماع القرآن كلمة بكلمة مع التظليل اللحظي أثناء التلاوة وربط كل مفردة بمصادر التفاسير المعتمدة.',
    icon_url: '/images/apps/wahy.png',
    app_type: 'mushaf',
    live_url: 'https://apps.apple.com/sa/app/%D9%88-%D8%AD%D9%8A-%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86-%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85/id1615454207',
    layers: [
      {
        category: 'text',
        icon: BookOpen,
        resourceName: 'مصحف المدينة النبوية برواية حفص 1441هـ',
        resourceSlug: 'cms-144',
        badgeLevel: 'gold',
      },
      {
        category: 'font',
        icon: Type,
        resourceName: 'خط مصحف حفص العثماني الرقمي OpenType',
        resourceSlug: 'uthmanic-hafs-font',
        badgeLevel: 'certified',
      },
      {
        category: 'audio',
        icon: Headphones,
        resourceName: 'محرك تلاوات EveryAyah وخرائط التوقيت',
        resourceSlug: 'cms-156',
        badgeLevel: 'verified',
      },
      {
        category: 'tafsir',
        icon: Database,
        resourceName: 'مجموعة بيانات المقارنات التفسيرية والترجمات',
        resourceSlug: 'tafsir-cross-reference-dataset',
        badgeLevel: 'certified',
      },
    ],
  },

  // 4. Mushaf Mecca
  {
    id: 'mushaf-mecca',
    name_ar: 'مصحف مكة • Mushaf Mecca',
    name_en: 'Mushaf Mecca Advanced Stack',
    tagline_ar: 'تطبيق قرآني متطور بخصائص فريدة وتلاوات أئمة الحرم المكي الشريف',
    description_ar:
      'تطبيق قرآني متكامل يجمع بين نقاء الإخراج الطباعي وتنوع الروايات المعتمدة والتلاوات المتزامنة مع دعم كامل للعمل بدون اتصال.',
    icon_url: '/images/apps/mushaf-mecca.png',
    app_type: 'mushaf',
    live_url: 'https://apps.apple.com/us/app/id1438777424',
    layers: [
      {
        category: 'text',
        icon: BookOpen,
        resourceName: 'نصوص المصاحف بالروايات المتواترة (حفص، ورش، قالون)',
        resourceSlug: 'cms-150',
        badgeLevel: 'gold',
      },
      {
        category: 'font',
        icon: Type,
        resourceName: 'خط حاسوبي للرسم العثماني ونظم الرموز',
        resourceSlug: 'uthmanic-hafs-font',
        badgeLevel: 'certified',
      },
      {
        category: 'audio',
        icon: Headphones,
        resourceName: 'المصحف المرتل برواية حفص عن عاصم (تسجيل الحرم المكي)',
        resourceSlug: 'cms-156',
        badgeLevel: 'gold',
      },
      {
        category: 'tafsir',
        icon: Database,
        resourceName: 'المختصر في تفسير القرآن الكريم (مركز تفسير)',
        resourceSlug: 'mukhtasar-tafsir',
        badgeLevel: 'certified',
      },
    ],
  },

  // 5. Mushaf Altdabbor
  {
    id: 'mushaf-altdabbor',
    name_ar: 'مصحف التدبر • Mushaf Altdabbor',
    name_en: 'Mushaf Altdabbor Reflection Stack',
    tagline_ar: 'مصحف إلكتروني تفاعلي للعيش مع معاني القرآن وهدايات الآيات',
    description_ar:
      'منظومة متخصصة في تدبر القرآن الكريم تجمع بين النص العثماني الموثق ولطائف التفسير المستفادة من أقوال السلف والخلف بأسلوب معاصر وسهل الفهم.',
    icon_url: '/images/apps/mushaf-altdabbor.png',
    app_type: 'mushaf',
    live_url: 'https://apps.apple.com/us/app/%D9%85%D8%B5%D8%AD%D9%81-%D8%A7%D9%84%D8%AA%D8%AF%D8%A8%D8%B1-%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86-%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85/id1466597208',
    layers: [
      {
        category: 'text',
        icon: BookOpen,
        resourceName: 'مصحف المدينة النبوية برواية حفص 1441هـ',
        resourceSlug: 'cms-144',
        badgeLevel: 'gold',
      },
      {
        category: 'tafsir',
        icon: Database,
        resourceName: 'مجموعة بيانات المقارنات التفسيرية والترجمات',
        resourceSlug: 'tafsir-cross-reference-dataset',
        badgeLevel: 'gold',
      },
      {
        category: 'font',
        icon: Type,
        resourceName: 'خط مصحف حفص العثماني الرقمي OpenType',
        resourceSlug: 'uthmanic-hafs-font',
        badgeLevel: 'certified',
      },
    ],
  },

  // 6. Surah App
  {
    id: 'surah-app',
    name_ar: 'تطبيق سورة • Surah',
    name_en: 'Surah Tafsir Center Stack',
    tagline_ar: 'مصحف رقمي موثوق مع التفسير من مبادرات مركز تفسير للدراسات القرآنية',
    description_ar:
      'نسخة رقمية أصيلة من المصحف الشريف صُممت بإشراف مركز تفسير لتقديم تلاوة نقية وتفسير وجيز موثوق وواجهة عصرية خالية من أي مشتتات.',
    icon_url: '/images/apps/surah.png',
    app_type: 'mushaf',
    live_url: 'https://apps.apple.com/us/app/surah-al-quran/id1615829761',
    layers: [
      {
        category: 'text',
        icon: BookOpen,
        resourceName: 'مصحف المدينة النبوية برواية حفص 1441هـ',
        resourceSlug: 'cms-144',
        badgeLevel: 'gold',
      },
      {
        category: 'tafsir',
        icon: Database,
        resourceName: 'المختصر في تفسير القرآن الكريم (مركز تفسير)',
        resourceSlug: 'mukhtasar-tafsir',
        badgeLevel: 'gold',
      },
      {
        category: 'font',
        icon: Type,
        resourceName: 'خط حاسوبي للرسم العثماني ونظم الرموز',
        resourceSlug: 'uthmanic-hafs-font',
        badgeLevel: 'certified',
      },
      {
        category: 'audio',
        icon: Headphones,
        resourceName: 'محرك تلاوات EveryAyah وخرائط التوقيت',
        resourceSlug: 'cms-156',
        badgeLevel: 'verified',
      },
    ],
  },

  // 7. Quran Hafs (KFGQPC)
  {
    id: 'quran-hafs',
    name_ar: 'مصحف حفص (مجمع الملك فهد)',
    name_en: 'Quran Hafs Official App',
    tagline_ar: 'النسخة الرقمية الرسمية لطبعة مجمع الملك فهد برواية حفص عن عاصم',
    description_ar:
      'التطبيق الرسمي الصادر عن مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة، يتضمن نصاً عالي الدقة وتقليباً سلساً مع التفسير الميسر المعتمد.',
    icon_url: '/images/apps/quran-hafs.png',
    app_type: 'mushaf',
    live_url: 'https://apps.apple.com/sa/app/quran-hafs-by-kfgqpc/id1616321992',
    layers: [
      {
        category: 'text',
        icon: BookOpen,
        resourceName: 'مصحف المدينة لأعمال الطباعة والنشر (حفص، ورش، قالون، الدوري)',
        resourceSlug: 'cms-177',
        badgeLevel: 'gold',
      },
      {
        category: 'font',
        icon: Type,
        resourceName: 'خط مصحف المدينة النبوية V2 ومكتبة علامات الوقف',
        resourceSlug: 'uthmanic-hafs-font',
        badgeLevel: 'certified',
      },
      {
        category: 'tafsir',
        icon: Database,
        resourceName: 'قاعدة بيانات التفسير الميسر و63 ترجمة معتمدة',
        resourceSlug: 'tafsir-cross-reference-dataset',
        badgeLevel: 'certified',
      },
    ],
  },

  // 8. Quran Warsh (KFGQPC)
  {
    id: 'quran-warsh',
    name_ar: 'مصحف ورش (مجمع الملك فهد)',
    name_en: 'Quran Warsh Official App',
    tagline_ar: 'النسخة الرقمية الرسمية الصادرة من مجمع الملك فهد برواية ورش عن نافع',
    description_ar:
      'تطبيق رسمي موثق يتضمن نسخة عالية الدقة من مصحف المدينة النبوية برواية ورش عن نافع من طريق الأزرق، مع أسباب النزول والتفسير الميسر وإمكانية البحث.',
    icon_url: '/images/apps/quran-warsh.png',
    app_type: 'mushaf',
    live_url: 'https://apps.apple.com/us/app/id1603047183',
    layers: [
      {
        category: 'text',
        icon: BookOpen,
        resourceName: 'مصحف المدينة لأعمال الطباعة والنشر (حفص، ورش، قالون، الدوري)',
        resourceSlug: 'cms-177',
        badgeLevel: 'gold',
      },
      {
        category: 'font',
        icon: Type,
        resourceName: 'خط مصحف المدينة النبوية V2 ومكتبة علامات الوقف',
        resourceSlug: 'uthmanic-hafs-font',
        badgeLevel: 'certified',
      },
      {
        category: 'tafsir',
        icon: Database,
        resourceName: 'قاعدة بيانات التفسير الميسر و63 ترجمة معتمدة',
        resourceSlug: 'tafsir-cross-reference-dataset',
        badgeLevel: 'certified',
      },
    ],
  },

  // 9. King Fahd Complex Institutional
  {
    id: 'kfp-official',
    name_ar: 'مصحف المدينة النبوية (البوابة الرسمية)',
    name_en: 'King Fahd Complex Institutional Stack',
    tagline_ar: 'المرجع الرسمي والتقني الأعلى موثوقية لطباعة ونشر المصحف الشريف عالمياً',
    description_ar:
      'معمارية مؤسسية صارمة تُبنى حول الأمان الرقمي والتوقيع الإلكتروني لمطابقة المصحف الورقي المعتمد بصفرية أخطاء تامة عبر كافة المنصات الرقمية.',
    icon_url: '/images/apps/kfp-mushaf.jpg',
    app_type: 'mushaf',
    live_url: 'https://qurancomplex.gov.sa',
    layers: [
      {
        category: 'font',
        icon: Type,
        resourceName: 'خط مصحف المدينة النبوية V2 ومكتبة علامات الوقف',
        resourceSlug: 'uthmanic-hafs-font',
        badgeLevel: 'certified',
      },
      {
        category: 'text',
        icon: BookOpen,
        resourceName: 'مصحف المدينة لأعمال الطباعة والنشر (حفص، ورش، قالون، الدوري)',
        resourceSlug: 'cms-177',
        badgeLevel: 'gold',
      },
      {
        category: 'tafsir',
        icon: Database,
        resourceName: 'قاعدة بيانات التفسير الميسر و63 ترجمة معتمدة',
        resourceSlug: 'tafsir-cross-reference-dataset',
        badgeLevel: 'certified',
      },
    ],
  },

  // 10. Tarteel AI
  {
    id: 'tarteel-ai',
    name_ar: 'ترتيل • Tarteel AI',
    name_en: 'Tarteel Voice Recognition Stack',
    tagline_ar: 'رائد الذكاء الاصطناعي والتعرف الصوتي على التلاوة اللحظية (أكثر من 5 ملايين مستخدم)',
    description_ar:
      'معمارية ذكاء اصطناعي متطورة تجمع بين معالجة الصوت الحافة (Edge Audio Filtering) وشبكات التعرف العصبي على الفونيمات القرآنية لمتابعة الحفظ وتنبيه القارئ لحظياً.',
    icon_url: '/images/apps/tarteel.jpg',
    app_type: 'ai',
    live_url: 'https://tarteel.ai',
    layers: [
      {
        category: 'nlp',
        icon: Cpu,
        resourceName: 'مكتبة الصرف والإعراب القرآني (Quran Morphology)',
        resourceSlug: 'quran-morphology-js',
        badgeLevel: 'gold',
      },
      {
        category: 'text',
        icon: BookOpen,
        resourceName: 'نصوص المصاحف بالروايات المتواترة (حفص، ورش، قالون)',
        resourceSlug: 'cms-150',
        badgeLevel: 'gold',
      },
      {
        category: 'audio',
        icon: Headphones,
        resourceName: 'بيانات التلاوات الصوتية المجزأة لتدريب نماذج الذكاء الاصطناعي',
        resourceSlug: 'cms-156',
        badgeLevel: 'verified',
      },
    ],
  },

  // 11. Maher App
  {
    id: 'maher-app',
    name_ar: 'تطبيق ماهر • Maher',
    name_en: 'Maher AI Quran Reciter',
    tagline_ar: 'تسميع القرآن الكريم ومتابعة الحفظ الشفهي باستخدام الذكاء الاصطناعي',
    description_ar:
      'تطبيق ذكي يساعد الحفظة والطلاب على تسميع وردهم القرآني شفهياً؛ حيث يستمع الذكاء الاصطناعي بدقة ويصحح التلاوة وينبه القارئ على مواضع الخطأ والنسيان.',
    icon_url: '/images/apps/maher.png',
    app_type: 'ai',
    live_url: 'https://apps.apple.com/sa/app/maher-%D9%85%D8%A7%D9%87%D8%B1/id6737059750',
    layers: [
      {
        category: 'nlp',
        icon: Cpu,
        resourceName: 'مكتبة الصرف والإعراب القرآني (Quran Morphology)',
        resourceSlug: 'quran-morphology-js',
        badgeLevel: 'gold',
      },
      {
        category: 'text',
        icon: BookOpen,
        resourceName: 'مصحف المدينة النبوية برواية حفص 1441هـ',
        resourceSlug: 'cms-144',
        badgeLevel: 'gold',
      },
      {
        category: 'audio',
        icon: Headphones,
        resourceName: 'محرك تلاوات EveryAyah وخرائط التوقيت',
        resourceSlug: 'cms-156',
        badgeLevel: 'verified',
      },
    ],
  },

  // 12. Modaker App
  {
    id: 'modaker-app',
    name_ar: 'تطبيق ومقرأة مدّكِر • Modaker',
    name_en: 'Modaker Live Quranic Learning Stack',
    tagline_ar: 'منصة التعليم والتسميع القرآني المباشر مع المقرئين المعتمدين (أكثر من 3 ملايين طالب)',
    description_ar:
      'معمارية تفاعلية تعتمد على بروتوكولات الاتصال الصوتي اللحظي (WebRTC) مع لوحة مصحف متزامنة تتيح التسميع المباشر وتأشير مواضع التصحيح بدقة الآية والكلمة.',
    icon_url: '/images/apps/modaker.jpg',
    app_type: 'ai',
    live_url: 'https://modaker.com',
    layers: [
      {
        category: 'text',
        icon: BookOpen,
        resourceName: 'مصحف التجويد الملون وقواعد ضبط أحكام التلاوة',
        resourceSlug: 'cms-144',
        badgeLevel: 'gold',
      },
      {
        category: 'font',
        icon: Type,
        resourceName: 'خط مصحف حفص العثماني الرقمي OpenType',
        resourceSlug: 'uthmanic-hafs-font',
        badgeLevel: 'certified',
      },
      {
        category: 'tafsir',
        icon: Database,
        resourceName: 'معجم غريب القرآن والمفردات اللغوية المعتمدة',
        resourceSlug: 'tafsir-cross-reference-dataset',
        badgeLevel: 'certified',
      },
    ],
  },

  // 13. Quran Mobasher
  {
    id: 'quran-mobasher',
    name_ar: 'القرآن مباشر • Quran Mobasher',
    name_en: 'Quran Mobasher Remote Sessions',
    tagline_ar: 'أول تطبيق مجاني لتصحيح التلاوة وتعلم القرآن عن بُعد بالصوت والصورة',
    description_ar:
      'منظومة فصول افتراضية متطورة تتيح تعلم القرآن وتصحيح التلاوة مع معلمين ومعلمات مجازين ومؤهلين عبر جلسات تفاعلية حية تخدم كافة الفئات العمرية.',
    icon_url: '/images/apps/quran-mobasher.png',
    app_type: 'ai',
    live_url: 'https://apps.apple.com/sa/app/quran-mobasher-%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86-%D9%85%D8%A8%D8%A7%D8%B4%D8%B1/id1602922387',
    layers: [
      {
        category: 'text',
        icon: BookOpen,
        resourceName: 'مصحف التجويد الملون وقواعد ضبط أحكام التلاوة',
        resourceSlug: 'cms-144',
        badgeLevel: 'gold',
      },
      {
        category: 'font',
        icon: Type,
        resourceName: 'خط مصحف حفص العثماني الرقمي OpenType',
        resourceSlug: 'uthmanic-hafs-font',
        badgeLevel: 'certified',
      },
      {
        category: 'audio',
        icon: Headphones,
        resourceName: 'المصحف المرتل برواية حفص عن عاصم (تسجيل الحرم المكي)',
        resourceSlug: 'cms-156',
        badgeLevel: 'gold',
      },
    ],
  },

  // 14. Elmohafez
  {
    id: 'elmohafez-app',
    name_ar: 'محفظ الوحيين • Elmohafez',
    name_en: 'Elmohafez Memorization Engine',
    tagline_ar: 'طريقك الميسر لحفظ كتاب الله والسنة النبوية والمتون العلمية',
    description_ar:
      'معمارية متخصصة في التحفيظ والترديد الموجه؛ تتيح تكرار الآيات والمقاطع بعدد محدد وسماع القارئ مع إمكانية تسجيل صوت الحافظ ومقارنته بالتلاوة الصحيحة.',
    icon_url: '/images/apps/elmohafez.png',
    app_type: 'memorize',
    live_url: 'https://apps.apple.com/us/app/elmohafez-tv-%D9%85%D8%AD%D9%81%D8%B8-%D8%A7%D9%84%D9%88%D8%AD%D9%8A%D9%8A%D9%86/id560715467',
    layers: [
      {
        category: 'text',
        icon: BookOpen,
        resourceName: 'مصحف المدينة لأعمال الطباعة والنشر (حفص، ورش، قالون، الدوري)',
        resourceSlug: 'cms-177',
        badgeLevel: 'gold',
      },
      {
        category: 'audio',
        icon: Headphones,
        resourceName: 'محرك تلاوات EveryAyah وخرائط التوقيت',
        resourceSlug: 'cms-156',
        badgeLevel: 'verified',
      },
      {
        category: 'font',
        icon: Type,
        resourceName: 'خط حاسوبي للرسم العثماني ونظم الرموز',
        resourceSlug: 'uthmanic-hafs-font',
        badgeLevel: 'certified',
      },
      {
        category: 'tafsir',
        icon: Database,
        resourceName: 'المختصر في تفسير القرآن الكريم (مركز تفسير)',
        resourceSlug: 'mukhtasar-tafsir',
        badgeLevel: 'certified',
      },
    ],
  },

  // 15. Ehfaz Al Quran
  {
    id: 'ehfaz-alquran',
    name_ar: 'احفظ القرآن • Ehfaz Al Quran',
    name_en: 'Ehfaz Al Quran Board Stack',
    tagline_ar: 'حفظ سور القرآن الكريم بطريقة الألواح التقليدية والترديد الهرمي',
    description_ar:
      'تطبيق مبني على تيسير حفظ القرآن بطريقة الألواح المتوارثة؛ تُقسّم السورة إلى ألواح محددة تُحفظ عبر 4 مراحل صوتية مرتبة هرمياً لترسيخ الحفظ في الذاكرة.',
    icon_url: '/images/apps/ehfaz-alquran.png',
    app_type: 'memorize',
    live_url: 'https://apps.apple.com/us/app/id1070807769?l=ar',
    layers: [
      {
        category: 'text',
        icon: BookOpen,
        resourceName: 'مصحف التجويد الملون وقواعد ضبط أحكام التلاوة',
        resourceSlug: 'cms-144',
        badgeLevel: 'gold',
      },
      {
        category: 'audio',
        icon: Headphones,
        resourceName: 'محرك تلاوات EveryAyah وخرائط التوقيت',
        resourceSlug: 'cms-156',
        badgeLevel: 'verified',
      },
      {
        category: 'font',
        icon: Type,
        resourceName: 'خط مصحف حفص العثماني الرقمي OpenType',
        resourceSlug: 'uthmanic-hafs-font',
        badgeLevel: 'certified',
      },
    ],
  },

  // 16. Wiqaya App
  {
    id: 'wiqaya-app',
    name_ar: 'وقاية اللسان • Wiqaya',
    name_en: 'Wiqaya Pronunciation & Tajweed',
    tagline_ar: 'تعليم التلاوة السليمة والوقاية من اللحن الجلي والخفي بأدوات تفاعلية',
    description_ar:
      'تطبيق مبتكر لتعليم تلاوة القرآن مع أحكام التجويد وتصحيح نطق الكلمات لتكون خالية من اللحن الجلي والخفي، عبر منهج تربوي متكامل يدعم التعلم الذاتي.',
    icon_url: '/images/apps/wiqaya.png',
    app_type: 'memorize',
    live_url: 'https://apps.apple.com/us/app/id6448244188?l=ar',
    layers: [
      {
        category: 'text',
        icon: BookOpen,
        resourceName: 'مصحف التجويد الملون وقواعد ضبط أحكام التلاوة',
        resourceSlug: 'cms-144',
        badgeLevel: 'gold',
      },
      {
        category: 'nlp',
        icon: Cpu,
        resourceName: 'مكتبة الصرف والإعراب القرآني (Quran Morphology)',
        resourceSlug: 'quran-morphology-js',
        badgeLevel: 'gold',
      },
      {
        category: 'audio',
        icon: Headphones,
        resourceName: 'المصحف المرتل برواية حفص عن عاصم (تسجيل الحرم المكي)',
        resourceSlug: 'cms-156',
        badgeLevel: 'gold',
      },
    ],
  },
];

const CATEGORY_MAP: Record<
  string,
  { label: string; icon: React.ElementType; color: string; badgeCls: string }
> = {
  text: {
    label: 'نصوص ومصادر مصحفية',
    icon: BookOpen,
    color: 'text-emerald-700 dark:text-emerald-300',
    badgeCls: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
  },
  font: {
    label: 'خط ورسم عثماني',
    icon: Type,
    color: 'text-cyan-700 dark:text-cyan-300',
    badgeCls: 'bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300',
  },
  audio: {
    label: 'محركات وتلاوات صوتية',
    icon: Headphones,
    color: 'text-blue-700 dark:text-blue-300',
    badgeCls: 'bg-blue-50 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
  },
  tafsir: {
    label: 'تفاسير وبيانات قرآنية',
    icon: Database,
    color: 'text-amber-700 dark:text-amber-300',
    badgeCls: 'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
  },
  nlp: {
    label: 'ذكاء اصطناعي وصرف',
    icon: Cpu,
    color: 'text-purple-700 dark:text-purple-300',
    badgeCls: 'bg-purple-50 dark:bg-purple-950/70 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300',
  },
  infra: {
    label: 'بنية تحتية ومحركات',
    icon: Code2,
    color: 'text-zinc-700 dark:text-zinc-300',
    badgeCls: 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200',
  },
};

const APP_TYPE_LABELS: Record<string, string> = {
  all: 'كافة التطبيقات',
  mushaf: 'المصاحف والتلاوة',
  ai: 'الذكاء الاصطناعي والتسميع',
  memorize: 'التحفيظ والتعليم',
  web: 'منصات الويب',
};

export const TechStacksPage: React.FC = () => {
  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStackId, setSelectedStackId] = useState<string>(INDUSTRY_STACKS[0]?.id || 'quran-com');
  const [selectedResourceModal, setSelectedResourceModal] = useState<Resource | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Escape key handler & body scroll lock for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedResourceModal(null);
    };
    if (selectedResourceModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedResourceModal]);

  // Filter stacks
  const filteredStacks = useMemo(() => {
    return INDUSTRY_STACKS.filter((stack) => {
      const matchesCategory = selectedCategory === 'all' || stack.app_type === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        stack.name_ar.toLowerCase().includes(q) ||
        stack.name_en.toLowerCase().includes(q) ||
        stack.tagline_ar.toLowerCase().includes(q) ||
        stack.layers.some((l) => l.resourceName.toLowerCase().includes(q) || (l.resourceSlug && l.resourceSlug.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Current selected stack
  const selectedStack: AppTechStack = useMemo(() => {
    const inFiltered = filteredStacks.find((s) => s.id === selectedStackId);
    if (inFiltered) return inFiltered;
    return filteredStacks[0] || INDUSTRY_STACKS[0];
  }, [selectedStackId, filteredStacks]);

  // Copy handler
  const handleCopySlug = (slug: string) => {
    navigator.clipboard.writeText(slug);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Open resource details modal
  const handleOpenResource = (layer: StackLayer) => {
    const all = mockRepo.getResources();
    let res = all.find(
      (r) =>
        r.slug.toLowerCase() === (layer.resourceSlug || '').toLowerCase() ||
        r.id === layer.resourceSlug
    );
    if (!res) {
      res = all.find(
        (r) =>
          r.title_ar.includes(layer.resourceName) ||
          layer.resourceName.includes(r.title_ar)
      );
    }
    if (!res) {
      res = {
        id: `layer-${layer.resourceSlug || 'component'}`,
        slug: layer.resourceSlug || 'resource',
        title_ar: layer.resourceName,
        title_en: layer.resourceName,
        summary_ar: `مكون تقني معتمد ضمن معمارية (${selectedStack.name_ar}) الموثقة في رتق.`,
        description_ar: `هذا المكون يعد جزءاً رئيساً من طبقة (${CATEGORY_MAP[layer.category]?.label || layer.category}) في المنظومة المعمارية لـ ${selectedStack.name_ar}، وهو خاضع لتدقيق الجودة والامتثال الفني ومعايير إتقان.`,
        resource_type: 'library',
        publisher_id: 'pub_quran_tech',
        created_by: 'system',
        license_id: 'mit',
        license_spdx: 'MIT',
        access_level: 'open',
        status: 'published',
        itqan_level: layer.badgeLevel || 'certified',
        downloads_count: 18500,
        views_count: 42100,
        rating_avg: 4.9,
        rating_count: 86,
        is_featured: false,
        featured_rank: 0,
        tech_stack: [selectedStack.name_en, layer.category],
        languages: ['ar'],
        categories: ['cat_dev'],
        tags: [layer.category, 'معمارية إنتاجية'],
        contains_quranic_text: layer.category === 'text',
        latest_version: '1.2.0',
        latest_released_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        publisher: {
          id: 'pub_quran_tech',
          slug: 'quran-tech-foundation',
          name_ar: 'مؤسسة التقنيات القرآنية',
          name_en: 'Quran Tech Foundation',
          kind: 'organization',
          description_ar: 'مؤسسة رائدة في تطوير وتوزيع البنى البرمجية مفتوحة المصدر لخدمة مشاريع المصحف الشريف الرقمية.',
          verification_status: 'verified',
          access_policy: 'open',
          default_sla_days: 1,
          is_active: true,
          created_at: '2025-01-01T00:00:00Z',
          owner_profile_id: 'user_pub_001',
        },
      };
    }
    setSelectedResourceModal(res || null);
  };

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-6 w-full text-start">
      {/* Top Header: Breadcrumbs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-fg-subtle">
          <Link to="/" className="hover:text-ratq-700 transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <h1 className="text-ratq-700 font-bold text-xs inline">حزم التطبيقات</h1>
        </div>
      </div>

      {/* Main Controls Toolbar: Search, Category Filter, and View Switcher */}
      <div className="mb-6 p-3 sm:p-3.5 rounded-2xl border border-border bg-canvas/95 backdrop-blur-md shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-fg-subtle absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن تطبيق، حزمة معتمدة، أو طبقة معمارية..."
            className="w-full ps-9 pe-3 py-2 rounded-xl border border-border bg-subtle/50 text-xs sm:text-sm placeholder:text-fg-subtle focus:outline-none focus:border-ratq-500 focus:bg-canvas transition-all"
          />
        </div>

        {/* Category Filters (Inline on the same line) */}
        <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto py-0.5">
          {Object.entries(APP_TYPE_LABELS).map(([key, label]) => {
            const isSelected = selectedCategory === key;
            const count =
              key === 'all'
                ? INDUSTRY_STACKS.length
                : INDUSTRY_STACKS.filter((s) => s.app_type === key).length;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCategory(key)}
                className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'border-ratq-600 bg-ratq-700 text-white shadow-xs font-bold dark:bg-ratq-600 dark:border-ratq-500'
                    : 'border-border/80 bg-canvas text-fg-muted hover:text-fg hover:border-border hover:bg-subtle'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-subtle text-fg-subtle'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* App Tech Spec Table */}
      <div className="space-y-6">
          {/* App Selector Pills (Vertical: Larger Icon + Arabic Name Underneath) */}
          <div className="p-3.5 sm:p-4 rounded-2xl border border-border bg-canvas shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-fg mb-3 px-1">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-ratq-600" />
                <span>اختر التطبيق لاستعراض جدول مواصفاته:</span>
              </span>
              <span className="text-[11px] font-mono text-fg-subtle">
                {filteredStacks.length} تطبيقات
              </span>
            </div>

            <div className="flex items-stretch gap-2.5 overflow-x-auto pb-2 pt-1 px-1 scrollbar-thin">
              {filteredStacks.map((stack) => {
                const isSelected = stack.id === selectedStack.id;
                return (
                  <button
                    key={stack.id}
                    type="button"
                    onClick={() => setSelectedStackId(stack.id)}
                    className={`w-20 sm:w-22 min-w-[80px] sm:min-w-[88px] p-2.5 rounded-2xl border flex flex-col items-center justify-start text-center shrink-0 transition-all duration-150 cursor-pointer group relative overflow-hidden ${
                      isSelected
                        ? 'border-cyan-500/80 bg-gradient-to-b from-cyan-500/15 via-cyan-500/5 to-transparent dark:from-cyan-400/20 dark:via-cyan-950/60 dark:to-transparent text-cyan-950 dark:text-cyan-100 shadow-xs ring-2 ring-cyan-500/30'
                        : 'border-border/80 bg-canvas hover:border-cyan-300 hover:bg-subtle/60 text-fg-muted hover:text-fg'
                    }`}
                  >
                    {/* Glowing highlight indicator on active app pill */}
                    {isSelected && (
                      <div className="absolute top-0 start-0 end-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 dark:via-cyan-400/60 to-transparent" />
                    )}

                    {/* Larger App Icon */}
                    <div
                      className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden ring-1 ${
                        isSelected
                          ? 'ring-cyan-500/40'
                          : 'ring-black/10 dark:ring-white/10'
                      } bg-canvas shadow-2xs shrink-0 group-hover:scale-105 transition-transform duration-150`}
                    >
                      <img
                        src={stack.icon_url}
                        alt={stack.name_ar}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Small Arabic Name Under Icon */}
                    <span
                      className={`text-[11px] leading-snug line-clamp-2 mt-2 w-full break-words ${
                        isSelected ? 'font-bold text-cyan-950 dark:text-cyan-200' : 'font-medium'
                      }`}
                      title={stack.name_ar}
                    >
                      {stack.name_ar}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected App Compact Spec Header (بطاقة عرض تفاصيل التطبيق بتدرج قسم مجموعات البيانات والذكاء الاصطناعي) */}
          <div className="relative p-5 sm:p-6 rounded-2xl border border-border/80 bg-gradient-to-b from-cyan-500/10 via-cyan-500/2 to-transparent dark:from-cyan-400/12 dark:via-cyan-400/2 to-transparent shadow-xs overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
            {/* Glowing highlight indicator like Catalog.tsx datasets theme */}
            <div className="absolute top-0 start-0 end-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 dark:via-cyan-400/40 to-transparent" />

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-cyan-200/80 dark:border-cyan-800/70 bg-cyan-50/50 dark:bg-cyan-950/70 shrink-0 shadow-xs">
                <img
                  src={selectedStack.icon_url}
                  alt={selectedStack.name_ar}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-base sm:text-lg font-bold text-fg">
                    {selectedStack.name_ar}
                  </h2>
                  <span className="text-xs font-mono text-fg-subtle">
                    ({selectedStack.name_en})
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-50/80 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-[10px] font-bold">
                    {APP_TYPE_LABELS[selectedStack.app_type] || selectedStack.app_type}
                  </span>
                </div>
                <p className="text-xs text-cyan-800 dark:text-cyan-300 font-semibold mb-1">
                  {selectedStack.tagline_ar}
                </p>
                <p className="text-xs text-fg-muted max-w-3xl leading-relaxed">
                  {selectedStack.description_ar}
                </p>
              </div>
            </div>

            {selectedStack.live_url && (
              <a
                href={selectedStack.live_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-cyan-200 dark:border-cyan-800/80 bg-canvas/80 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 text-xs font-semibold text-fg transition-colors shadow-2xs shrink-0 self-start md:self-center"
              >
                <span>زيارة التطبيق الحي</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              </a>
            )}
          </div>

          {/* THE TECH SPEC TABLE (The Core Innovation of Idea 7) */}
          <div className="rounded-2xl border border-border bg-canvas shadow-xs overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-4 border-b border-border bg-subtle/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-ratq-600" />
                <h3 className="text-xs font-bold text-fg">
                  جدول المواصفات البرمجية والطبقات المعمارية ({selectedStack.layers.length} مكونات معتمدة)
                </h3>
              </div>

              <span className="text-[11px] font-mono text-fg-subtle">
                مرتبة من الطبقة المرجعية إلى واجهة المستخدم
              </span>
            </div>

            {/* Flat Sleek Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-subtle/50 text-2xs uppercase tracking-wider text-fg-subtle font-mono">
                    <th className="py-3 px-4 text-start font-bold w-14">#</th>
                    <th className="py-3 px-4 text-start font-bold">الطبقة المعمارية (Layer)</th>
                    <th className="py-3 px-4 text-start font-bold min-w-[240px]">الحزمة / المورد المعتمد (Package)</th>
                    <th className="py-3 px-4 text-start font-bold">معيار إتقان (Verification)</th>
                    <th className="py-3 px-4 text-start font-bold">الترخيص (License)</th>
                    <th className="py-3 px-4 text-end font-bold w-32">المواصفات (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {selectedStack.layers.map((layer, idx) => {
                    const meta = CATEGORY_MAP[layer.category] || CATEGORY_MAP.text;
                    const Icon = meta.icon;

                    return (
                      <tr
                        key={idx}
                        className="hover:bg-subtle/40 transition-colors group"
                      >
                        {/* Layer Index */}
                        <td className="py-3.5 px-4 font-mono font-bold text-fg-subtle text-2xs">
                          <span className="inline-block px-1.5 py-0.5 rounded bg-muted/60 text-fg-muted">
                            L{idx + 1}
                          </span>
                        </td>

                        {/* Architectural Category */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg border border-border-subtle bg-subtle text-fg-muted flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${meta.badgeCls}`}>
                              {meta.label}
                            </span>
                          </div>
                        </td>

                        {/* Resource Package Name & Slug */}
                        <td className="py-3.5 px-4">
                          <div>
                            <button
                              type="button"
                              onClick={() => handleOpenResource(layer)}
                              className="font-bold text-fg hover:text-ratq-700 dark:hover:text-ratq-300 hover:underline transition-colors text-start cursor-pointer block"
                            >
                              {layer.resourceName}
                            </button>
                            {layer.resourceSlug && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono text-2xs text-fg-subtle">
                                  {layer.resourceSlug}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopySlug(layer.resourceSlug || '')}
                                  className="text-fg-subtle hover:text-fg p-0.5 transition-colors cursor-pointer"
                                  title="نسخ المعرف البرمجي"
                                >
                                  {copiedSlug === layer.resourceSlug ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Itqan Badge */}
                        <td className="py-3.5 px-4">
                          <ItqanBadge level={layer.badgeLevel} size="sm" />
                        </td>

                        {/* License */}
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <LicenseBadge licenseId="mit" spdx="MIT / Free" size="sm" />
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenResource(layer)}
                            className="text-[11px] h-7 px-2.5 gap-1 font-semibold text-fg-muted hover:text-fg"
                          >
                            <span>فحص</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer: Summary & Quick Spec Stats */}
            <div className="p-3.5 border-t border-border bg-subtle/20 flex flex-wrap items-center justify-between gap-3 text-2xs text-fg-subtle">
              <div className="flex items-center gap-4">
                <span>
                  إجمالي الطبقات: <strong className="text-fg font-mono">{selectedStack.layers.length}</strong>
                </span>
                <span>•</span>
                <span>
                  المكونات المعتمدة بإتقان ذهبي:{' '}
                  <strong className="text-amber-600 font-mono">
                    {selectedStack.layers.filter((l) => l.badgeLevel === 'gold').length}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  التراخيص: <strong className="text-fg">مفتوحة المصدر / ترخيص إنتاجي</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const txt = `${selectedStack.name_ar} Tech Spec:\n` +
                      selectedStack.layers.map((l, i) => `#${i + 1} [${l.category}] ${l.resourceName} (${l.badgeLevel})`).join('\n');
                    navigator.clipboard.writeText(txt);
                    alert('تم نسخ مواصفات المنظومة بصيغة نصية بنجاح.');
                  }}
                  className="h-7 text-[11px] gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>نسخ الجدول كنص</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

      {/* Resource Details Modal (Consistent Inspector) */}
      {selectedResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setSelectedResourceModal(null)}
          />

          <div
            className="relative bg-canvas border border-border rounded-2xl shadow-xl w-full max-w-lg z-10 overflow-hidden flex flex-col max-h-[85vh] animate-scale-in text-start"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-border bg-subtle/30 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <ItqanBadge level={selectedResourceModal.itqan_level} size="sm" />
                  <AccessBadge level={selectedResourceModal.access_level} />
                  <LicenseBadge
                    licenseId={selectedResourceModal.license_id}
                    spdx={selectedResourceModal.license_spdx}
                    size="sm"
                  />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-fg leading-tight">
                  {selectedResourceModal.title_ar}
                </h3>
                <p className="text-2xs font-mono text-fg-subtle mt-0.5 truncate">
                  {selectedResourceModal.title_en}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedResourceModal(null)}
                className="p-1.5 rounded-lg text-fg-subtle hover:text-fg hover:bg-subtle transition-colors cursor-pointer shrink-0"
                aria-label="إغلاق النافذة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <h4 className="text-xs font-bold text-fg mb-1">نبذة عن المورد:</h4>
                <p className="text-xs text-fg-muted leading-relaxed">
                  {selectedResourceModal.summary_ar}
                </p>
              </div>

              {selectedResourceModal.description_ar && (
                <div>
                  <h4 className="text-xs font-bold text-fg mb-1">التفاصيل الفنية:</h4>
                  <div className="p-3 rounded-xl bg-subtle/50 border border-border-subtle text-xs text-fg-muted leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto">
                    {selectedResourceModal.description_ar}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-border-subtle flex flex-wrap items-center gap-4 text-xs text-fg-subtle">
                <div className="flex items-center gap-1">
                  <RatingStars rating={selectedResourceModal.rating_avg} size={13} />
                  <span className="font-bold text-fg">({selectedResourceModal.rating_avg})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  <span>{selectedResourceModal.downloads_count.toLocaleString()} تنزيل</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{selectedResourceModal.views_count.toLocaleString()} مشاهدة</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-subtle/30 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedResourceModal(null)}
              >
                إغلاق
              </Button>

              <Link to={`/resources/${selectedResourceModal.slug}`}>
                <Button size="sm" variant="primary">
                  <span>صفحة المورد الكاملة</span>
                  <ExternalLink className="w-3.5 h-3.5 ms-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechStacksPage;
