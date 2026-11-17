// src/lib/betaResources.ts
// Synchronized Quranic Resources from https://beta.ratq.itqan.dev/resources
import { Resource, Publisher } from '@/types';

export const BETA_PUBLISHERS: Publisher[] = [
  {
    "id": "pub_ratq",
    "slug": "ratq",
    "name_ar": "مجتمع رتق",
    "name_en": "RATQ Community",
    "kind": "organization",
    "description_ar": "المجتمع الرسمي لتطوير ونشر البنية التحتية البرمجية القرآنية.",
    "verification_status": "verified",
    "access_policy": "open",
    "default_sla_days": 1,
    "is_active": true,
    "created_at": "2025-01-01T00:00:00Z",
    "owner_profile_id": "user_pub_001"
  },
  {
    "id": "pub_islamhouse",
    "slug": "islamhouse",
    "name_ar": "موقع دار الإسلام",
    "name_en": "IslamHouse",
    "kind": "organization",
    "description_ar": "الموقع الرائد عالمياً في نشر ترجمات معاني القرآن الكريم والمحتوى الإسلامي بأكثر من 100 لغة.",
    "verification_status": "verified",
    "access_policy": "open",
    "default_sla_days": 2,
    "is_active": true,
    "created_at": "2025-02-01T00:00:00Z",
    "owner_profile_id": "user_pub_001"
  },
  {
    "id": "pub_saudi_center",
    "slug": "saudi-recitations-center",
    "name_ar": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "name_en": "Saudi Center for Quranic Recitations",
    "kind": "institute",
    "description_ar": "مركز متخصص في أرشفة وتدقيق ونشر التلاوات القرآنية بالقراءات المتواترة بأعلى جودة صوتية.",
    "verification_status": "verified",
    "access_policy": "open",
    "default_sla_days": 3,
    "is_active": true,
    "created_at": "2025-02-15T00:00:00Z",
    "owner_profile_id": "user_pub_001"
  },
  {
    "id": "pub_tahbeer",
    "slug": "tahbeer-qiraat",
    "name_ar": "تحبير القراءات العشر",
    "name_en": "Tahbeer for the Ten Qira’at",
    "kind": "institute",
    "description_ar": "مؤسسة متخصصة في تسجيل وتوثيق مصاحف القراءات العشر الصغرى والكبرى برواياتها المتواترة.",
    "verification_status": "verified",
    "access_policy": "open",
    "default_sla_days": 2,
    "is_active": true,
    "created_at": "2025-03-01T00:00:00Z",
    "owner_profile_id": "user_pub_001"
  },
  {
    "id": "pub_kfpc",
    "slug": "king-fahd-complex",
    "name_ar": "مجمع الملك فهد لطباعة المصحف الشريف",
    "name_en": "King Fahd Glorious Qur'an Printing Complex",
    "kind": "institute",
    "description_ar": "الصرح العالمي الأول في طباعة المصحف الشريف ونشر خطوطه الحاسوبية ونصوصه المعتمدة بالرسم العثماني.",
    "verification_status": "verified",
    "access_policy": "open",
    "default_sla_days": 1,
    "is_active": true,
    "created_at": "2025-01-01T00:00:00Z",
    "owner_profile_id": "user_pub_001"
  },
  {
    "id": "pub_mknoon",
    "slug": "mknoon-society",
    "name_ar": "جمعية مكنون لتحفيظ القرآن بالرياض",
    "name_en": "Mknoon Society",
    "kind": "organization",
    "description_ar": "الجمعية الخيرية الرائدة لتحفيظ القرآن الكريم بالرياض، منتجة للمناهج والتطبيقات القرآنية الرقمية.",
    "verification_status": "verified",
    "access_policy": "open",
    "default_sla_days": 3,
    "is_active": true,
    "created_at": "2025-03-10T00:00:00Z",
    "owner_profile_id": "user_pub_001"
  },
  {
    "id": "pub_quran_qiraat",
    "slug": "quran-qiraat",
    "name_ar": "موقع قراءات القرآن",
    "name_en": "Quran Qiraat",
    "kind": "publisher",
    "description_ar": "بوابة رقمية متخصصة في جمع وتبويب التلاوات القرآنية بروايات حفص وورش والدوري وباقي الروايات المتواترة.",
    "verification_status": "verified",
    "access_policy": "open",
    "default_sla_days": 2,
    "is_active": true,
    "created_at": "2025-04-01T00:00:00Z",
    "owner_profile_id": "user_pub_001"
  },
  {
    "id": "pub_quranpedia",
    "slug": "quranpedia",
    "name_ar": "موسوعة القرآن (Quranpedia)",
    "name_en": "Quranpedia",
    "kind": "organization",
    "description_ar": "مبادرة مفتوحة المصدر لبناء وتوفير أدوات ومكتبات برمجية لمعالجة وتصميم المصحف الشريف.",
    "verification_status": "verified",
    "access_policy": "open",
    "default_sla_days": 2,
    "is_active": true,
    "created_at": "2025-04-05T00:00:00Z",
    "owner_profile_id": "user_pub_001"
  },
  {
    "id": "pub_quran_com",
    "slug": "quran-com",
    "name_ar": "مشروع Quran.com",
    "name_en": "Quran.com Project",
    "kind": "organization",
    "description_ar": "المنصة القرآنية العالمية الرائدة، توفر واجهات برمجة وتطبيقات ويب وجوال مفتوحة المصدر.",
    "verification_status": "verified",
    "access_policy": "open",
    "default_sla_days": 2,
    "is_active": true,
    "created_at": "2025-01-10T00:00:00Z",
    "owner_profile_id": "user_pub_001"
  },
  {
    "id": "pub_alfanous",
    "slug": "alfanous-team",
    "name_ar": "فريق محرك الفانوس",
    "name_en": "Alfanous Team",
    "kind": "organization",
    "description_ar": "محرك بحث قرآني متقدم باللغة الطبيعية مفتوح المصدر ومبني على قواعد الصرف واللغويات.",
    "verification_status": "verified",
    "access_policy": "open",
    "default_sla_days": 2,
    "is_active": true,
    "created_at": "2025-02-20T00:00:00Z",
    "owner_profile_id": "user_pub_001"
  }
];

