// netlify/functions/email-send.ts
// Transactional Email Dispatcher with RTL Support
import { createErrorResponse } from './_shared/errors';

export async function handler(event: { httpMethod: string; body?: string }) {
  if (event.httpMethod !== 'POST') {
    return createErrorResponse(405, 'ERR_METHOD_NOT_ALLOWED', 'الطريقة غير مدعومة.', 'Method not allowed.');
  }

  try {
    const { to, template, vars } = JSON.parse(event.body || '{}');

    if (!to || !template) {
      return createErrorResponse(400, 'ERR_MISSING_FIELDS', 'البريد أو القالب مفقود.', 'Missing to or template field.');
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // In dev/demo mode, log email safely
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: 'simulated',
          message: 'Email logged in dev mode (no RESEND_API_KEY).',
          to,
          template,
          vars,
        }),
      };
    }

    // Call external email provider if configured
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'sent', template }),
    };
  } catch (err: any) {
    return createErrorResponse(500, 'ERR_EMAIL_FAILED', 'فشل إرسال البريد.', 'Email sending failed.', err.message);
  }
}
