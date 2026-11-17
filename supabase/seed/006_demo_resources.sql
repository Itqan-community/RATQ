-- 006_demo_resources.sql
-- Demo resources tagged with is_demo = true

INSERT INTO resources (
  id, slug, title_ar, title_en, summary_ar, description_ar, resource_type,
  publisher_id, created_by, license_id, access_level, status, itqan_level,
  itqan_awarded_at, latest_version, latest_released_at, downloads_count,
  views_count, rating_avg, rating_count, is_featured, featured_rank,
  tech_stack, tags, install_instructions, repo_url, docs_url, is_demo
)
VALUES
  (
    'r0000000-0000-0000-0000-000000000001',
    'quran-morphology-js',
    'مكتبة الصرف والإعراب القرآني',
    'Quran Morphology Engine JS',
    'مكتبة JavaScript متقدمة لتحليل جذور الكلمات القرآنية وتصريفها والصرف الحاسوبي بدقة عالية.',
    'توفر هذه المكتبة محركاً خفيفاً وسريعاً لتحليل الكلمات القرآنية وصرفها بالاعتماد على قواعد الصرف المعتمدة، مع دعم كامل للتشكيل والزوائد والجذور الثلاثية والرباعية.',
    'library',
    'p0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'mit',
    'open',
    'published',
    'gold',
    now() - interval '60 days',
    '2.4.1',
    now() - interval '14 days',
    18450,
    42100,
    4.90,
    38,
    true,
    1,
    ARRAY['JavaScript', 'TypeScript', 'Node.js'],
    ARRAY['صرف', 'إعراب', 'جذور', 'معالجة لغات'],
    '{"npm": "npm install @qurantech/morphology", "yarn": "yarn add @qurantech/morphology", "pnpm": "pnpm add @qurantech/morphology"}'::jsonb,
    'https://github.com/qurantech/morphology-js',
    'https://qurantech.org/docs/morphology',
    true
  ),
  (
    'r0000000-0000-0000-0000-000000000002',
    'uthmanic-hafs-font',
    'خط مصحف حفص العثماني الرقمي',
    'Uthmanic Hafs Digital Font',
    'خط طباعي حاسوبي OpenType معد خصيصاً لعرض المصحف برواية حفص عن عاصم وفق الرسم العثماني.',
    'خط حاسوبي متطور يدعم كامل علامات الضبط والوقف والرموز القرآنية المتوافقة مع معايير اليونيكود والرسم العثماني المعتمد بمجمع الملك فهد لطباعة المصحف الشريف.',
    'font',
    'p0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000003',
    'cc-by-4.0',
    'open',
    'published',
    'certified',
    now() - interval '120 days',
    '1.8.0',
    now() - interval '30 days',
    34200,
    65000,
    4.95,
    64,
    true,
    2,
    ARRAY['OpenType', 'WOFF2', 'TrueType'],
    ARRAY['خطوط', 'رسم عثماني', 'حفص', 'مصحف'],
    '{"css": "@import url(''https://cdn.ratq.org/fonts/uthmanic-hafs.css'');"}'::jsonb,
    'https://github.com/uthmanic/hafs-font',
    'https://uthmanic-type.org/docs',
    true
  ),
  (
    'r0000000-0000-0000-0000-000000000003',
    'tafsir-cross-reference-dataset',
    'مجموعة بيانات المقارنات التفسيرية',
    'Tafsir Cross-Reference Dataset',
    'مجموعة بيانات معرفية منظمة بصيغة JSON/Parquet تربط الآيات بمواضع الاستشهاد وأقوال المفسرين المحققة.',
    'مجموعة بيانات مقيدة مخصصة للمؤسسات ومراكز الأبحاث تربط نصوص التفاسير المحققة بالموضوعات الدلالية ومناسبات السور، وتتطلب تقديم طلب وصول معتمد لتحديد نطاق الاستخدام البحثي أو التقني.',
    'dataset',
    'p0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    'custom',
    'request',
    'published',
    'certified',
    now() - interval '90 days',
    '3.1.0',
    now() - interval '20 days',
    1240,
    8900,
    4.80,
    19,
    true,
    3,
    ARRAY['JSON', 'Parquet', 'PostgreSQL'],
    ARRAY['تفسير', 'علوم القرآن', 'بيانات معرفية', 'ذكاء اصطناعي'],
    '{"curl": "curl -H \"Authorization: Bearer YOUR_RATQ_KEY\" https://api.ratq.org/v1/datasets/tafsir"}'::jsonb,
    NULL,
    'https://tafsir-center.org/docs/dataset',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert versions and files for demo resources
INSERT INTO resource_versions (id, resource_id, version, changelog_ar, change_kind, status)
VALUES
  (
    'v0000000-0000-0000-0000-000000000001',
    'r0000000-0000-0000-0000-000000000001',
    '2.4.1',
    'تحسين أداء تحليل الجذور الرباعية بنسبة 35% وإصلاح التوافق مع Node 22.',
    'patch',
    'published'
  ),
  (
    'v0000000-0000-0000-0000-000000000002',
    'r0000000-0000-0000-0000-000000000002',
    '1.8.0',
    'إضافة دعم محارف اليونيكود 15.1 وضبط تراكب حركات التشكيل في المتصفحات الحديثة.',
    'minor',
    'published'
  ),
  (
    'v0000000-0000-0000-0000-000000000003',
    'r0000000-0000-0000-0000-000000000003',
    '3.1.0',
    'توسيع نطاق المفردات التفسيرية لتشمل 12 مصدراً معتمداً جديداً وتحسين الفهرسة.',
    'minor',
    'published'
  )
ON CONFLICT (resource_id, version) DO NOTHING;

INSERT INTO resource_files (id, version_id, file_name, storage_path, size_bytes, mime_type, sha256)
VALUES
  (
    'f0000000-0000-0000-0000-000000000001',
    'v0000000-0000-0000-0000-000000000001',
    'quran-morphology-2.4.1.tgz',
    'packages/quran-morphology-2.4.1.tgz',
    412800,
    'application/gzip',
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  ),
  (
    'f0000000-0000-0000-0000-000000000002',
    'v0000000-0000-0000-0000-000000000002',
    'uthmanic-hafs-v1.8.woff2',
    'fonts/uthmanic-hafs-v1.8.woff2',
    892400,
    'font/woff2',
    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
  ),
  (
    'f0000000-0000-0000-0000-000000000003',
    'v0000000-0000-0000-0000-000000000003',
    'tafsir-dataset-v3.1.parquet',
    'datasets/tafsir-dataset-v3.1.parquet',
    14820000,
    'application/octet-stream',
    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
  )
ON CONFLICT (id) DO NOTHING;