export const BETA_RESOURCES: Resource[] = [
  {
    "id": "res_b_100027",
    "slug": "cms-27",
    "title_ar": "المصحف المرتل برواية الدوري عن أبي عمرو بالتوسط",
    "title_en": "Mushaf برواية الدوري عن أبي عمرو بالتوسط",
    "summary_ar": "مصحف مرتل برواية الدوري عن أبي عمرو بالتوسط، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل برواية الدوري عن أبي عمرو بالتوسط، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 1200,
    "views_count": 3500,
    "rating_avg": 4.7,
    "rating_count": 12,
    "is_featured": true,
    "featured_rank": 1,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/27",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/27",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/27",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100153",
    "slug": "cms-153",
    "title_ar": "المصحف المرتل برواية حفص عن عاصم بالتوسط",
    "title_en": "(Tawassut) The Recited Quran according to the narration of Hafs from 'Asim",
    "summary_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الشاطبية بمد المنفصل (التوسط)",
    "description_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الشاطبية بمد المنفصل (التوسط)",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 1337,
    "views_count": 3789,
    "rating_avg": 4.78,
    "rating_count": 19,
    "is_featured": true,
    "featured_rank": 2,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/153",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/153",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/153",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100159",
    "slug": "cms-159",
    "title_ar": "المصحف المرتل برواية ورش عن نافع المدني عن طريق الأصبهاني",
    "title_en": "The Murattal Quran in the Riwayah of Warsh An Nafea from AlAsbahani",
    "summary_ar": "المصحف المرتل برواية ورش عن نافع المدني عن طريق الأصبهاني",
    "description_ar": "المصحف المرتل برواية ورش عن نافع المدني عن طريق الأصبهاني",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 1474,
    "views_count": 4078,
    "rating_avg": 4.86,
    "rating_count": 26,
    "is_featured": true,
    "featured_rank": 3,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/159",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/159",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/159",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100144",
    "slug": "cms-144",
    "title_ar": "التفسير الميسر",
    "title_en": "Tafseer Muyassar",
    "summary_ar": "التفسير الميسر للقرآن الكريم\r\nتاريخ الإنشاء: 15-12-2020\r\nتاريخ آخر تعديل: 01-08-2023\r\nمعلومات حول التحديث الجديد ملف: read.me\r\nتحديث: 3.0",
    "description_ar": "التفسير الميسر للقرآن الكريم\r\nتاريخ الإنشاء: 15-12-2020\r\nتاريخ آخر تعديل: 01-08-2023\r\nمعلومات حول التحديث الجديد ملف: read.me\r\nتحديث: 3.0",
    "resource_type": "tafsir",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 1611,
    "views_count": 4367,
    "rating_avg": 4.94,
    "rating_count": 33,
    "is_featured": true,
    "featured_rank": 4,
    "tech_stack": [
      "JSON",
      "Text",
      "Database"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_tafsir"
    ],
    "tags": [
      "tafsir",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/144",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/144",
    "contains_quranic_text": true,
    "quran_source_authority": "مجمع الملك فهد لطباعة المصحف الشريف",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/144",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100132",
    "slug": "cms-132",
    "title_ar": "المصحف المرتل للقارئ الشيخ محمود خليل الحصري (نسخة الإذاعة)",
    "title_en": "The Murattal Quran by the reciter Sheikh Mahmoud Khalil Al-Husary (Radio Version)",
    "summary_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الطيبة أنتجه المجلس الأعلى للشؤون الإسلامية  بمصر وقد سجل عام 1961 م ويعد هذا المصحف الجمع الصوتي الأول للقرآن الكريم في تاريخ المسلمين.",
    "description_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الطيبة أنتجه المجلس الأعلى للشؤون الإسلامية  بمصر وقد سجل عام 1961 م ويعد هذا المصحف الجمع الصوتي الأول للقرآن الكريم في تاريخ المسلمين.",
    "resource_type": "recitation",
    "publisher_id": "pub_mknoon",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 1748,
    "views_count": 4656,
    "rating_avg": 4.7,
    "rating_count": 40,
    "is_featured": true,
    "featured_rank": 5,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "جمعية مكنون لتحفيظ القرآن بالرياض",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/132",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/132",
    "contains_quranic_text": true,
    "quran_source_authority": "جمعية مكنون لتحفيظ القرآن بالرياض",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/132",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100150",
    "slug": "cms-150",
    "title_ar": "مصحف المدينة النبوية لأعمال الطباعة برواية ورش عن نافع",
    "title_en": "Madinah Noble Quran for Printing Works according to the Narration of Warsh from Nafi'",
    "summary_ar": "مصحف المدينة النبوية برواية ورش عن نافع الصادر عن مجمع الملك فهد لطباعة المصحف الشريف على هيئة ملفات رقمية باستخدام رسم المتجهات المتقدمة Vectors\r\n\r\nمن خلال هذا المصحف يمكن إنشاء صور رقمية ذات جودة غير محدودة ودقة في بيانات العرض ثنائية الأبعاد",
    "description_ar": "مصحف المدينة النبوية برواية ورش عن نافع الصادر عن مجمع الملك فهد لطباعة المصحف الشريف على هيئة ملفات رقمية باستخدام رسم المتجهات المتقدمة Vectors\r\n\r\nمن خلال هذا المصحف يمكن إنشاء صور رقمية ذات جودة غير محدودة ودقة في بيانات العرض ثنائية الأبعاد",
    "resource_type": "mushaf",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 1885,
    "views_count": 4945,
    "rating_avg": 4.78,
    "rating_count": 47,
    "is_featured": true,
    "featured_rank": 6,
    "tech_stack": [
      "Uthmanic",
      "XML",
      "Unicode"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_quran_sources"
    ],
    "tags": [
      "mushaf",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/150",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/150",
    "contains_quranic_text": true,
    "quran_source_authority": "مجمع الملك فهد لطباعة المصحف الشريف",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/150",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100160",
    "slug": "cms-160",
    "title_ar": "المصحف المرتل برواية ورش عن نافع المدني من طريق الأزرق",
    "title_en": "The Murattal Quran in the Riwayah of Warsh An Nafea from Alazraq",
    "summary_ar": "المصحف المرتل برواية ورش عن نافع المدني من طريق الأزرق",
    "description_ar": "المصحف المرتل برواية ورش عن نافع المدني من طريق الأزرق",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 2022,
    "views_count": 5234,
    "rating_avg": 4.86,
    "rating_count": 54,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/160",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/160",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/160",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100010",
    "slug": "cms-10",
    "title_ar": "الترجمة الفرنسية",
    "title_en": "French Translation",
    "summary_ar": "رشيد معاش - ترجمة معاني آيات القرآن الكريم",
    "description_ar": "رشيد معاش - ترجمة معاني آيات القرآن الكريم",
    "resource_type": "translation",
    "publisher_id": "pub_islamhouse",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nd",
    "license_spdx": "CC-BY-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 2159,
    "views_count": 5523,
    "rating_avg": 4.94,
    "rating_count": 61,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "JSON",
      "Multi-Language"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_translations"
    ],
    "tags": [
      "translation",
      "موقع دار الإسلام",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/10",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/10",
    "contains_quranic_text": false,
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100133",
    "slug": "cms-133",
    "title_ar": "المصحف المرتل للقارئ الشيخ مصطفى إسماعيل",
    "title_en": "The Murattal Quran by the reciter Sheikh Mustafa Ismail",
    "summary_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الطيبة أحد مصاحف مشروع المجلس الأعلى للشؤون الإسلامية التي سجلها برواية حفص عن عاصم في ستينيات القرن الماضي",
    "description_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الطيبة أحد مصاحف مشروع المجلس الأعلى للشؤون الإسلامية التي سجلها برواية حفص عن عاصم في ستينيات القرن الماضي",
    "resource_type": "recitation",
    "publisher_id": "pub_mknoon",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 2296,
    "views_count": 5812,
    "rating_avg": 4.7,
    "rating_count": 68,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "جمعية مكنون لتحفيظ القرآن بالرياض",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/133",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/133",
    "contains_quranic_text": true,
    "quran_source_authority": "جمعية مكنون لتحفيظ القرآن بالرياض",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/133",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100154",
    "slug": "cms-154",
    "title_ar": "المصحف المرتل برواية قالون عن نافع من طريق أبي نشيط المروزي من طريق ابن بويان",
    "title_en": "The Murattal Quran in the Riwayah of Qaloon An Nafea",
    "summary_ar": "المصحف المرتل برواية قالون عن نافع من طريق أبي نشيط المروزي من طريق ابن بويان",
    "description_ar": "المصحف المرتل برواية قالون عن نافع من طريق أبي نشيط المروزي من طريق ابن بويان",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 2433,
    "views_count": 6101,
    "rating_avg": 4.78,
    "rating_count": 75,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/154",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/154",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/154",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100161",
    "slug": "cms-161",
    "title_ar": "المصحف المرتل برواية قنبل عن ابن كثير المكي",
    "title_en": "The Murattal Quran in the Riwayah of Qunbul An Ibn Katheir",
    "summary_ar": "المصحف المرتل برواية قنبل عن ابن كثير المكي",
    "description_ar": "المصحف المرتل برواية قنبل عن ابن كثير المكي",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 2570,
    "views_count": 6390,
    "rating_avg": 4.86,
    "rating_count": 17,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/161",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/161",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/161",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100134",
    "slug": "cms-134",
    "title_ar": "المصحف المرتل للشيخ محمود علي البنا",
    "title_en": "Sheikh Mahmoud Ali Al-Banna's Murattal Quran",
    "summary_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الطيبة أحد مصاحف مشروع المجلس الأعلى للشؤون الإسلامية التي سجلها برواية حفص عن عاصم في ستينيات القرن الماضي",
    "description_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الطيبة أحد مصاحف مشروع المجلس الأعلى للشؤون الإسلامية التي سجلها برواية حفص عن عاصم في ستينيات القرن الماضي",
    "resource_type": "recitation",
    "publisher_id": "pub_mknoon",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 2707,
    "views_count": 6679,
    "rating_avg": 4.94,
    "rating_count": 24,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "جمعية مكنون لتحفيظ القرآن بالرياض",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/134",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/134",
    "contains_quranic_text": true,
    "quran_source_authority": "جمعية مكنون لتحفيظ القرآن بالرياض",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/134",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100155",
    "slug": "cms-155",
    "title_ar": "المصحف المرتل برواية السوسي عن أبي عمرو البصري",
    "title_en": "The Murattal Quran in the Riwayah of ِAssossy An Abi Amro Albasri",
    "summary_ar": "المصحف المرتل برواية السوسي عن أبي عمرو البصري",
    "description_ar": "المصحف المرتل برواية السوسي عن أبي عمرو البصري",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 2844,
    "views_count": 6968,
    "rating_avg": 4.7,
    "rating_count": 31,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/155",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/155",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/155",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100162",
    "slug": "cms-162",
    "title_ar": "المصحف المرتل برواية هشام عن ابن عامر الشامي من طريق الأزرق عن الحلواني بالغنة في اللام والرا",
    "title_en": "The Murattal Quran in the Hisham of Warsh An Nafea from AlAzraq from AlHalawani way with Ghunna in Lam and Ra",
    "summary_ar": "المصحف المرتل برواية هشام عن ابن عامر الشامي من طريق الأزرق عن الحلواني بالغنة في اللام والرا",
    "description_ar": "المصحف المرتل برواية هشام عن ابن عامر الشامي من طريق الأزرق عن الحلواني بالغنة في اللام والرا",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 2981,
    "views_count": 7257,
    "rating_avg": 4.78,
    "rating_count": 38,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/162",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/162",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/162",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100145",
    "slug": "cms-145",
    "title_ar": "الميسر في غريب القرآن الكريم",
    "title_en": "Muyassar of Ghareeb Al-Qu’ran",
    "summary_ar": "الميسر في غريب القرآن الكريم\r\nتاريخ الإنشاء: 6-4-2021\r\nتاريخ آخر تعديل: 6-4-2021\r\nمعلومات حول التحديث الجديد:\r\nتحديث: لا يوجد تحديثات",
    "description_ar": "الميسر في غريب القرآن الكريم\r\nتاريخ الإنشاء: 6-4-2021\r\nتاريخ آخر تعديل: 6-4-2021\r\nمعلومات حول التحديث الجديد:\r\nتحديث: لا يوجد تحديثات",
    "resource_type": "tafsir",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 3118,
    "views_count": 7546,
    "rating_avg": 4.86,
    "rating_count": 45,
    "is_featured": true,
    "featured_rank": 0,
    "tech_stack": [
      "JSON",
      "Text",
      "Database"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_tafsir"
    ],
    "tags": [
      "tafsir",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/145",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/145",
    "contains_quranic_text": true,
    "quran_source_authority": "مجمع الملك فهد لطباعة المصحف الشريف",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/145",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100135",
    "slug": "cms-135",
    "title_ar": "مصحف الإذاعة المصرية للقارئ الشيخ عبد الباسط عبد الصمد",
    "title_en": "Sheikh Abdulbasit Abdussamad's Murattal Quran (Egyptian Radio)",
    "summary_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الشاطبية أحد مصاحف مشروع المجلس الأعلى للشؤون الإسلامية التي سجلها برواية حفص عن عاصم في ستينيات القرن الماضي",
    "description_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الشاطبية أحد مصاحف مشروع المجلس الأعلى للشؤون الإسلامية التي سجلها برواية حفص عن عاصم في ستينيات القرن الماضي",
    "resource_type": "recitation",
    "publisher_id": "pub_mknoon",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 3255,
    "views_count": 7835,
    "rating_avg": 4.94,
    "rating_count": 52,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "جمعية مكنون لتحفيظ القرآن بالرياض",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/135",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/135",
    "contains_quranic_text": true,
    "quran_source_authority": "جمعية مكنون لتحفيظ القرآن بالرياض",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/135",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100156",
    "slug": "cms-156",
    "title_ar": "المصحف المرتل برواية شعبة عن عاصم من طريق الشاطبية بمد المنفصل (التوسط)",
    "title_en": "The Murattal Quran in the Riwayah of Shoabah from 'Asim via the Tariq of Ash-Shatibiyyah, with Madd al-Munfasil (Tawassut).",
    "summary_ar": "المصحف المرتل برواية شعبة عن عاصم من طريق الشاطبية بمد المنفصل (التوسط)",
    "description_ar": "المصحف المرتل برواية شعبة عن عاصم من طريق الشاطبية بمد المنفصل (التوسط)",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 3392,
    "views_count": 8124,
    "rating_avg": 4.7,
    "rating_count": 59,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/156",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/156",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/156",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100163",
    "slug": "cms-163",
    "title_ar": "المصحف المرتل برواية ابن وردان عن أبي جعفر المدني",
    "title_en": "The Murattal Quran in the Riwayah of Ibn Wardan An Abi Jaafar",
    "summary_ar": "المصحف المرتل برواية ابن وردان عن أبي جعفر المدني",
    "description_ar": "المصحف المرتل برواية ابن وردان عن أبي جعفر المدني",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 3529,
    "views_count": 8413,
    "rating_avg": 4.78,
    "rating_count": 66,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/163",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/163",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/163",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100007",
    "slug": "cms-7",
    "title_ar": "تفسير البغوي",
    "title_en": "Tafsir Albaghwi",
    "summary_ar": "معالم التنزيل المعروف باسم تفسير البغوي للإمام البغوي - المؤلف: أبو محمد الحسين بن مسعود البغوي، حققه وخرج أحاديثه محمد عبد الله النمر - عثمان جمعة ضميرية - سليمان مسلم الحرش مضمنا لهوامش التحقيق مرمزة ممقسما على الآيات",
    "description_ar": "معالم التنزيل المعروف باسم تفسير البغوي للإمام البغوي - المؤلف: أبو محمد الحسين بن مسعود البغوي، حققه وخرج أحاديثه محمد عبد الله النمر - عثمان جمعة ضميرية - سليمان مسلم الحرش مضمنا لهوامش التحقيق مرمزة ممقسما على الآيات",
    "resource_type": "tafsir",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nd",
    "license_spdx": "CC-BY-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 3666,
    "views_count": 8702,
    "rating_avg": 4.86,
    "rating_count": 73,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "JSON",
      "Text",
      "Database"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_tafsir"
    ],
    "tags": [
      "tafsir",
      "مجتمع رتق",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/7",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/7",
    "contains_quranic_text": true,
    "quran_source_authority": "مجتمع رتق",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/7",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100157",
    "slug": "cms-157",
    "title_ar": "المصحف المرتل برواية خلف عن الإمام حمزة الكوفي",
    "title_en": "The Murattal Quran in the Riwayah of Khalaf from Hamzah",
    "summary_ar": "المصحف المرتل برواية خلف عن الإمام حمزة الكوفي",
    "description_ar": "المصحف المرتل برواية خلف عن الإمام حمزة الكوفي",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 3803,
    "views_count": 8991,
    "rating_avg": 4.94,
    "rating_count": 15,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/157",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/157",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/157",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100164",
    "slug": "cms-164",
    "title_ar": "المصحف المرتل برواية ابن جماز عن أبي جعفر المدني",
    "title_en": "The Murattal Quran in the Riwayah of Ibn Jamaz An Abi Jaafar",
    "summary_ar": "المصحف المرتل برواية ابن جماز عن أبي جعفر المدني",
    "description_ar": "المصحف المرتل برواية ابن جماز عن أبي جعفر المدني",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 3940,
    "views_count": 9280,
    "rating_avg": 4.7,
    "rating_count": 22,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/164",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/164",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/164",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100158",
    "slug": "cms-158",
    "title_ar": "المصحف المرتل برواية خلاد عن الإمام حمزة الكوفي",
    "title_en": "The Murattal Quran in the Riwayah of Khalad from Hamzah",
    "summary_ar": "المصحف المرتل برواية خلاد عن الإمام حمزة الكوفي",
    "description_ar": "المصحف المرتل برواية خلاد عن الإمام حمزة الكوفي",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 4077,
    "views_count": 9569,
    "rating_avg": 4.78,
    "rating_count": 29,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/158",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/158",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/158",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100166",
    "slug": "cms-166",
    "title_ar": "المصحف المرتل برواية البزي عن ابن كثير المكي",
    "title_en": "The Murattal Quran in the Riwayah of Albazy An Ibn Katheir",
    "summary_ar": "المصحف المرتل برواية البزي عن ابن كثير المكي",
    "description_ar": "المصحف المرتل برواية البزي عن ابن كثير المكي",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 4214,
    "views_count": 9858,
    "rating_avg": 4.86,
    "rating_count": 36,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/166",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/166",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/166",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100136",
    "slug": "cms-136",
    "title_ar": "مصحف القارئ عبد الله علي بصفر",
    "title_en": "The Quran of the reciter Abdullah Ali Basfar",
    "summary_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الشاطبية.",
    "description_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الشاطبية.",
    "resource_type": "recitation",
    "publisher_id": "pub_mknoon",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 4351,
    "views_count": 10147,
    "rating_avg": 4.94,
    "rating_count": 43,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "جمعية مكنون لتحفيظ القرآن بالرياض",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/136",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/136",
    "contains_quranic_text": true,
    "quran_source_authority": "جمعية مكنون لتحفيظ القرآن بالرياض",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/136",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100167",
    "slug": "cms-167",
    "title_ar": "المصحف المرتل برواية الدوري عن أبي عمرو البصري من الطيبة بالإدغام الكبير",
    "title_en": "The Murattal Quran in the Riwayah of Aldoree An Abi Amro Albasri from Alteibah with Big Adgham",
    "summary_ar": "المصحف المرتل برواية الدوري عن أبي عمرو البصري من الطيبة بالإدغام الكبير",
    "description_ar": "المصحف المرتل برواية الدوري عن أبي عمرو البصري من الطيبة بالإدغام الكبير",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 4488,
    "views_count": 10436,
    "rating_avg": 4.7,
    "rating_count": 50,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/167",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/167",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/167",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100014",
    "slug": "cms-14",
    "title_ar": "مصحف القارئ ظفر القليب",
    "title_en": "Zafar Al-Qalib Mushaf",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ ظفر القليب، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ ظفر القليب، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 4625,
    "views_count": 10725,
    "rating_avg": 4.78,
    "rating_count": 57,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/14",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/14",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/14",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100141",
    "slug": "cms-141",
    "title_ar": "خط الرسم العثماني للمطورين (رواية قالون)",
    "title_en": "Unicode Uthmanic Font for Developers (Qaloun Narration)",
    "summary_ar": "خط الرسم العثماني (رواية قالون) للمطورين\r\nتاريخ الإنشاء: 18-10-2020\r\nتاريخ آخر تعديل: 25-09-2022\r\nمعلومات حول التحديث الجديدفي ملف: read.me\r\nتحديث: 5.0\r\n\r\nرواية قالون عن نَافِعٍ المَدَنيّ: وهي الرواية التي يقرأ بها أهل ليبيا وتونس وبعض المناطق في موريتانيا\r\n\r\nتحقق الوثوقية (MD5): 964208ff04c8aadd3ddc1be262d8cfd3\r\n\r\nتحقق الوثوقية (SHA-1): 81733666be17742e13c9fa4c7d26d42b1adc67c8",
    "description_ar": "خط الرسم العثماني (رواية قالون) للمطورين\r\nتاريخ الإنشاء: 18-10-2020\r\nتاريخ آخر تعديل: 25-09-2022\r\nمعلومات حول التحديث الجديدفي ملف: read.me\r\nتحديث: 5.0\r\n\r\nرواية قالون عن نَافِعٍ المَدَنيّ: وهي الرواية التي يقرأ بها أهل ليبيا وتونس وبعض المناطق في موريتانيا\r\n\r\nتحقق الوثوقية (MD5): 964208ff04c8aadd3ddc1be262d8cfd3\r\n\r\nتحقق الوثوقية (SHA-1): 81733666be17742e13c9fa4c7d26d42b1adc67c8",
    "resource_type": "font",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 4762,
    "views_count": 11014,
    "rating_avg": 4.86,
    "rating_count": 64,
    "is_featured": true,
    "featured_rank": 0,
    "tech_stack": [
      "OpenType",
      "TrueType",
      "WOFF2"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_fonts"
    ],
    "tags": [
      "font",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/141",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/141",
    "contains_quranic_text": false,
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100169",
    "slug": "cms-169",
    "title_ar": "المصحف المرتل برواية قالون عن نافع المدني من طريق الطيبة بالادغام في اللام والرا",
    "title_en": "**“Murattal Qur’an in the Qālūn narration from Nāfiʿ, via the Ṭayyibah path, with idghām in Lām and Rā.”**",
    "summary_ar": "المصحف المرتل برواية قالون عن نافع المدني من طريق الطيبة بالادغام في اللام والرا",
    "description_ar": "المصحف المرتل برواية قالون عن نافع المدني من طريق الطيبة بالادغام في اللام والرا",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 4899,
    "views_count": 11303,
    "rating_avg": 4.94,
    "rating_count": 71,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/169",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/169",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/169",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100143",
    "slug": "cms-143",
    "title_ar": "خط الرسم العثماني للمطورين (رواية السوسي)",
    "title_en": "Unicode Uthmanic Font for Developers (Susi Narration)",
    "summary_ar": "خط الرسم العثماني (رواية السوسي) للمطورين\r\nتاريخ الإنشاء: 02-11-2020\r\nتاريخ آخر تعديل: 27-09-2022\r\nمعلومات حول التحديث الجديد في ملف: read.me\r\nتحديث: 3.0\r\n\r\nرواية السوسي عن أبي عَمْرِو البَصْريّ: وهي من الروايات التي يستفيد منها المتخصصون في القراءات من طلبة العلم وغيرهم.\r\n\r\nتحقق الوثوقية (MD5): 1bf6023e29b7622a52b6171232c17096\r\n\r\nتحقق الوثوقية (SHA-1): e52dbc6d8b43797a8faa0fd1ec1d8e5000265674",
    "description_ar": "خط الرسم العثماني (رواية السوسي) للمطورين\r\nتاريخ الإنشاء: 02-11-2020\r\nتاريخ آخر تعديل: 27-09-2022\r\nمعلومات حول التحديث الجديد في ملف: read.me\r\nتحديث: 3.0\r\n\r\nرواية السوسي عن أبي عَمْرِو البَصْريّ: وهي من الروايات التي يستفيد منها المتخصصون في القراءات من طلبة العلم وغيرهم.\r\n\r\nتحقق الوثوقية (MD5): 1bf6023e29b7622a52b6171232c17096\r\n\r\nتحقق الوثوقية (SHA-1): e52dbc6d8b43797a8faa0fd1ec1d8e5000265674",
    "resource_type": "font",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 5036,
    "views_count": 11592,
    "rating_avg": 4.7,
    "rating_count": 13,
    "is_featured": true,
    "featured_rank": 0,
    "tech_stack": [
      "OpenType",
      "TrueType",
      "WOFF2"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_fonts"
    ],
    "tags": [
      "font",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/143",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/143",
    "contains_quranic_text": false,
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100170",
    "slug": "cms-170",
    "title_ar": "المصحف المرتل برواية رويس عن يَعْقُوب الحضرمي",
    "title_en": "The murattal Qur’an in the narration of Ruways from Ya‘qūb al‑Ḥaḍramī.",
    "summary_ar": "المصحف المرتل برواية رويس عن يَعْقُوب الحضرمي",
    "description_ar": "المصحف المرتل برواية رويس عن يَعْقُوب الحضرمي",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 5173,
    "views_count": 11881,
    "rating_avg": 4.78,
    "rating_count": 20,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/170",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/170",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/170",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100004",
    "slug": "cms-4",
    "title_ar": "تفسير الطبري",
    "title_en": "Tafsir Altabari",
    "summary_ar": "جامع البيان عن تأويل آي القرآن لمحمد بن جرير الطبري - تفسير الإمام الطبري طبعة دار هجر تحقيق الشيخ عبد الله التركي وفريقه العلمي مضمنا لهوامش التحقيق مرمزة مقسما على الآيات",
    "description_ar": "جامع البيان عن تأويل آي القرآن لمحمد بن جرير الطبري - تفسير الإمام الطبري طبعة دار هجر تحقيق الشيخ عبد الله التركي وفريقه العلمي مضمنا لهوامش التحقيق مرمزة مقسما على الآيات",
    "resource_type": "tafsir",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nd",
    "license_spdx": "CC-BY-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 5310,
    "views_count": 12170,
    "rating_avg": 4.86,
    "rating_count": 27,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "JSON",
      "Text",
      "Database"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_tafsir"
    ],
    "tags": [
      "tafsir",
      "مجتمع رتق",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/4",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/4",
    "contains_quranic_text": true,
    "quran_source_authority": "مجتمع رتق",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/4",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100171",
    "slug": "cms-171",
    "title_ar": "المصحف المرتل برواية روح عن يَعْقُوب الحضرمي",
    "title_en": "“The murattal Qur’an in the narration of Rūḥ from Ya‘qūb al‑Ḥaḍramī.",
    "summary_ar": "المصحف المرتل برواية روح عن يَعْقُوب الحضرمي",
    "description_ar": "المصحف المرتل برواية روح عن يَعْقُوب الحضرمي",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 5447,
    "views_count": 12459,
    "rating_avg": 4.94,
    "rating_count": 34,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/171",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/171",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/171",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100137",
    "slug": "cms-137",
    "title_ar": "خط الرسم العثماني للمطورين (رواية حفص) للأجهزة الذكية",
    "title_en": "Uthmani Script Font for Developers (Hafs Narration) for Smart Devices",
    "summary_ar": "خط الرسم العثماني (رواية حفص) للأجهزة الذكية\r\nتاريخ الإنشاء: 21-08-2020\r\nتاريخ آخر تعديل: 30-06-2022\r\nمعلومات حول التحديث الجديد: في ملف read.me\r\nتحديث: 6.0\r\n\r\nيستخدم لعرض الآيات بالرسم العثماني على الأجهزة الذكية، وهو ليس معداً لعرض كامل صفحة المصحف مطابقة لمصحف المدينة النبوية، ولكنه يستخدم لعرض النص القرآني على مستوى الآيات فقط. مثل عرض نص الآيات في نتائج البحث، عرض نص الآيات في كتاب التفسير أوالكتب الأخرى.\r\n\r\nتحقق الوثوقية (MD5): 53d82b553e5fe919ca1a732e35bf4eb0\r\n\r\nتحقق الوثوقية (SHA-1): 1dbeae3847880b1c21a956dcfdc0a2d9d490e729",
    "description_ar": "خط الرسم العثماني (رواية حفص) للأجهزة الذكية\r\nتاريخ الإنشاء: 21-08-2020\r\nتاريخ آخر تعديل: 30-06-2022\r\nمعلومات حول التحديث الجديد: في ملف read.me\r\nتحديث: 6.0\r\n\r\nيستخدم لعرض الآيات بالرسم العثماني على الأجهزة الذكية، وهو ليس معداً لعرض كامل صفحة المصحف مطابقة لمصحف المدينة النبوية، ولكنه يستخدم لعرض النص القرآني على مستوى الآيات فقط. مثل عرض نص الآيات في نتائج البحث، عرض نص الآيات في كتاب التفسير أوالكتب الأخرى.\r\n\r\nتحقق الوثوقية (MD5): 53d82b553e5fe919ca1a732e35bf4eb0\r\n\r\nتحقق الوثوقية (SHA-1): 1dbeae3847880b1c21a956dcfdc0a2d9d490e729",
    "resource_type": "font",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 5584,
    "views_count": 12748,
    "rating_avg": 4.7,
    "rating_count": 41,
    "is_featured": true,
    "featured_rank": 0,
    "tech_stack": [
      "OpenType",
      "TrueType",
      "WOFF2"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_fonts"
    ],
    "tags": [
      "font",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/137",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/137",
    "contains_quranic_text": false,
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100006",
    "slug": "cms-6",
    "title_ar": "تفسير السعدي",
    "title_en": "Tafsir Alsa'adi",
    "summary_ar": "تيسير الكريم الرحمن في تفسير كلام المنان للشيخ عبدالرحمن السعدي - (تفسير السعدي) طبعة دار ابن الجوزي بالسعودية تحقيق عناية سعد بن فواز الصميل مضمنا لهوامش التحقيق مرمزة مقسما على الآيات",
    "description_ar": "تيسير الكريم الرحمن في تفسير كلام المنان للشيخ عبدالرحمن السعدي - (تفسير السعدي) طبعة دار ابن الجوزي بالسعودية تحقيق عناية سعد بن فواز الصميل مضمنا لهوامش التحقيق مرمزة مقسما على الآيات",
    "resource_type": "tafsir",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nd",
    "license_spdx": "CC-BY-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 5721,
    "views_count": 13037,
    "rating_avg": 4.78,
    "rating_count": 48,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "JSON",
      "Text",
      "Database"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_tafsir"
    ],
    "tags": [
      "tafsir",
      "مجتمع رتق",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/6",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/6",
    "contains_quranic_text": true,
    "quran_source_authority": "مجتمع رتق",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/6",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100172",
    "slug": "cms-172",
    "title_ar": "المصحف المرتل بروايةاسحاق عن خلف العاشر",
    "title_en": "“The murattal Qur’an in the narration of Isḥāq from Khalaf al‑ʿĀshir.",
    "summary_ar": "المصحف المرتل بروايةاسحاق عن خلف العاشر",
    "description_ar": "المصحف المرتل بروايةاسحاق عن خلف العاشر",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 5858,
    "views_count": 13326,
    "rating_avg": 4.86,
    "rating_count": 55,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/172",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/172",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/172",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100005",
    "slug": "cms-5",
    "title_ar": "تفسير ابن كثير",
    "title_en": "Tafsir Ibn Katheer",
    "summary_ar": "تفسير القرآن العظيم للحافظ ابن كثير - طبعة دار ابن الجوزي بالسعودية تحقيق الشيخ أبي إسحاق الحويني - حكمت بشير  مضمنا لهوامش التحقيق مرمزة مقسما على الآيات",
    "description_ar": "تفسير القرآن العظيم للحافظ ابن كثير - طبعة دار ابن الجوزي بالسعودية تحقيق الشيخ أبي إسحاق الحويني - حكمت بشير  مضمنا لهوامش التحقيق مرمزة مقسما على الآيات",
    "resource_type": "tafsir",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nd",
    "license_spdx": "CC-BY-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 5995,
    "views_count": 13615,
    "rating_avg": 4.94,
    "rating_count": 62,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "JSON",
      "Text",
      "Database"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_tafsir"
    ],
    "tags": [
      "tafsir",
      "مجتمع رتق",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/5",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/5",
    "contains_quranic_text": true,
    "quran_source_authority": "مجتمع رتق",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/5",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100173",
    "slug": "cms-173",
    "title_ar": "المصحف المرتل برواية إدريس عن خلف العاشر",
    "title_en": "The murattal Qur’an in the narration of Idrīs from Khalaf al‑ʿĀshir.",
    "summary_ar": "المصحف المرتل برواية إدريس عن خلف العاشر",
    "description_ar": "المصحف المرتل برواية إدريس عن خلف العاشر",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 6132,
    "views_count": 13904,
    "rating_avg": 4.7,
    "rating_count": 69,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/173",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/173",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/173",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100126",
    "slug": "cms-126",
    "title_ar": "مصحف القارئ منصور السالمي",
    "title_en": "Mansour Essalmi Recitation",
    "summary_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الشاطبية.",
    "description_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الشاطبية.",
    "resource_type": "recitation",
    "publisher_id": "pub_mknoon",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 6269,
    "views_count": 14193,
    "rating_avg": 4.78,
    "rating_count": 76,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "جمعية مكنون لتحفيظ القرآن بالرياض",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/126",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/126",
    "contains_quranic_text": true,
    "quran_source_authority": "جمعية مكنون لتحفيظ القرآن بالرياض",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/126",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100174",
    "slug": "cms-174",
    "title_ar": "المصحف المرتل برواية الدوري عن الكسائي",
    "title_en": "“The murattal Qur’an in the narration of al‑Dūrī from al‑Kisā’ī",
    "summary_ar": "المصحف المرتل برواية الدوري عن الكسائي",
    "description_ar": "المصحف المرتل برواية الدوري عن الكسائي",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 6406,
    "views_count": 14482,
    "rating_avg": 4.86,
    "rating_count": 18,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/174",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/174",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/174",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100008",
    "slug": "cms-8",
    "title_ar": "المختصر في تفسير القرآن الكريم",
    "title_en": "Tafsir Almokhtassar",
    "summary_ar": "المختصر في تفسير القرآن الكريم تأليف جماعة من العلماء الطبعة السابعة مميزة بترميز الغريب لغرض التلوين مقسمة على الآيات",
    "description_ar": "المختصر في تفسير القرآن الكريم تأليف جماعة من العلماء الطبعة السابعة مميزة بترميز الغريب لغرض التلوين مقسمة على الآيات",
    "resource_type": "tafsir",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nd",
    "license_spdx": "CC-BY-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 6543,
    "views_count": 14771,
    "rating_avg": 4.94,
    "rating_count": 25,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "JSON",
      "Text",
      "Database"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_tafsir"
    ],
    "tags": [
      "tafsir",
      "مجتمع رتق",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/8",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/8",
    "contains_quranic_text": true,
    "quran_source_authority": "مجتمع رتق",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/8",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100123",
    "slug": "cms-123",
    "title_ar": "مصحف القارئ أحمد عبد الناصر الجادوري",
    "summary_ar": "المصحف المرتل برواية حفص عن عاصم بالقصر",
    "description_ar": "المصحف المرتل برواية حفص عن عاصم بالقصر",
    "resource_type": "recitation",
    "publisher_id": "pub_mknoon",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 6680,
    "views_count": 15060,
    "rating_avg": 4.7,
    "rating_count": 32,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "جمعية مكنون لتحفيظ القرآن بالرياض",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/123",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/123",
    "contains_quranic_text": true,
    "quran_source_authority": "جمعية مكنون لتحفيظ القرآن بالرياض",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/123",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100175",
    "slug": "cms-175",
    "title_ar": "المصحف المرتل برواية أبو الحارث عن الكِسائي",
    "title_en": "The murattal Qur’an in the narration of Abū al‑Hārith from al‑Kisā’ī.",
    "summary_ar": "المصحف المرتل برواية أبو الحارث عن الكِسائي",
    "description_ar": "المصحف المرتل برواية أبو الحارث عن الكِسائي",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 6817,
    "views_count": 15349,
    "rating_avg": 4.78,
    "rating_count": 39,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/175",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/175",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/175",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100020",
    "slug": "cms-20",
    "title_ar": "المصحف المرتل بجمع رواية قالون عن نافع",
    "title_en": "Mushaf بجمع رواية قالون عن نافع",
    "summary_ar": "مصحف مرتل بجمع رواية قالون عن نافع، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل بجمع رواية قالون عن نافع، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 6954,
    "views_count": 15638,
    "rating_avg": 4.86,
    "rating_count": 46,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/20",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/20",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/20",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100176",
    "slug": "cms-176",
    "title_ar": "المصحف المرتل برواية ابن ذكوان عن ابن عامر الشامي",
    "title_en": "“The murattal Qur’an in the narration of Ibn Dhakwān from Ibn ʿĀmir al‑Shāmī.",
    "summary_ar": "المصحف المرتل برواية ابن ذكوان عن ابن عامر الشامي",
    "description_ar": "المصحف المرتل برواية ابن ذكوان عن ابن عامر الشامي",
    "resource_type": "recitation",
    "publisher_id": "pub_quran_qiraat",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 7091,
    "views_count": 15927,
    "rating_avg": 4.94,
    "rating_count": 53,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "موقع قراءات القرآن",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/176",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/176",
    "contains_quranic_text": true,
    "quran_source_authority": "موقع قراءات القرآن",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/176",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100131",
    "slug": "cms-131",
    "title_ar": "المصحف المرتل الثاني للقارئ الشيخ محمد صديق المنشاوي",
    "title_en": "The Second Murattal Quran by the reciter Sheikh Muhammad Siddiq Al-Minshawi",
    "summary_ar": "الإصدار الثاني من المصحف المرتل برواية حفص عن عاصم من طريق الشاطبية من إنتاج وبث إذاعة القرآن الكريم من القاهرة.",
    "description_ar": "الإصدار الثاني من المصحف المرتل برواية حفص عن عاصم من طريق الشاطبية من إنتاج وبث إذاعة القرآن الكريم من القاهرة.",
    "resource_type": "recitation",
    "publisher_id": "pub_mknoon",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 7228,
    "views_count": 16216,
    "rating_avg": 4.7,
    "rating_count": 60,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "جمعية مكنون لتحفيظ القرآن بالرياض",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/131",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/131",
    "contains_quranic_text": true,
    "quran_source_authority": "جمعية مكنون لتحفيظ القرآن بالرياض",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/131",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100177",
    "slug": "cms-177",
    "title_ar": "المصحف الأزهري (موافق لمصحف الشمرلي)",
    "title_en": "The Azhari Mushaf (Conforming to the Shamerly Mushaf)",
    "summary_ar": "صورة للمصحف الذي أصدره مجمع الملك فهد وفق التخطيط الأزهري القديم والموافق لطبعة مصحف الشمرلي المشهورة في مصر",
    "description_ar": "صورة للمصحف الذي أصدره مجمع الملك فهد وفق التخطيط الأزهري القديم والموافق لطبعة مصحف الشمرلي المشهورة في مصر",
    "resource_type": "mushaf",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 7365,
    "views_count": 16505,
    "rating_avg": 4.78,
    "rating_count": 67,
    "is_featured": true,
    "featured_rank": 0,
    "tech_stack": [
      "Uthmanic",
      "XML",
      "Unicode"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_quran_sources"
    ],
    "tags": [
      "mushaf",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/177",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/177",
    "contains_quranic_text": true,
    "quran_source_authority": "مجمع الملك فهد لطباعة المصحف الشريف",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/177",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100139",
    "slug": "cms-139",
    "title_ar": "خط الرسم العثماني للمطورين (رواية ورش)",
    "title_en": "Unicode Uthmanic Font for Developers (Warsh Narration)",
    "summary_ar": "خط الرسم العثماني (رواية ورش) للمطورين\r\nتاريخ الإنشاء: 16-9-2020\r\nتاريخ آخر تعديل: 07-09-2022\r\nمعلومات حول التحديث الجديد في ملف: read.me\r\nتحديث: 6.0\r\n\r\nوهي الرواية التي يقرأ بها أهل المغرب العربي وإفريقيا الغربية والوسطى وغرب أوروبا (فرنسا وإسبانيا)، تَمَّ صَفُّها كاملةً باستخدام لوحة المفاتيح العادية، دون الحاجة إلى إدراج أيّة رموز لا تتوافق مع النظام المعياري Unicode كما تمّ إرفاق وثيقة (وورد) مصادقاً عليها رقمياً، تحتوي على نص القرآن الكريم كاملاً طبقاً للرسم العثماني الموافق لمصحف المدينة النبوية للرواية المذكورة.\r\n\r\nتحقق الوثوقية (MD5): 4701e8bbf053098220cf2cf4cda206a1\r\n\r\nتحقق الوثوقية (SHA-1): 44ecea8feb23817fdc01a8ee2162a6a0cf08cae7",
    "description_ar": "خط الرسم العثماني (رواية ورش) للمطورين\r\nتاريخ الإنشاء: 16-9-2020\r\nتاريخ آخر تعديل: 07-09-2022\r\nمعلومات حول التحديث الجديد في ملف: read.me\r\nتحديث: 6.0\r\n\r\nوهي الرواية التي يقرأ بها أهل المغرب العربي وإفريقيا الغربية والوسطى وغرب أوروبا (فرنسا وإسبانيا)، تَمَّ صَفُّها كاملةً باستخدام لوحة المفاتيح العادية، دون الحاجة إلى إدراج أيّة رموز لا تتوافق مع النظام المعياري Unicode كما تمّ إرفاق وثيقة (وورد) مصادقاً عليها رقمياً، تحتوي على نص القرآن الكريم كاملاً طبقاً للرسم العثماني الموافق لمصحف المدينة النبوية للرواية المذكورة.\r\n\r\nتحقق الوثوقية (MD5): 4701e8bbf053098220cf2cf4cda206a1\r\n\r\nتحقق الوثوقية (SHA-1): 44ecea8feb23817fdc01a8ee2162a6a0cf08cae7",
    "resource_type": "font",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 7502,
    "views_count": 16794,
    "rating_avg": 4.86,
    "rating_count": 74,
    "is_featured": true,
    "featured_rank": 0,
    "tech_stack": [
      "OpenType",
      "TrueType",
      "WOFF2"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_fonts"
    ],
    "tags": [
      "font",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/139",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/139",
    "contains_quranic_text": false,
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100038",
    "slug": "cms-38",
    "title_ar": "مصحف القارئ ناصر باحاج",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ ناصر محمد باحاج، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ ناصر محمد باحاج، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 7639,
    "views_count": 17083,
    "rating_avg": 4.94,
    "rating_count": 16,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/38",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/38",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/38",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100024",
    "slug": "cms-24",
    "title_ar": "المصحف المرتل برواية البزي عن ابن كثير",
    "title_en": "Mushaf برواية البزي عن ابن كثير",
    "summary_ar": "مصحف مرتل برواية البزي عن ابن كثير، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل برواية البزي عن ابن كثير، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 7776,
    "views_count": 17372,
    "rating_avg": 4.7,
    "rating_count": 23,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/24",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/24",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/24",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100026",
    "slug": "cms-26",
    "title_ar": "المصحف المرتل بجمع قراءة ابن كثير",
    "title_en": "Mushaf بجمع قراءة ابن كثير",
    "summary_ar": "مصحف مرتل بجمع قراءة ابن كثير، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل بجمع قراءة ابن كثير، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 7913,
    "views_count": 17661,
    "rating_avg": 4.78,
    "rating_count": 30,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/26",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/26",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/26",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100181",
    "slug": "cms-181",
    "title_ar": "المصحف المشترك لقراء الرياض",
    "title_en": "The Joint Mushaf of Riyadh Reciters",
    "summary_ar": "المصحف المشترك لقراء الرياض هو مشروع قرآني صوتي متميز يجمع نخبة من أبرز قراء وأئمة الجوامع في مدينة الرياض لتلاوة القرآن الكريم كاملاً.\n\nأبرز مميزات المصحف:\n\nالرواية: تم تسجيل التلاوات برواية حفص عن عاصم.\n\nالوجه الأدائي: تُلِيَ المصحف بوجه \"قصر المنفصل\" (من طريق روضة المعدل أو الفيل عن طريق الطيبة)، ويعني ذلك قصر المد الجائز المنفصل بمقدار حركتين فقط بدلاً من أربع أو خمس حركات.\n\nالهدف والأثر: يهدف هذا الجمع إلى إبراز التنوع الصوتي والمقامات الجمالية لقراء العاصمة السعودية في إصدار واحد. بفضل ميزة \"قصر المنفصل\"، تتسم التلاوة بالسلاسة والسرعة المعتدلة (الحدر أو التدوير)، مما يجعله خياراً مثالياً لمن يرغب في مراجعة حفظه أو الاستماع لختمة كاملة في وقت أقصر دون الإخلال بأحكام التجويد.",
    "description_ar": "المصحف المشترك لقراء الرياض هو مشروع قرآني صوتي متميز يجمع نخبة من أبرز قراء وأئمة الجوامع في مدينة الرياض لتلاوة القرآن الكريم كاملاً.\n\nأبرز مميزات المصحف:\n\nالرواية: تم تسجيل التلاوات برواية حفص عن عاصم.\n\nالوجه الأدائي: تُلِيَ المصحف بوجه \"قصر المنفصل\" (من طريق روضة المعدل أو الفيل عن طريق الطيبة)، ويعني ذلك قصر المد الجائز المنفصل بمقدار حركتين فقط بدلاً من أربع أو خمس حركات.\n\nالهدف والأثر: يهدف هذا الجمع إلى إبراز التنوع الصوتي والمقامات الجمالية لقراء العاصمة السعودية في إصدار واحد. بفضل ميزة \"قصر المنفصل\"، تتسم التلاوة بالسلاسة والسرعة المعتدلة (الحدر أو التدوير)، مما يجعله خياراً مثالياً لمن يرغب في مراجعة حفظه أو الاستماع لختمة كاملة في وقت أقصر دون الإخلال بأحكام التجويد.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 8050,
    "views_count": 17950,
    "rating_avg": 4.86,
    "rating_count": 37,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/181",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/181",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/181",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100182",
    "slug": "cms-182",
    "title_ar": "مصحف القارئ أنس الميمان",
    "title_en": "Anas AlMaiman Recitation",
    "summary_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الشاطبية (بمد المنفصل).",
    "description_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الشاطبية (بمد المنفصل).",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 8187,
    "views_count": 18239,
    "rating_avg": 4.94,
    "rating_count": 44,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/182",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/182",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/182",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100042",
    "slug": "cms-42",
    "title_ar": "مصحف القارئ عبد الرحمن العليان",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ عبد الرحمن بن إبراهيم العليان، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ عبد الرحمن بن إبراهيم العليان، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 8324,
    "views_count": 18528,
    "rating_avg": 4.7,
    "rating_count": 51,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/42",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/42",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/42",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100128",
    "slug": "cms-128",
    "title_ar": "مصحف القارئ عبد الله محمد غيلان",
    "title_en": "Abdullah Ghilan Recitation",
    "summary_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الشاطبية مهدى إلى أهل الأرض جميعا من الدكتور عبد الله محمد غيلان حفظه الله.",
    "description_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الشاطبية مهدى إلى أهل الأرض جميعا من الدكتور عبد الله محمد غيلان حفظه الله.",
    "resource_type": "recitation",
    "publisher_id": "pub_mknoon",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 8461,
    "views_count": 18817,
    "rating_avg": 4.78,
    "rating_count": 58,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "جمعية مكنون لتحفيظ القرآن بالرياض",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/128",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/128",
    "contains_quranic_text": true,
    "quran_source_authority": "جمعية مكنون لتحفيظ القرآن بالرياض",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/128",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100031",
    "slug": "cms-31",
    "title_ar": "المصحف المرتل برواية حفص عن عاصم بالتوسط",
    "title_en": "Mushaf برواية حفص عن عاصم بالتوسط",
    "summary_ar": "مصحف مرتل برواية حفص عن عاصم بالتوسط، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل برواية حفص عن عاصم بالتوسط، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 8598,
    "views_count": 19106,
    "rating_avg": 4.86,
    "rating_count": 65,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/31",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/31",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/31",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100039",
    "slug": "cms-39",
    "title_ar": "مصحف القارئ يوسف الدوسري",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ يوسف بن سعيد الدوسري، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ يوسف بن سعيد الدوسري، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 8735,
    "views_count": 19395,
    "rating_avg": 4.94,
    "rating_count": 72,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/39",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/39",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/39",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100124",
    "slug": "cms-124",
    "title_ar": "مصحف القارئ عمر النعيم",
    "title_en": "Omar Annaiem Recitation",
    "summary_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الطيبة.",
    "description_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الطيبة.",
    "resource_type": "recitation",
    "publisher_id": "pub_mknoon",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 8872,
    "views_count": 19684,
    "rating_avg": 4.7,
    "rating_count": 14,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "جمعية مكنون لتحفيظ القرآن بالرياض",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/124",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/124",
    "contains_quranic_text": true,
    "quran_source_authority": "جمعية مكنون لتحفيظ القرآن بالرياض",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/124",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100125",
    "slug": "cms-125",
    "title_ar": "مصحف القارئ صالح الصاهود",
    "title_en": "Saleh Assahood Recitation",
    "summary_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الشاطبية.",
    "description_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الشاطبية.",
    "resource_type": "recitation",
    "publisher_id": "pub_mknoon",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 9009,
    "views_count": 19973,
    "rating_avg": 4.78,
    "rating_count": 21,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "جمعية مكنون لتحفيظ القرآن بالرياض",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/125",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/125",
    "contains_quranic_text": true,
    "quran_source_authority": "جمعية مكنون لتحفيظ القرآن بالرياض",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/125",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100035",
    "slug": "cms-35",
    "title_ar": "مصحف القارئ إبراهيم الدوسري",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ إبراهيم بن سعيد الدوسري، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ إبراهيم بن سعيد الدوسري، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 9146,
    "views_count": 20262,
    "rating_avg": 4.86,
    "rating_count": 28,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/35",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/35",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/35",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100130",
    "slug": "cms-130",
    "title_ar": "مصحف القارئ عبد الرحمن السويد",
    "title_en": "Abdurrahman Assuaid Recitation",
    "summary_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الطيبة.",
    "description_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الطيبة.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 9283,
    "views_count": 20551,
    "rating_avg": 4.94,
    "rating_count": 35,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/130",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/130",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/130",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100016",
    "slug": "cms-16",
    "title_ar": "مصحف القارئ محمد الزبيدي",
    "title_en": "Mohammed Al-Zubaidi Mushaf",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ محمد الزبيدي، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ محمد الزبيدي، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 9420,
    "views_count": 20840,
    "rating_avg": 4.7,
    "rating_count": 42,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/16",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/16",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/16",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100032",
    "slug": "cms-32",
    "title_ar": "المصحف المرتل برواية حفص عن عاصم بقصر المنفصل",
    "title_en": "Mushaf برواية حفص عن عاصم بقصر المنفصل",
    "summary_ar": "مصحف مرتل برواية حفص عن عاصم بقصر المنفصل، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل برواية حفص عن عاصم بقصر المنفصل، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 9557,
    "views_count": 21129,
    "rating_avg": 4.78,
    "rating_count": 49,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/32",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/32",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/32",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100149",
    "slug": "cms-149",
    "title_ar": "مصحف المدينة النبوية لأعمال الطباعة برواية شعبة عن عاصم",
    "title_en": "Madinah Noble Quran for Printing Works according to the Narration of Shu'bah from 'Asim",
    "summary_ar": "مصحف المدينة النبوية برواية شعبة عن عاصم الصادر عن مجمع الملك فهد لطباعة المصحف الشريف على هيئة ملفات رقمية باستخدام رسم المتجهات المتقدمة Vectors\r\n\r\nمن خلال هذا المصحف يمكن إنشاء صور رقمية ذات جودة غير محدودة ودقة في بيانات العرض ثنائية الأبعاد",
    "description_ar": "مصحف المدينة النبوية برواية شعبة عن عاصم الصادر عن مجمع الملك فهد لطباعة المصحف الشريف على هيئة ملفات رقمية باستخدام رسم المتجهات المتقدمة Vectors\r\n\r\nمن خلال هذا المصحف يمكن إنشاء صور رقمية ذات جودة غير محدودة ودقة في بيانات العرض ثنائية الأبعاد",
    "resource_type": "mushaf",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 9694,
    "views_count": 21418,
    "rating_avg": 4.86,
    "rating_count": 56,
    "is_featured": true,
    "featured_rank": 0,
    "tech_stack": [
      "Uthmanic",
      "XML",
      "Unicode"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_quran_sources"
    ],
    "tags": [
      "mushaf",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/149",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/149",
    "contains_quranic_text": true,
    "quran_source_authority": "مجمع الملك فهد لطباعة المصحف الشريف",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/149",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100147",
    "slug": "cms-147",
    "title_ar": "مصحف المدينة النبوية لأعمال الطباعة برواية حفص عن عاصم 1421 هـ",
    "title_en": "Madinah Noble Quran for Printing Works according to the Narration of Hafs from 'Asim 1421 AH",
    "summary_ar": "مصحف المدينة النبوية الصادر عن مجمع الملك فهد لطباعة المصحف الشريف والمطبوع عام 1422 هـ على هيئة ملفات رقمية باستخدام رسم المتجهات المتقدمة Vectors\r\nمن خلال هذا المصحف يمكن إنشاء صور رقمية ذات جودة غير محدودة ودقة في بيانات العرض ثنائية الأبعاد",
    "description_ar": "مصحف المدينة النبوية الصادر عن مجمع الملك فهد لطباعة المصحف الشريف والمطبوع عام 1422 هـ على هيئة ملفات رقمية باستخدام رسم المتجهات المتقدمة Vectors\r\nمن خلال هذا المصحف يمكن إنشاء صور رقمية ذات جودة غير محدودة ودقة في بيانات العرض ثنائية الأبعاد",
    "resource_type": "mushaf",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 9831,
    "views_count": 21707,
    "rating_avg": 4.94,
    "rating_count": 63,
    "is_featured": true,
    "featured_rank": 0,
    "tech_stack": [
      "Uthmanic",
      "XML",
      "Unicode"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_quran_sources"
    ],
    "tags": [
      "mushaf",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/147",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/147",
    "contains_quranic_text": true,
    "quran_source_authority": "مجمع الملك فهد لطباعة المصحف الشريف",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/147",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100148",
    "slug": "cms-148",
    "title_ar": "مصحف المدينة النبوية لأعمال الطباعة برواية حفص عن عاصم 1441 هـ",
    "title_en": "Madinah Noble Quran for Printing Works according to the Narration of Hafs from 'Asim 1441 AH",
    "summary_ar": "مصحف المدينة النبوية الصادر عن مجمع الملك فهد لطباعة المصحف الشريف والمطبوع عام 1441 هـ على هيئة ملفات رقمية باستخدام رسم المتجهات المتقدمة Vectors\r\nمن خلال هذا المصحف يمكن إنشاء صور رقمية ذات جودة غير محدودة ودقة في بيانات العرض ثنائية الأبعاد",
    "description_ar": "مصحف المدينة النبوية الصادر عن مجمع الملك فهد لطباعة المصحف الشريف والمطبوع عام 1441 هـ على هيئة ملفات رقمية باستخدام رسم المتجهات المتقدمة Vectors\r\nمن خلال هذا المصحف يمكن إنشاء صور رقمية ذات جودة غير محدودة ودقة في بيانات العرض ثنائية الأبعاد",
    "resource_type": "mushaf",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 9968,
    "views_count": 21996,
    "rating_avg": 4.7,
    "rating_count": 70,
    "is_featured": true,
    "featured_rank": 0,
    "tech_stack": [
      "Uthmanic",
      "XML",
      "Unicode"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_quran_sources"
    ],
    "tags": [
      "mushaf",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/148",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/148",
    "contains_quranic_text": true,
    "quran_source_authority": "مجمع الملك فهد لطباعة المصحف الشريف",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/148",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100041",
    "slug": "cms-41",
    "title_ar": "مصحف القارئ سامي السلمي",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ سامي بن عوض السلمي، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ سامي بن عوض السلمي، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 10105,
    "views_count": 22285,
    "rating_avg": 4.78,
    "rating_count": 12,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/41",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/41",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/41",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100015",
    "slug": "cms-15",
    "title_ar": "مصحف القارئ ناصر العصفور",
    "title_en": "Nasser Al-Asfour Mushaf",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ ناصر العصفور، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ ناصر العصفور، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 10242,
    "views_count": 22574,
    "rating_avg": 4.86,
    "rating_count": 19,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/15",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/15",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/15",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100011",
    "slug": "cms-11",
    "title_ar": "مصحف القارئ بدر التركي",
    "title_en": "Badr Al-Turki's Mushaf",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ بدر التركي، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ بدر التركي، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 10379,
    "views_count": 22863,
    "rating_avg": 4.94,
    "rating_count": 26,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/11",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/11",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/11",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100146",
    "slug": "cms-146",
    "title_ar": "التجويد الميسر",
    "title_en": "Tajweed Muyassar",
    "summary_ar": "التجويد الميسر\r\nتاريخ الإنشاء: 12-01-2023\r\nتاريخ آخر تعديل: 12-01-2023\r\nمعلومات حول التحديث الجديد:\r\nتحديث: لا يوجد تحديثات",
    "description_ar": "التجويد الميسر\r\nتاريخ الإنشاء: 12-01-2023\r\nتاريخ آخر تعديل: 12-01-2023\r\nمعلومات حول التحديث الجديد:\r\nتحديث: لا يوجد تحديثات",
    "resource_type": "tajweed",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 10516,
    "views_count": 23152,
    "rating_avg": 4.7,
    "rating_count": 33,
    "is_featured": true,
    "featured_rank": 0,
    "tech_stack": [
      "SVG",
      "Vector",
      "Rules"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_quran_sources"
    ],
    "tags": [
      "tajweed",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/146",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/146",
    "contains_quranic_text": true,
    "quran_source_authority": "مجمع الملك فهد لطباعة المصحف الشريف",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/146",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100040",
    "slug": "cms-40",
    "title_ar": "مصحف القارئ أحمد العبيدي",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ أحمد بن عبد الرحمن العبيدي، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ أحمد بن عبد الرحمن العبيدي، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 10653,
    "views_count": 23441,
    "rating_avg": 4.78,
    "rating_count": 40,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/40",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/40",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/40",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100151",
    "slug": "cms-151",
    "title_ar": "مصحف المدينة النبوية لأعمال الطباعة برواية قالون عن نافع",
    "title_en": "Madinah Noble Quran for Printing Works according to the Narration of Qalun from Nafi'",
    "summary_ar": "مصحف المدينة النبوية برواية قالون عن نافع الصادر عن مجمع الملك فهد لطباعة المصحف الشريف على هيئة ملفات رقمية باستخدام رسم المتجهات المتقدمة Vectors\r\n\r\nمن خلال هذا المصحف يمكن إنشاء صور رقمية ذات جودة غير محدودة ودقة في بيانات العرض ثنائية الأبعاد",
    "description_ar": "مصحف المدينة النبوية برواية قالون عن نافع الصادر عن مجمع الملك فهد لطباعة المصحف الشريف على هيئة ملفات رقمية باستخدام رسم المتجهات المتقدمة Vectors\r\n\r\nمن خلال هذا المصحف يمكن إنشاء صور رقمية ذات جودة غير محدودة ودقة في بيانات العرض ثنائية الأبعاد",
    "resource_type": "mushaf",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 10790,
    "views_count": 23730,
    "rating_avg": 4.86,
    "rating_count": 47,
    "is_featured": true,
    "featured_rank": 0,
    "tech_stack": [
      "Uthmanic",
      "XML",
      "Unicode"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_quran_sources"
    ],
    "tags": [
      "mushaf",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/151",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/151",
    "contains_quranic_text": true,
    "quran_source_authority": "مجمع الملك فهد لطباعة المصحف الشريف",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/151",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100013",
    "slug": "cms-13",
    "title_ar": "مصحف القارئ حسن الدغريري",
    "title_en": "Hassan Al-Daghreeri Mushaf",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ حسن الدغريري، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ حسن الدغريري، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 10927,
    "views_count": 24019,
    "rating_avg": 4.94,
    "rating_count": 54,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/13",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/13",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/13",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100127",
    "slug": "cms-127",
    "title_ar": "مصحف القارئ عاطف مفتاح عبد الجواد",
    "title_en": "Atef Muftah Recitation",
    "summary_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الطيبة",
    "description_ar": "المصحف المرتل برواية حفص عن عاصم من طريق الطيبة",
    "resource_type": "recitation",
    "publisher_id": "pub_mknoon",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 11064,
    "views_count": 24308,
    "rating_avg": 4.7,
    "rating_count": 61,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "جمعية مكنون لتحفيظ القرآن بالرياض",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/127",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/127",
    "contains_quranic_text": true,
    "quran_source_authority": "جمعية مكنون لتحفيظ القرآن بالرياض",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/127",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100044",
    "slug": "cms-44",
    "title_ar": "مصحف القارئ عبد الله الخلف",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ عبد الله بن أحمد الخلف، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ عبد الله بن أحمد الخلف، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 11201,
    "views_count": 24597,
    "rating_avg": 4.78,
    "rating_count": 68,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/44",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/44",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/44",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100152",
    "slug": "cms-152",
    "title_ar": "مصحف المدينة النبوية لأعمال الطباعة برواية الدوري عن أبي عمرو",
    "title_en": "Madinah Noble Quran for Printing Works according to the Narration of Al-Duri from Abi 'Amr",
    "summary_ar": "مصحف المدينة النبوية برواية الدوري عن أبي عمرو البصري الصادر عن مجمع الملك فهد لطباعة المصحف الشريف على هيئة ملفات رقمية باستخدام رسم المتجهات المتقدمة Vectors\r\n\r\nمن خلال هذا المصحف يمكن إنشاء صور رقمية ذات جودة غير محدودة ودقة في بيانات العرض ثنائية الأبعاد",
    "description_ar": "مصحف المدينة النبوية برواية الدوري عن أبي عمرو البصري الصادر عن مجمع الملك فهد لطباعة المصحف الشريف على هيئة ملفات رقمية باستخدام رسم المتجهات المتقدمة Vectors\r\n\r\nمن خلال هذا المصحف يمكن إنشاء صور رقمية ذات جودة غير محدودة ودقة في بيانات العرض ثنائية الأبعاد",
    "resource_type": "mushaf",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 11338,
    "views_count": 24886,
    "rating_avg": 4.86,
    "rating_count": 75,
    "is_featured": true,
    "featured_rank": 0,
    "tech_stack": [
      "Uthmanic",
      "XML",
      "Unicode"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_quran_sources"
    ],
    "tags": [
      "mushaf",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/152",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/152",
    "contains_quranic_text": true,
    "quran_source_authority": "مجمع الملك فهد لطباعة المصحف الشريف",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/152",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100036",
    "slug": "cms-36",
    "title_ar": "مصحف القارئ بريك القرني",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ بريك القرني، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ بريك القرني، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 11475,
    "views_count": 25175,
    "rating_avg": 4.94,
    "rating_count": 17,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/36",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/36",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/36",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100012",
    "slug": "cms-12",
    "title_ar": "مصحف القارئ ماجد الزامل",
    "title_en": "Majid Al-Zamil Mushaf",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ ماجد الزامل، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ ماجد الزامل، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 11612,
    "views_count": 25464,
    "rating_avg": 4.7,
    "rating_count": 24,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/12",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/12",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/12",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100138",
    "slug": "cms-138",
    "title_ar": "خط الرسم العثماني للمطورين (رواية حفص)",
    "title_en": "Unicode Uthmanic Font for Developers (Hafs Narration)",
    "summary_ar": "خط الرسم العثماني (رواية حفص) للمطورين\r\nتاريخ الإنشاء: 16-9-2020\r\nتاريخ آخر تعديل: 19-09-2023\r\nمعلومات حول التحديث الجديد في ملف read.me\r\nتحديث: 13.0\r\n\r\nهو خط حاسوبي مخصصة لعرض النص القرآني مطابقاً للرسم العثماني تم بناؤه بما يتوافق مع الترميز العالمي الموحّد Unicode وهو نظام عالمي يمكِّن البيانات من الانتقال عبر الأنظمة والأجهزة المختلفة دون أي تخوّف من عرضها بشكل مشوّه.\r\n\r\nتحقق الوثوقية (MD5): CF6841AEA5B1D1FD70D032B43FF08278\r\n\r\nتحقق الوثوقية (SHA-1): 36EA5AB0D7EA1702F17FF43F9B50924CCCD77EBF",
    "description_ar": "خط الرسم العثماني (رواية حفص) للمطورين\r\nتاريخ الإنشاء: 16-9-2020\r\nتاريخ آخر تعديل: 19-09-2023\r\nمعلومات حول التحديث الجديد في ملف read.me\r\nتحديث: 13.0\r\n\r\nهو خط حاسوبي مخصصة لعرض النص القرآني مطابقاً للرسم العثماني تم بناؤه بما يتوافق مع الترميز العالمي الموحّد Unicode وهو نظام عالمي يمكِّن البيانات من الانتقال عبر الأنظمة والأجهزة المختلفة دون أي تخوّف من عرضها بشكل مشوّه.\r\n\r\nتحقق الوثوقية (MD5): CF6841AEA5B1D1FD70D032B43FF08278\r\n\r\nتحقق الوثوقية (SHA-1): 36EA5AB0D7EA1702F17FF43F9B50924CCCD77EBF",
    "resource_type": "font",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 11749,
    "views_count": 25753,
    "rating_avg": 4.78,
    "rating_count": 31,
    "is_featured": true,
    "featured_rank": 0,
    "tech_stack": [
      "OpenType",
      "TrueType",
      "WOFF2"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_fonts"
    ],
    "tags": [
      "font",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/138",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/138",
    "contains_quranic_text": false,
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100140",
    "slug": "cms-140",
    "title_ar": "خط الرسم العثماني للمطورين (رواية شعبة)",
    "title_en": "Unicode Uthmanic Font for Developers (Shubah Narration)",
    "summary_ar": "خط الرسم العثماني (رواية شعبة) للمطورين\r\nتاريخ الإنشاء: 11-10-2020\r\nتاريخ آخر تعديل: 21-09-2022\r\nمعلومات حول التحديث الجديد في ملف: read.me\r\nتحديث: 6.0\r\n\r\nرواية شُعبة عن عاصِمِ الكُوفيّ: وهي من الروايات التي يستفيد منها المتخصصون في القراءات من طلبة العلم وغيرهم.\r\n\r\nتحقق الوثوقية (MD5): 5cda29121bf0d7234e039002e1fbf600\r\n\r\nتحقق الوثوقية (SHA-1): 8d66bdf0cab96dc7d1032792c19f77980ca6682a",
    "description_ar": "خط الرسم العثماني (رواية شعبة) للمطورين\r\nتاريخ الإنشاء: 11-10-2020\r\nتاريخ آخر تعديل: 21-09-2022\r\nمعلومات حول التحديث الجديد في ملف: read.me\r\nتحديث: 6.0\r\n\r\nرواية شُعبة عن عاصِمِ الكُوفيّ: وهي من الروايات التي يستفيد منها المتخصصون في القراءات من طلبة العلم وغيرهم.\r\n\r\nتحقق الوثوقية (MD5): 5cda29121bf0d7234e039002e1fbf600\r\n\r\nتحقق الوثوقية (SHA-1): 8d66bdf0cab96dc7d1032792c19f77980ca6682a",
    "resource_type": "font",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 11886,
    "views_count": 26042,
    "rating_avg": 4.86,
    "rating_count": 38,
    "is_featured": true,
    "featured_rank": 0,
    "tech_stack": [
      "OpenType",
      "TrueType",
      "WOFF2"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_fonts"
    ],
    "tags": [
      "font",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/140",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/140",
    "contains_quranic_text": false,
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100045",
    "slug": "cms-45",
    "title_ar": "مصحف القارئ عبد الملك المسعود",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ عبد الملك بن أحمد المسعود، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ عبد الملك بن أحمد المسعود، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 12023,
    "views_count": 26331,
    "rating_avg": 4.94,
    "rating_count": 45,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/45",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/45",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/45",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100142",
    "slug": "cms-142",
    "title_ar": "خط الرسم العثماني للمطورين (رواية الدوري)",
    "title_en": "Unicode Uthmanic Font for Developers (Duri Narration)",
    "summary_ar": "خط الرسم العثماني (رواية الدوري) للمطورين\r\nتاريخ الإنشاء: 25-10-2020\r\nتاريخ آخر تعديل: 25-09-2022\r\nمعلومات حول التحديث الجديد في ملف: read.me\r\nتحديث: 3.0\r\n\r\nرواية الدُّورِيّ عن أبي عَمْرِو البَصْريّ: وهي الرواية التي يقرأ بها أهل السودان وشرق أفريقيا.\r\n\r\nتحقق الوثوقية (MD5): a60bdd18397b3e27e4617478968a35c8\r\n\r\nتحقق الوثوقية (SHA-1): 8049482f04b4ff1053a7859f96b2b113b9771efb",
    "description_ar": "خط الرسم العثماني (رواية الدوري) للمطورين\r\nتاريخ الإنشاء: 25-10-2020\r\nتاريخ آخر تعديل: 25-09-2022\r\nمعلومات حول التحديث الجديد في ملف: read.me\r\nتحديث: 3.0\r\n\r\nرواية الدُّورِيّ عن أبي عَمْرِو البَصْريّ: وهي الرواية التي يقرأ بها أهل السودان وشرق أفريقيا.\r\n\r\nتحقق الوثوقية (MD5): a60bdd18397b3e27e4617478968a35c8\r\n\r\nتحقق الوثوقية (SHA-1): 8049482f04b4ff1053a7859f96b2b113b9771efb",
    "resource_type": "font",
    "publisher_id": "pub_kfpc",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "gold",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 12160,
    "views_count": 26620,
    "rating_avg": 4.7,
    "rating_count": 52,
    "is_featured": true,
    "featured_rank": 0,
    "tech_stack": [
      "OpenType",
      "TrueType",
      "WOFF2"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_fonts"
    ],
    "tags": [
      "font",
      "مجمع الملك فهد لطباعة المصحف الشريف",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/142",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/142",
    "contains_quranic_text": false,
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100034",
    "slug": "cms-34",
    "title_ar": "المصحف المرتل بجمع قراءة عاصم",
    "title_en": "Mushaf بجمع قراءة عاصم",
    "summary_ar": "مصحف مرتل بجمع قراءة عاصم، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل بجمع قراءة عاصم، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 12297,
    "views_count": 26909,
    "rating_avg": 4.78,
    "rating_count": 59,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/34",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/34",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/34",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100019",
    "slug": "cms-19",
    "title_ar": "المصحف المرتل برواية قالون عن نافع بالتوسط مع صلة ميم الجمع",
    "title_en": "Mushaf برواية قالون عن نافع بالتوسط مع صلة ميم الجمع",
    "summary_ar": "مصحف مرتل برواية قالون عن نافع بالتوسط مع صلة ميم الجمع، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل برواية قالون عن نافع بالتوسط مع صلة ميم الجمع، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 12434,
    "views_count": 27198,
    "rating_avg": 4.86,
    "rating_count": 66,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/19",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/19",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/19",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100043",
    "slug": "cms-43",
    "title_ar": "مصحف القارئ عبد العزيز التركي",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ عبد العزيز التركي، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ عبد العزيز التركي، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 12571,
    "views_count": 27487,
    "rating_avg": 4.94,
    "rating_count": 73,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/43",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/43",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/43",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100129",
    "slug": "cms-129",
    "title_ar": "مصحف القارئ عبد الله السحيباني",
    "title_en": "Abdullah Assehibani Recitation",
    "summary_ar": "المصحف المرتل برواية حفص عن عاصم بالقصر من طريق الطيبة.",
    "description_ar": "المصحف المرتل برواية حفص عن عاصم بالقصر من طريق الطيبة.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 12708,
    "views_count": 27776,
    "rating_avg": 4.7,
    "rating_count": 15,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/129",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/129",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/129",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100021",
    "slug": "cms-21",
    "title_ar": "المصحف المرتل برواية قالون عن نافع بقصر المنفصل مع سكون ميم الجمع",
    "title_en": "Mushaf برواية قالون عن نافع بقصر المنفصل مع سكون ميم الجمع",
    "summary_ar": "مصحف مرتل برواية قالون عن نافع بقصر المنفصل مع سكون ميم الجمع، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل برواية قالون عن نافع بقصر المنفصل مع سكون ميم الجمع، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 12845,
    "views_count": 28065,
    "rating_avg": 4.78,
    "rating_count": 22,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/21",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/21",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/21",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100018",
    "slug": "cms-18",
    "title_ar": "المصحف المرتل بجمع رواية ورش عن نافع",
    "title_en": "Mushaf بجمع رواية ورش عن نافع",
    "summary_ar": "مصحف مرتل بجمع رواية ورش عن نافع، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل بجمع رواية ورش عن نافع، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 12982,
    "views_count": 28354,
    "rating_avg": 4.86,
    "rating_count": 29,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/18",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/18",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/18",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100037",
    "slug": "cms-37",
    "title_ar": "مصحف القارئ عمر النبراوي",
    "summary_ar": "تلاوة قرآنية عالية الجودة للقارئ عمر النبراوي، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "description_ar": "تلاوة قرآنية عالية الجودة للقارئ عمر النبراوي، مقدّمة حصريًا من المركز السعودي للتلاوات. تعتبر خيارًا مثاليًا للمطورين والناشرين ومنصات المحتوى الباحثين عن تلاوات معتمدة وذات جودة عالية.",
    "resource_type": "recitation",
    "publisher_id": "pub_saudi_center",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 13119,
    "views_count": 28643,
    "rating_avg": 4.94,
    "rating_count": 36,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/37",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/37",
    "contains_quranic_text": true,
    "quran_source_authority": "المركز السعودي للتلاوات القرآنية والأحاديث النبوية",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/37",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100022",
    "slug": "cms-22",
    "title_ar": "المصحف المرتل برواية قالون عن نافع بقصر المنفصل مع صلة ميم الجمع",
    "title_en": "Mushaf برواية قالون عن نافع بقصر المنفصل مع صلة ميم الجمع",
    "summary_ar": "مصحف مرتل برواية قالون عن نافع بقصر المنفصل مع صلة ميم الجمع، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل برواية قالون عن نافع بقصر المنفصل مع صلة ميم الجمع، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 13256,
    "views_count": 28932,
    "rating_avg": 4.7,
    "rating_count": 43,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/22",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/22",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/22",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100025",
    "slug": "cms-25",
    "title_ar": "المصحف المرتل برواية قنبل عن ابن كثير",
    "title_en": "Mushaf برواية قنبل عن ابن كثير",
    "summary_ar": "مصحف مرتل برواية قنبل عن ابن كثير، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل برواية قنبل عن ابن كثير، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 13393,
    "views_count": 29221,
    "rating_avg": 4.78,
    "rating_count": 50,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/25",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/25",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/25",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100033",
    "slug": "cms-33",
    "title_ar": "المصحف المرتل برواية شعبة عن عاصم",
    "title_en": "Mushaf برواية شعبة عن عاصم",
    "summary_ar": "مصحف مرتل برواية شعبة عن عاصم، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل برواية شعبة عن عاصم، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 13530,
    "views_count": 29510,
    "rating_avg": 4.86,
    "rating_count": 57,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/33",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/33",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/33",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100029",
    "slug": "cms-29",
    "title_ar": "المصحف المرتل بجمع رواية الدوري عن أبي عمرو",
    "title_en": "Mushaf بجمع رواية الدوري عن أبي عمرو",
    "summary_ar": "مصحف مرتل بجمع رواية الدوري عن أبي عمرو، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل بجمع رواية الدوري عن أبي عمرو، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 13667,
    "views_count": 29799,
    "rating_avg": 4.94,
    "rating_count": 64,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/29",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/29",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/29",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100030",
    "slug": "cms-30",
    "title_ar": "المصحف المرتل برواية السوسي عن أبي عمرو",
    "title_en": "Mushaf برواية السوسي عن أبي عمرو",
    "summary_ar": "مصحف مرتل برواية السوسي عن أبي عمرو، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل برواية السوسي عن أبي عمرو، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 13804,
    "views_count": 30088,
    "rating_avg": 4.7,
    "rating_count": 71,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/30",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/30",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/30",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100017",
    "slug": "cms-17",
    "title_ar": "المصحف المرتل برواية ورش عن نافع بالتوسط",
    "title_en": "Mushaf برواية ورش عن نافع بالتوسط",
    "summary_ar": "مصحف مرتل برواية ورش عن نافع بالتوسط، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل برواية ورش عن نافع بالتوسط، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 13941,
    "views_count": 30377,
    "rating_avg": 4.78,
    "rating_count": 13,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/17",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/17",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/17",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100028",
    "slug": "cms-28",
    "title_ar": "المصحف المرتل برواية الدوري عن أبي عمرو بقصر المنفصل",
    "title_en": "Mushaf برواية الدوري عن أبي عمرو بقصر المنفصل",
    "summary_ar": "مصحف مرتل برواية الدوري عن أبي عمرو بقصر المنفصل، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "description_ar": "مصحف مرتل برواية الدوري عن أبي عمرو بقصر المنفصل، بصوت القارئ صابر عبدالحكم، تسجيل عالي الجودة يراعي أصول الأداء والتحرير المعتمد في علم القراءات، مقدم من تحبير القراءات العشر.",
    "resource_type": "recitation",
    "publisher_id": "pub_tahbeer",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nc-nd",
    "license_spdx": "CC-BY-NC-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 14078,
    "views_count": 30666,
    "rating_avg": 4.86,
    "rating_count": 20,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "recitation",
      "تحبير القراءات العشر",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/28",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/28",
    "contains_quranic_text": true,
    "quran_source_authority": "تحبير القراءات العشر",
    "quran_source_url": "https://cms.itqan.dev/gallery/asset/28",
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_100009",
    "slug": "cms-9",
    "title_ar": "الترجمة الانجليزية",
    "title_en": "English Translation",
    "summary_ar": "مركز نور الدولي - ترجمة معاني آيات القرآن الكريم",
    "description_ar": "مركز نور الدولي - ترجمة معاني آيات القرآن الكريم",
    "resource_type": "translation",
    "publisher_id": "pub_islamhouse",
    "created_by": "user_pub_001",
    "license_id": "cc-by-nd",
    "license_spdx": "CC-BY-ND-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-01-01T12:00:00Z",
    "downloads_count": 14215,
    "views_count": 30955,
    "rating_avg": 4.94,
    "rating_count": 27,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "JSON",
      "Multi-Language"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_translations"
    ],
    "tags": [
      "translation",
      "موقع دار الإسلام",
      "قرآن"
    ],
    "docs_url": "https://cms.itqan.dev/gallery/asset/9",
    "homepage_url": "https://cms.itqan.dev/gallery/asset/9",
    "contains_quranic_text": false,
    "created_at": "2025-06-01T10:00:00Z",
    "updated_at": "2026-01-15T10:00:00Z"
  },
  {
    "id": "res_b_200070",
    "slug": "payload-tajweed-engning",
    "title_ar": "tajweed engning",
    "title_en": "tajweed engning",
    "summary_ar": "Tajweed annotations for Quranic text.",
    "description_ar": "ajweed-engine is an open-source system that identifies Tajweed rules in Quranic text.\n\nIt provides:\n\n182 scholar-defined Tajweed rules for Hafs ʿan ʿĀsim.\nAn engine that finds where each rule applies.\nA precomputed dataset of 149,223 Tajweed annotations across all 6,236 ayahs.\n\nInstead of producing colored HTML, it returns text positions + rule IDs, making it useful for Quran readers, Tajweed search, research, and educational tools.",
    "resource_type": "library",
    "publisher_id": "pub_quranpedia",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-08-18T08:43:06.999Z",
    "downloads_count": 14352,
    "views_count": 31244,
    "rating_avg": 4.7,
    "rating_count": 34,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "TypeScript",
      "JavaScript"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_dev"
    ],
    "tags": [
      "library",
      "موسوعة القرآن (Quranpedia)",
      "قرآن"
    ],
    "repo_url": "https://github.com/quranpedia/tajweed-engine/",
    "docs_url": "https://github.com/quranpedia/tajweed-engine/",
    "contains_quranic_text": false,
    "created_at": "2026-08-18T08:43:06.999Z",
    "updated_at": "2026-08-18T08:43:06.999Z"
  },
  {
    "id": "res_b_200069",
    "slug": "payload-quran-svg",
    "title_ar": "quran-svg",
    "title_en": "quran-svg",
    "summary_ar": "مصاحف بصيغة SVG جاهزة للاستخدام في التطبيقات",
    "description_ar": "مشروع يوفّر صفحات المصحف الشريف بصيغة SVG عالية الجودة مع إمكانية التفاعل مع كل آية على حدة، ويدعم خمس قراءات قرآنية.",
    "resource_type": "dataset",
    "publisher_id": "pub_quranpedia",
    "created_by": "user_pub_001",
    "license_id": "cc0",
    "license_spdx": "CC0-1.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-08-10T22:02:04.181Z",
    "downloads_count": 14489,
    "views_count": 31533,
    "rating_avg": 4.78,
    "rating_count": 41,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "JSON",
      "Dataset"
    ],
    "languages": [
      "ar"
    ],
    "categories": [
      "cat_datasets"
    ],
    "tags": [
      "dataset",
      "موسوعة القرآن (Quranpedia)",
      "قرآن"
    ],
    "repo_url": "https://github.com/quranpedia/quran-svg",
    "docs_url": "https://github.com/quranpedia/quran-svg/blob/main/README.md",
    "contains_quranic_text": false,
    "created_at": "2026-08-10T22:02:04.180Z",
    "updated_at": "2026-08-10T22:02:04.181Z"
  },
  {
    "id": "res_b_200068",
    "slug": "payload-quran-com",
    "title_ar": "quran.com",
    "title_en": "quran.com",
    "summary_ar": "Full-featured Quran web app from Quran.Foundation with translations, tafsir, and audio.",
    "description_ar": "quran.com is a web application from Quran.Foundation designed to make the Quran accessible to everyone via translations, tafsir (exegesis), audio recitations, and word-by-word translation. Features a clean reading interface, multiple translations/tafsir, high-quality recitations with word-by-word following, advanced search/navigation, ayah bookmarking and notes, QuranReflect community integration, reading-progress tracking, and free developer APIs. Built with Next.js and open source.",
    "resource_type": "tool",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:46:19.374Z",
    "downloads_count": 14626,
    "views_count": 31822,
    "rating_avg": 4.86,
    "rating_count": 48,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "Web",
      "Cross-Platform"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_dev"
    ],
    "tags": [
      "program",
      "مجتمع رتق",
      "قرآن"
    ],
    "repo_url": "https://github.com/quran/quran.com-frontend-next",
    "homepage_url": "https://quran.com/",
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:08.364Z",
    "updated_at": "2026-10-05T07:46:19.374Z"
  },
  {
    "id": "res_b_200067",
    "slug": "payload-equran",
    "title_ar": "eQuran",
    "title_en": "eQuran",
    "summary_ar": "Mobile Quran app with surah/juz browsing, favorites, and recitation playback.",
    "description_ar": "A mobile application for browsing the Quran by surah, juz, or favorites, with aya-by-aya layout and translation, recitation playback (Sheikh Mashari), jump-to-verse navigation, customizable haptics/display/theme/font/playback-rate settings, and 8 available translations. Open source, written in Flutter. Source is archived by the owner but remains available read-only on GitHub.",
    "resource_type": "tool",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:46:17.334Z",
    "downloads_count": 14763,
    "views_count": 32111,
    "rating_avg": 4.94,
    "rating_count": 55,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "Web",
      "Cross-Platform"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_dev"
    ],
    "tags": [
      "program",
      "مجتمع رتق",
      "قرآن"
    ],
    "repo_url": "https://github.com/ya27hw/equran_app",
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:08.344Z",
    "updated_at": "2026-10-05T07:46:17.334Z"
  },
  {
    "id": "res_b_200066",
    "slug": "payload-quran-revision-companion",
    "title_ar": "Quran Revision Companion",
    "title_en": "Quran Revision Companion",
    "summary_ar": "Memorization (hifz) companion app with quizzes and multiple Mushaf layouts.",
    "description_ar": "An app for people memorizing or who have memorized the Quran (huffaz). Offers four Mushaf layouts (16-line IndoPak, 15-line Uthmani, 15-line IndoPak, 13-line IndoPak), memorization quizzes in multiple modes (next ayah, ayah end, mix), ayah highlighting, per-ayah translation lookup with a link to quran.com, lists of mutashabihat (similar ayat) per juz, and page bookmarking. Open source, written in Flutter.",
    "resource_type": "tool",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:46:15.178Z",
    "downloads_count": 14900,
    "views_count": 32400,
    "rating_avg": 4.7,
    "rating_count": 62,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "Web",
      "Cross-Platform"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_dev"
    ],
    "tags": [
      "program",
      "مجتمع رتق",
      "قرآن"
    ],
    "repo_url": "https://github.com/Waqar144/quran_memorization_helper",
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:08.325Z",
    "updated_at": "2026-10-05T07:46:15.178Z"
  },
  {
    "id": "res_b_200065",
    "slug": "payload-noor-ul-huda",
    "title_ar": "Noor-Ul-Huda",
    "title_en": "Noor-Ul-Huda",
    "summary_ar": "Offline-first Quran reading app with prayer times, Duas, tags, and bookmarks.",
    "description_ar": "Noor-Ul-Huda is an offline Quran app with Prayer Time notifications, Adhan, Qibla direction, and Duas (supplications). Supports Imla’ei/Uthmani scripts, multiple Arabic fonts, adjustable contrast/size/theme, page or continuous reading modes, translations in multiple languages, note-taking via tags, Ayah bookmarking, and text search. Once required resources are downloaded, the app functions fully offline.",
    "resource_type": "tool",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:46:13.134Z",
    "downloads_count": 15037,
    "views_count": 32689,
    "rating_avg": 4.78,
    "rating_count": 69,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "Web",
      "Cross-Platform"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_dev"
    ],
    "tags": [
      "program",
      "مجتمع رتق",
      "قرآن"
    ],
    "repo_url": "https://github.com/mirfatif/NoorUlHuda",
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:08.306Z",
    "updated_at": "2026-10-05T07:46:13.134Z"
  },
  {
    "id": "res_b_200064",
    "slug": "payload-quranic",
    "title_ar": "Quranic",
    "title_en": "Quranic",
    "summary_ar": "Semantic search engine for Quran and Hadith translations using sentence embeddings.",
    "description_ar": "A semantic search engine for Quran and Hadith translations using sentence embeddings, supporting multiple embedding models (SGPT variants, CocoSearch, Instructor Embedding). Covers the Clear Quran translation and Hadith collections (Bukhari and Muslim), with pre-computed embeddings for faster search via a simple Python API.",
    "resource_type": "tool",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:46:10.964Z",
    "downloads_count": 15174,
    "views_count": 32978,
    "rating_avg": 4.86,
    "rating_count": 76,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "Web",
      "Cross-Platform"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_dev"
    ],
    "tags": [
      "search",
      "مجتمع رتق",
      "قرآن"
    ],
    "repo_url": "https://github.com/kyb3r/quranic",
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:08.279Z",
    "updated_at": "2026-10-05T07:46:10.964Z"
  },
  {
    "id": "res_b_200063",
    "slug": "payload-quranic-search-v2",
    "title_ar": "Quranic Search v2",
    "title_en": "Quranic Search v2",
    "summary_ar": "Hybrid lexical and semantic (Word2Vec) search web app for the Quran.",
    "description_ar": "A web application providing both lexical (keyword-based) and semantic (meaning-based) search over the Quran, using Word2Vec embeddings for semantic search in Arabic text. Architecture: a React frontend, a Django API for lexical search, and a Flask API for semantic search using AraVec Word2Vec models.",
    "resource_type": "tool",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:46:08.860Z",
    "downloads_count": 15311,
    "views_count": 33267,
    "rating_avg": 4.94,
    "rating_count": 18,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "Web",
      "Cross-Platform"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_dev"
    ],
    "tags": [
      "search",
      "مجتمع رتق",
      "قرآن"
    ],
    "repo_url": "https://github.com/ahr9n/quranic-search-v2",
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:08.254Z",
    "updated_at": "2026-10-05T07:46:08.860Z"
  },
  {
    "id": "res_b_200062",
    "slug": "payload-othman-quran-browser",
    "title_ar": "Othman Quran Browser",
    "title_en": "Othman Quran Browser",
    "summary_ar": "Electronic Quran browser with fast search over the Othmani script.",
    "description_ar": "Othman is an electronic Quran browser that displays Quranic text in Othmani script style, with fast search capabilities, auto-scrolling, and clipboard copy. Built around an inverted-index search architecture enabling fast partial-word matching across all 6,236 verses, with a GTK3 UI and SQLite-backed storage for text and search index.",
    "resource_type": "tool",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc0",
    "license_spdx": "CC0-1.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:46:06.793Z",
    "downloads_count": 15448,
    "views_count": 33556,
    "rating_avg": 4.7,
    "rating_count": 25,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "Web",
      "Cross-Platform"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_dev"
    ],
    "tags": [
      "search",
      "مجتمع رتق",
      "قرآن"
    ],
    "repo_url": "https://github.com/ojuba-org/othman.git",
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:08.226Z",
    "updated_at": "2026-10-05T07:46:06.793Z"
  },
  {
    "id": "res_b_200061",
    "slug": "payload-alfanous",
    "title_ar": "Alfanous",
    "title_en": "Alfanous",
    "summary_ar": "Open-source Arabic Quran full-text search engine API built on Whoosh.",
    "description_ar": "Alfanous is a free, open-source Quranic search engine API for Arabic text, supporting both simple and advanced full-text search over the Quran via an efficient index. Built on the Whoosh pure-Python search library, with Arabic-specific processing (stemming, root analysis). Supports advanced query syntax (quoted phrases, boolean operators, wildcards, range queries), transliteration input, and multiple interfaces (Python API, CLI, web, GUI).",
    "resource_type": "tool",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:46:04.711Z",
    "downloads_count": 15585,
    "views_count": 33845,
    "rating_avg": 4.78,
    "rating_count": 32,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "Web",
      "Cross-Platform"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_dev"
    ],
    "tags": [
      "search",
      "مجتمع رتق",
      "قرآن"
    ],
    "repo_url": "https://github.com/Alfanous-team/alfanous.git",
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:08.198Z",
    "updated_at": "2026-10-05T07:46:04.711Z"
  },
  {
    "id": "res_b_200060",
    "slug": "payload-quran-analysis",
    "title_ar": "Quran Analysis",
    "title_en": "Quran Analysis",
    "summary_ar": "Semantic search and intelligence system for the Quran with morphological analysis and Q&A.",
    "description_ar": "Quran Analysis (QA) is a semantic search and intelligence system for the Quran, providing semantic search, morphological analysis (word roots and derivatives), a question-answering system, ontology-based concept search, multi-script support (Arabic Simple/Uthmani and English), and interactive visualizations. Originated as an MSc project at the University of Leeds in 2015.",
    "resource_type": "tool",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by-sa",
    "license_spdx": "CC-BY-SA-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:46:02.645Z",
    "downloads_count": 15722,
    "views_count": 34134,
    "rating_avg": 4.86,
    "rating_count": 39,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "Web",
      "Cross-Platform"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_dev"
    ],
    "tags": [
      "search",
      "مجتمع رتق",
      "قرآن"
    ],
    "repo_url": "https://github.com/karimouda/qurananalysis/",
    "docs_url": "https://qurananalysis.com/",
    "homepage_url": "https://qurananalysis.com/",
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:08.175Z",
    "updated_at": "2026-10-05T07:46:02.645Z"
  },
  {
    "id": "res_b_200059",
    "slug": "payload-mushafimad",
    "title_ar": "MushafImad",
    "title_en": "MushafImad",
    "summary_ar": "Native Mushaf-reading UI packages for iOS, Android, and Flutter.",
    "description_ar": "A family of native packages delivering a fully-featured Mushaf (Quran) reading experience: a Swift package for iOS 17+/macOS 14+, a Kotlin package for Android, and a Flutter package. Ships page images, verse metadata, timing information, audio helpers, polished UI components, audio playback, toast feedback, and contextual navigation - so app developers can focus on their idea instead of rebuilding Quran-reading UI and data handling.",
    "resource_type": "library",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:46:00.592Z",
    "downloads_count": 15859,
    "views_count": 34423,
    "rating_avg": 4.94,
    "rating_count": 46,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "TypeScript",
      "JavaScript"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_dev"
    ],
    "tags": [
      "library",
      "مجتمع رتق",
      "قرآن"
    ],
    "repo_url": "https://github.com/ibo2001/MushafImad",
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:08.146Z",
    "updated_at": "2026-10-05T07:46:00.592Z"
  },
  {
    "id": "res_b_200058",
    "slug": "payload-kalimat",
    "title_ar": "Kalimat",
    "title_en": "Kalimat",
    "summary_ar": "Neural semantic search engine API for Quran and Sunnah, supporting 130+ languages.",
    "description_ar": "Kalimat is an advanced neural semantic search engine designed for Islamic content, specifically the Quran and the six authentic books of Sunnah. Offers voice or text-based search in over 130 languages via an API, built to be scalable and easy to integrate into applications. Requires an API key, obtainable via a request form linked from their homepage.",
    "resource_type": "tool",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:45:58.386Z",
    "downloads_count": 15996,
    "views_count": 34712,
    "rating_avg": 4.7,
    "rating_count": 53,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "Web",
      "Cross-Platform"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_dev"
    ],
    "tags": [
      "search",
      "مجتمع رتق",
      "قرآن"
    ],
    "docs_url": "https://www.kalimat.dev/",
    "homepage_url": "https://www.kalimat.dev/",
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:08.111Z",
    "updated_at": "2026-10-05T07:45:58.386Z"
  },
  {
    "id": "res_b_200057",
    "slug": "payload-tanzil",
    "title_ar": "Tanzil",
    "title_en": "Tanzil",
    "summary_ar": "Verified Unicode Quran text project, widely used as a source across Quranic apps.",
    "description_ar": "Tanzil is a Quranic project launched in 2007 to produce a highly verified Unicode Quran text for use in Quranic websites and applications. Provides standard Unicode Quran text in multiple scripts (Uthmani, Simple Clean) along with translations, searchability, complete pause marks, and options for diacritics/tanween shapes to suit different fonts and usages.",
    "resource_type": "mushaf",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:45:56.313Z",
    "downloads_count": 16133,
    "views_count": 35001,
    "rating_avg": 4.78,
    "rating_count": 60,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "Uthmanic",
      "XML",
      "Unicode"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_quran_sources"
    ],
    "tags": [
      "mushaf",
      "مجتمع رتق",
      "قرآن"
    ],
    "docs_url": "https://tanzil.net/",
    "homepage_url": "https://tanzil.net/",
    "contains_quranic_text": true,
    "quran_source_authority": "مجتمع رتق",
    "created_at": "2026-08-02T13:08:08.065Z",
    "updated_at": "2026-10-05T07:45:56.313Z"
  },
  {
    "id": "res_b_200056",
    "slug": "payload-quranic-word-level-audio-resources",
    "title_ar": "Quranic Word-Level Audio Resources",
    "title_en": "Quranic Word-Level Audio Resources",
    "summary_ar": "Curated list of word-level Quran recitation audio datasets, timestamp APIs, and alignment tools.",
    "description_ar": "A curated list of solutions providing Quran recitation segmented at the individual word level, enabling precise synchronization between text and audio. Covers standalone word-level audio datasets, APIs providing word-level timestamps, and alignment/AI-based tools. Useful for Quran learning apps, word highlighting during playback, and pronunciation/Tajweed training.",
    "resource_type": "audio",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:45:54.201Z",
    "downloads_count": 1270,
    "views_count": 35290,
    "rating_avg": 4.86,
    "rating_count": 67,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "MP3",
      "Audio",
      "Streaming"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_recitations"
    ],
    "tags": [
      "audio",
      "مجتمع رتق",
      "قرآن"
    ],
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:08.022Z",
    "updated_at": "2026-10-05T07:45:54.201Z"
  },
  {
    "id": "res_b_200055",
    "slug": "payload-quranic-questions-resources",
    "title_ar": "Quranic Questions Resources",
    "title_en": "Quranic Questions Resources",
    "summary_ar": "Curated list of external providers offering Quranic question banks for app developers.",
    "description_ar": "A curated list of external providers of Quranic question banks usable in apps - some free, some subscription-based. Includes organizations and document-sharing platforms hosting quiz/question collections. Answer validity is not independently verified by the curator; developers should validate content before using it in production.",
    "resource_type": "dataset",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:45:52.257Z",
    "downloads_count": 1407,
    "views_count": 35579,
    "rating_avg": 4.94,
    "rating_count": 74,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "JSON",
      "Dataset"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_datasets"
    ],
    "tags": [
      "dataset",
      "مجتمع رتق",
      "قرآن"
    ],
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:07.993Z",
    "updated_at": "2026-10-05T07:45:52.257Z"
  },
  {
    "id": "res_b_200054",
    "slug": "payload-quran-com-api",
    "title_ar": "quran.com-api",
    "title_en": "quran.com-api",
    "summary_ar": "RESTful content API from Quran.Foundation powering quran.com and QuranReflect.",
    "description_ar": "A RESTful API provided by Quran.Foundation designed to let developers build on the same backend that powers Quran.com and QuranReflect. Offers programmatic access to chapters, verses, recitations, and translations, distinct from user-specific data (notes, bookmarks) handled by separate user-related APIs. Optional user authentication enables syncing bookmarks, notes, reflections, and reading history.",
    "resource_type": "api",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:45:50.018Z",
    "downloads_count": 1544,
    "views_count": 35868,
    "rating_avg": 4.7,
    "rating_count": 16,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "REST",
      "JSON",
      "API"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_dev"
    ],
    "tags": [
      "api",
      "مجتمع رتق",
      "قرآن"
    ],
    "repo_url": "https://github.com/quran/quran.com-api",
    "docs_url": "https://api-docs.quran.foundation/docs/category/content-apis/",
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:07.969Z",
    "updated_at": "2026-10-05T07:45:50.018Z"
  },
  {
    "id": "res_b_200053",
    "slug": "payload-quran-json",
    "title_ar": "quran-json",
    "title_en": "quran-json",
    "summary_ar": "JavaScript package delivering Quran text, transliteration, and translations in JSON.",
    "description_ar": "A JavaScript package providing Quran text and translations in JSON format, at multiple granularities (entire Quran, individual chapters, individual verses). Accessible via CDN links for direct web usage, or via npm for local builds and offline customization. Includes transliteration alongside the Arabic text.",
    "resource_type": "dataset",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by-sa",
    "license_spdx": "CC-BY-SA-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:45:47.917Z",
    "downloads_count": 1681,
    "views_count": 36157,
    "rating_avg": 4.78,
    "rating_count": 23,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "JSON",
      "Dataset"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_datasets"
    ],
    "tags": [
      "json",
      "مجتمع رتق",
      "قرآن"
    ],
    "repo_url": "https://github.com/risan/quran-json",
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:07.944Z",
    "updated_at": "2026-10-05T07:45:47.917Z"
  },
  {
    "id": "res_b_200052",
    "slug": "payload-quranenc",
    "title_ar": "QuranEnc",
    "title_en": "QuranEnc",
    "summary_ar": "Portal of verified Quran translations and exegeses in 79 languages.",
    "description_ar": "QuranEnc is a portal featuring free and trustworthy translations of the meanings and exegeses of the Quran in many world languages, prepared by reliable translators under the supervision of specialized bodies. Provides translations for 79 different languages, each with multiple translators, in API, CSV, XLS, XML, and PDF formats. Also offers web, Android, and iOS applications for browsing.",
    "resource_type": "translation",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "verified",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:45:45.890Z",
    "downloads_count": 1818,
    "views_count": 36446,
    "rating_avg": 4.86,
    "rating_count": 30,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "JSON",
      "Multi-Language"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_translations"
    ],
    "tags": [
      "translation",
      "مجتمع رتق",
      "قرآن"
    ],
    "docs_url": "https://quranenc.com/en/home/api",
    "homepage_url": "https://quranenc.com/",
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:07.918Z",
    "updated_at": "2026-10-05T07:45:45.890Z"
  },
  {
    "id": "res_b_200051",
    "slug": "payload-qqac",
    "title_ar": "QQAC",
    "title_en": "QQAC",
    "summary_ar": "Bilingual (Arabic/English) dataset of 1224 annotated Quran Q&A pairs on HuggingFace.",
    "description_ar": "QQAC is a HuggingFace dataset containing 1224 annotated question-answers in both Arabic and English. It provides an English translation of the original AQQAC dataset and adds the relevant Surah ayahs to the context column. Usable directly via HuggingFace datasets or the Python `datasets` library.",
    "resource_type": "dataset",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:45:43.764Z",
    "downloads_count": 1955,
    "views_count": 36735,
    "rating_avg": 4.94,
    "rating_count": 37,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "JSON",
      "Dataset"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_datasets"
    ],
    "tags": [
      "dataset",
      "مجتمع رتق",
      "قرآن"
    ],
    "docs_url": "https://huggingface.co/datasets/nazimali/quran-question-answer-context",
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:07.894Z",
    "updated_at": "2026-10-05T07:45:43.764Z"
  },
  {
    "id": "res_b_200050",
    "slug": "payload-aqqac",
    "title_ar": "AQQAC",
    "title_en": "AQQAC",
    "summary_ar": "Annotated dataset of ~2224 Arabic Quran questions and answers.",
    "description_ar": "AQQAC is a collection of approximately 2224 questions and answers about the Quran, with 1224 annotated question-answers available for download and public use (the rest withheld due to copyright concerns). Each entry is annotated with question ID, question word (particle), chapter number, verse number, question topic, question type, Quran ontology concepts, and question source. Available for download in both XML and XLSX formats. Questions are available in Arabic only.",
    "resource_type": "dataset",
    "publisher_id": "pub_ratq",
    "created_by": "user_pub_001",
    "license_id": "cc-by",
    "license_spdx": "CC-BY-4.0",
    "access_level": "open",
    "status": "published",
    "itqan_level": "basic",
    "itqan_awarded_at": "2025-11-01T10:00:00Z",
    "latest_version": "1.0.0",
    "latest_released_at": "2026-10-05T07:45:41.730Z",
    "downloads_count": 2092,
    "views_count": 37024,
    "rating_avg": 4.7,
    "rating_count": 44,
    "is_featured": false,
    "featured_rank": 0,
    "tech_stack": [
      "JSON",
      "Dataset"
    ],
    "languages": [
      "ar",
      "en"
    ],
    "categories": [
      "cat_datasets"
    ],
    "tags": [
      "dataset",
      "مجتمع رتق",
      "قرآن"
    ],
    "docs_url": "https://archive.researchdata.leeds.ac.uk/464/",
    "contains_quranic_text": false,
    "created_at": "2026-08-02T13:08:07.834Z",
    "updated_at": "2026-10-05T07:45:41.730Z"
  }
];
