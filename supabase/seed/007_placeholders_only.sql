-- 007_placeholders_only.sql
-- Sacred Content Placeholders per Section 4 (Guardrails)

-- This file documents and maintains the strict placeholder standard:
-- No raw sacred Quranic text or unreviewed tafsir is inserted directly.
-- Production ingestion must supply authenticated external source authorities.

COMMENT ON COLUMN resources.quran_source_authority IS 'جهة الاعتماد والتوثيق للمحتوى القرآني (مثل مجمع الملك فهد أو تنزيل)';
COMMENT ON COLUMN resources.quran_source_url IS 'الرابط الرسمي المباشر لتوثيق المصدر';
COMMENT ON COLUMN resources.quran_source_version IS 'رقم الإصدار وتاريخ التحديث لمصدر البيانات المعتمد';
