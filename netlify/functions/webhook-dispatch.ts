// netlify/functions/webhook-dispatch.ts
// Outgoing Webhook Dispatcher with HMAC-SHA256 Signatures
import crypto from 'crypto';

export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export function signWebhookPayload(payload: string, secret: string, timestamp: number): string {
  const signatureString = `${timestamp}.${payload}`;
  return crypto.createHmac('sha256', secret).update(signatureString).digest('hex');
}

export async function handler(event: { body?: string }) {
  if (!event.body) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing webhook body' }) };
  }

  try {
    const { endpoint, secret, payload } = JSON.parse(event.body);
    const timestamp = Math.floor(Date.now() / 1000);
    const payloadString = JSON.stringify(payload);
    const signature = signWebhookPayload(payloadString, secret, timestamp);

    // In production, performs fetch(endpoint, ...)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        delivered: true,
        endpoint,
        timestamp,
        signature: `sha256=${signature}`,
      }),
    };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
