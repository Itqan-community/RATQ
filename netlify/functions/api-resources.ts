// netlify/functions/api-resources.ts
import { createErrorResponse } from './_shared/errors';
import { getSupabaseAdmin } from './_shared/supabase-admin';

export async function handler(event: {
  httpMethod: string;
  path: string;
  queryStringParameters?: Record<string, string | undefined>;
}) {
  if (event.httpMethod !== 'GET') {
    return createErrorResponse(405, 'ERR_METHOD_NOT_ALLOWED', 'الطريقة غير مدعومة.', 'Method not allowed.');
  }

  const supabase = getSupabaseAdmin();
  const qsp = event.queryStringParameters || {};
  const page = parseInt(qsp.page || '1', 10);
  const perPage = Math.min(parseInt(qsp.per_page || '24', 10), 100);

  // If Supabase is connected, query the database
  if (supabase) {
    let query = supabase
      .from('resources_list_view')
      .select('*', { count: 'exact' });

    if (qsp.type) {
      query = query.eq('resource_type', qsp.type);
    }
    if (qsp.itqan) {
      query = query.eq('itqan_level', qsp.itqan);
    }
    if (qsp.access) {
      query = query.eq('access_level', qsp.access);
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    const { data, count, error } = await query.range(from, to);

    if (error) {
      return createErrorResponse(500, 'ERR_DATABASE', 'تعذر جلب البيانات.', 'Database query failed.', error);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
      body: JSON.stringify({
        data,
        pagination: {
          page,
          per_page: perPage,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / perPage),
        },
      }),
    };
  }

  // Fallback mock response for offline/demo verification
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      data: [
        {
          slug: 'quran-morphology-js',
          title_ar: 'مكتبة الصرف والإعراب القرآني',
          summary_ar: 'مكتبة JavaScript متقدمة لتحليل جذور الكلمات القرآنية وتصريفها والصرف الحاسوبي.',
          resource_type: 'library',
          itqan_level: 'gold',
          access_level: 'open',
          rating_avg: 4.9,
          rating_count: 38,
          latest_version: '2.4.1',
          publisher_name_ar: 'مؤسسة التقنيات القرآنية',
          publisher_slug: 'quran-tech-foundation',
        },
        {
          slug: 'uthmanic-hafs-font',
          title_ar: 'خط مصحف حفص العثماني الرقمي',
          summary_ar: 'خط طباعي حاسوبي OpenType معد خصيصاً لعرض المصحف برواية حفص عن عاصم.',
          resource_type: 'font',
          itqan_level: 'certified',
          access_level: 'open',
          rating_avg: 4.95,
          rating_count: 64,
          latest_version: '1.8.0',
          publisher_name_ar: 'مختبر الخط العثماني الرقمي',
          publisher_slug: 'uthmanic-type-lab',
        },
      ],
      pagination: {
        page: 1,
        per_page: 24,
        total: 2,
        total_pages: 1,
      },
    }),
  };
}
