-- 001_licenses.sql
INSERT INTO licenses (id, name_ar, name_en, url, allows_commercial, requires_attribution, requires_share_alike, allows_modification, is_osi_approved, notes_ar)
VALUES
  ('mit', 'رخصة إم آي تي', 'MIT License', 'https://opensource.org/licenses/MIT', true, true, false, true, true, 'رخصة متساهلة تسمح بالاستخدام التجاري والتعديل مع حفظ الإسناد.'),
  ('apache-2.0', 'رخصة أباتشي 2.0', 'Apache License 2.0', 'https://www.apache.org/licenses/LICENSE-2.0', true, true, false, true, true, 'رخصة برمجية مفتوحة المصدر تتضمن منح حقوق براءات الاختراع صراحة.'),
  ('cc-by-4.0', 'مشاع إبداعي نَسْب المُصنَّف 4.0', 'Creative Commons Attribution 4.0 International', 'https://creativecommons.org/licenses/by/4.0/', true, true, false, true, false, 'تسمح بالمشاركة والتعديل لأي غرض، بما في ذلك التجاري، شريطة ذكر المصدر.'),
  ('cc-by-sa-4.0', 'مشاع إبداعي نَسْب المُصنَّف - الترخيص بالمثل 4.0', 'Creative Commons Attribution-ShareAlike 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', true, true, true, true, false, 'تتطلب نشر الأعمال المشتقة بنفس رخصة المصدر الأصلي.'),
  ('gpl-3.0', 'رخصة جنو العمومية 3.0', 'GNU General Public License v3.0', 'https://www.gnu.org/licenses/gpl-3.0.html', true, true, true, true, true, 'رخصة حقوق متروكة قوية تلزم بفتح المصدر للأعمال المشتقة.'),
  ('bsd-3-clause', 'رخصة بي إس دي ثلاثية الفقرات', 'BSD 3-Clause License', 'https://opensource.org/licenses/BSD-3-Clause', true, true, false, true, true, 'رخصة حرة متساهلة مع حظر استخدام اسم صاحب الحق في الترويج دون إذن.'),
  ('custom', 'ترخيص مخصص من الناشر', 'Custom Publisher License', 'https://ratq.org/licenses/custom', false, true, false, false, false, 'ترخيص مقيّد يحدده الناشر وفق اتفاقية استخدام خاصة أو وصول بالطلب.')
ON CONFLICT (id) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  allows_commercial = EXCLUDED.allows_commercial;
