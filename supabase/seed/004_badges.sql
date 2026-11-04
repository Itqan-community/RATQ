-- 004_badges.sql
INSERT INTO badge_levels (code, name_ar, name_en, description_ar, min_score, weight, requires_human_review, can_be_auto, color_token, sort_order)
VALUES
  ('basic', 'إتقان أساسي', 'Basic Itqan', 'بيانات مكتملة وذاتية التصريح؛ استوفت متطلبات التسجيل والتراخيص ولم تخضع للتدقيق البشري بعد.', 85.00, '{"completeness": 40, "license": 30, "links": 30}'::jsonb, false, true, 'badge-basic', 1),
  ('verified', 'موثّق تقنياً', 'Technically Verified', 'تحقّق تقني دوري من سلامة الروابط وتوافر الملفات ومطابقة بصمة SHA-256 وخلوها من المخاطر البرمجية.', 95.00, '{"technical": 50, "security": 30, "documentation": 20}'::jsonb, false, true, 'badge-verified', 2),
  ('certified', 'معتمد علمياً وتقنياً', 'Certified Standard', 'مراجعة بشرية متخصصة ومصادقة علمية من محكمين معتمدين تؤكد دقة الإسناد ومطابقة المصادر المعتمدة.', 90.00, '{"scientific": 35, "technical": 30, "metadata": 20, "compliance": 15}'::jsonb, true, false, 'badge-certified', 3),
  ('gold', 'إتقان ذهبي', 'Gold Standard', 'النخبة في فئتها: استقرار استثنائي، صيانة مستمرة، توثيق احترافي، وتغذية راجعة مجتمعية ممتازة عبر مشاريع حية.', 95.00, '{"peer_review": 30, "usage_impact": 25, "active_maintenance": 25, "community_score": 20}'::jsonb, true, false, 'badge-gold', 4)
ON CONFLICT (code) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
