-- 005_demo_publishers.sql
-- Demo Publishers for local testing and initial catalog

INSERT INTO profiles (id, handle, display_name, bio, is_public)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'quran_foundation', 'مؤسسة التقنيات القرآنية', 'مبادرة تطويرية مفتوحة المصدر لخدمة مشاريع المصحف الشريف الرقمية.', true),
  ('a0000000-0000-0000-0000-000000000002', 'tafsir_center', 'مركز تفسير للدراسات القرآنية', 'بيت خبرة علمي وتقني متخصص في بحوث ودراسات ونظم علوم التفسير.', true),
  ('a0000000-0000-0000-0000-000000000003', 'almadinah_fonts', 'مجمع خطوط المصحف الشريف', 'مطور خطوط الرسم العثماني الحاسوبية المعتمدة.', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO publishers (id, slug, name_ar, name_en, kind, description_ar, website, verification_status, owner_profile_id, access_policy, default_sla_days)
VALUES
  (
    'p0000000-0000-0000-0000-000000000001',
    'quran-tech-foundation',
    'مؤسسة التقنيات القرآنية',
    'Quran Tech Foundation',
    'organization',
    'مؤسسة غير ربحية تعنى بإنتاج وترخيص وتوزيع الحزم البرمجية ومجموعات البيانات للمطورين والباحثين.',
    'https://qurantech.org',
    'verified',
    'a0000000-0000-0000-0000-000000000001',
    'mixed',
    3
  ),
  (
    'p0000000-0000-0000-0000-000000000002',
    'tafsir-studies-center',
    'مركز دراسات التفسير المعرفي',
    'Tafsir Studies Center',
    'institute',
    'مركز أبحاث مستقل يشرف على مراجعة وتحقيق التفاسير وترجمات معاني القرآن وضبط قواعد البيانات المعرفية.',
    'https://tafsir-center.org',
    'verified',
    'a0000000-0000-0000-0000-000000000002',
    'request',
    5
  ),
  (
    'p0000000-0000-0000-0000-000000000003',
    'uthmanic-type-lab',
    'مختبر الخط العثماني الرقمي',
    'Uthmanic Digital Typography Lab',
    'publisher',
    'مختبر فني متخصص في هندسة الخطوط واليونيكود والرسم العثماني بمطابقة المصاحف المعتمدة.',
    'https://uthmanic-type.org',
    'verified',
    'a0000000-0000-0000-0000-000000000003',
    'open',
    2
  )
ON CONFLICT (slug) DO NOTHING;
