// netlify/functions/_shared/errors.ts

export interface ApiErrorResponse {
  error: {
    code: string;
    message_ar: string;
    message_en: string;
    requestId: string;
    details?: unknown;
  };
}

export function createErrorResponse(
  statusCode: number,
  code: string,
  message_ar: string,
  message_en: string,
  details?: unknown
): { statusCode: number; headers: Record<string, string>; body: string } {
  const requestId = 'req_' + Math.random().toString(36).substring(2, 10);
  const body: ApiErrorResponse = {
    error: {
      code,
      message_ar,
      message_en,
      requestId,
      ...(details ? { details } : {}),
    },
  };

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Request-Id': requestId,
    },
    body: JSON.stringify(body),
  };
}
