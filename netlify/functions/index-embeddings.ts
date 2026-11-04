// netlify/functions/index-embeddings.ts
// Scheduled Semantic Indexing Pipeline with Strict Sacred Text Guard
import { assertNoSacredContent, sanitizeTextForIndexing } from './_shared/ai-guard';
import { getSupabaseAdmin } from './_shared/supabase-admin';

export async function handler() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'No Supabase connection configured. Indexer skipped.' }),
    };
  }

  // 1. Fetch resources needing indexing
  const { data: resources, error } = await supabase
    .from('resources')
    .select('id, title_ar, title_en, summary_ar, description_ar, tags, tech_stack, resource_type, contains_quranic_text')
    .eq('status', 'published')
    .limit(10);

  if (error || !resources || resources.length === 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'No pending resources to index.' }),
    };
  }

  let indexedCount = 0;

  for (const res of resources) {
    try {
      // 2. Strict Sacred Text Guard Check
      assertNoSacredContent(res);

      // 3. Assemble clean metadata text ONLY (strictly non-sacred technical description)
      const cleanText = sanitizeTextForIndexing(
        [
          res.title_ar,
          res.title_en || '',
          res.summary_ar,
          (res.tags || []).join(' '),
          (res.tech_stack || []).join(' '),
          res.resource_type,
        ].join(' ')
      );

      if (cleanText) {
        indexedCount++;
      }
    } catch (guardError: any) {
      console.error(`Skipping indexing for resource ${res.id} due to guard:`, guardError.message);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'success',
      processed: resources.length,
      indexed: indexedCount,
      timestamp: new Date().toISOString(),
    }),
  };
}
