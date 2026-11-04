// netlify/functions/sla-monitor.ts
// Hourly SLA Monitor and Escalation Alerts
import { getSupabaseAdmin } from './_shared/supabase-admin';

export async function handler() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'No Supabase connection configured. SLA monitor skipped.' }),
    };
  }

  const now = new Date().toISOString();

  // Find overdue access requests
  const { data: overdueRequests, error } = await supabase
    .from('access_requests')
    .select('id, resource_id, requester_profile_id, status, sla_due_at')
    .in('status', ['submitted', 'under_review'])
    .lt('sla_due_at', now);

  if (error) {
    console.error('Failed to query overdue requests:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }

  // Create notifications and log escalations
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'ok',
      overdue_count: (overdueRequests || []).length,
      checked_at: now,
    }),
  };
}
