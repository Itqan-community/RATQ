-- 002_categories.sql
INSERT INTO categories (id, slug, name_ar, name_en, parent_id, path, depth, icon, description_ar, sort_order)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'quran-sources', 'نصوص ومصادر مصحفية', 'Quranic Text & Sources', NULL, 'quran-sources', 1, 'BookOpen', 'النصوص المصحفية المعتمدة، الرسم العثماني، وعلامات الضبط والوقف.', 1),
  ('c1000000-0000-0000-0000-000000000002', 'tafsir-sciences', 'تفسير وعلوم القرآن', 'Tafsir & Quranic Sciences', NULL, 'tafsir-sciences', 1, 'Library', 'كتب التفسير المعتمدة، أسباب النزول، الإعراب، وعلوم القرآن المعرفية.', 2),
  ('c1000000-0000-0000-0000-000000000003', 'translations', 'ترجمات معاني القرآن', 'Translations', NULL, 'translations', 1, 'Languages', 'ترجمات معاني القرآن الكريم باللغات العالمية المراجعة من جهات معتمدة.', 3),
  ('c1000000-0000-0000-0000-000000000004', 'dev-tools', 'تقنية وتطوير برمجي', 'Development & Tech', NULL, 'dev-tools', 1, 'Code2', 'حزم ومكتبات برمجية لـ JavaScript، Python، Dart، Swift لتسهيل بناء التطبيقات.', 4),
  ('c1000000-0000-0000-0000-000000000005', 'design-fonts', 'تصميم وخطوط قرآنية', 'Design & Fonts', NULL, 'design-fonts', 1, 'PenTool', 'خطوط حاسوبية مصممة للرسم العثماني ونظم الرموز والزخارف القرآنية.', 5),
  ('c1000000-0000-0000-0000-000000000006', 'datasets-ai', 'مجموعات بيانات والذكاء الاصطناعي', 'Datasets & AI', NULL, 'datasets-ai', 1, 'Database', 'مجموعات بيانات منظمة ومفهرسة لأبحاث الذكاء الاصطناعي ومعالجة اللغة العربية.', 6),
  ('c1000000-0000-0000-0000-000000000007', 'search-indexing', 'أدوات بحث وفهرسة', 'Search & Indexing', NULL, 'search-indexing', 1, 'Search', 'محركات بحث متخصصة، خوارزميات التجذير، واسترجاع الآيات الدلالي.', 7)
ON CONFLICT (slug) DO NOTHING;
