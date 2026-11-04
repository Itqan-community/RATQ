-- 003_resource_types.sql
INSERT INTO resource_types (code, name_ar, name_en, icon, color_token, requires_scientific_review, sort_order)
VALUES
  ('library', 'مكتبة برمجية', 'Library', 'Package', 'primary', false, 1),
  ('sdk', 'حزمة تطوير SDK', 'SDK', 'Layers', 'primary', false, 2),
  ('dataset', 'مجموعة بيانات', 'Dataset', 'Database', 'deep', false, 3),
  ('api', 'واجهة برمجية API', 'API', 'Webhook', 'deep', false, 4),
  ('tafsir_reference', 'مرجع تفسير', 'Tafsir Reference', 'BookOpen', 'gold', true, 5),
  ('translation', 'ترجمة معاني', 'Translation', 'Globe', 'gold', true, 6),
  ('font', 'خط طباعي', 'Font', 'Type', 'primary', false, 7),
  ('tool', 'أداة مساعدة', 'Tool', 'Wrench', 'neutral', false, 8),
  ('fiqh_tool', 'أداة فقهية وحسابية', 'Fiqh Tool', 'Calculator', 'gold', true, 9),
  ('audio', 'تسجيلات وتلاوات', 'Audio', 'Headphones', 'deep', true, 10)
ON CONFLICT (code) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  requires_scientific_review = EXCLUDED.requires_scientific_review;
