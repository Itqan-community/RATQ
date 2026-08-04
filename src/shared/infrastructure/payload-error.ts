// Single copy of the Payload error-shape parser. Shared across modules
// since every Payload-backed write endpoint needs the same fallback logic.
export async function payloadErrorMessage(res: Response, fallback: string): Promise<string> {
  const data = await res.json().catch(() => null);
  return data?.errors?.[0]?.data?.errors?.[0]?.message || data?.errors?.[0]?.message || fallback;
}
