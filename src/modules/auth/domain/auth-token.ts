// Reads the JWT's exp claim so an expired session is caught on the client
// instead of failing silently on the next API call (issue #165). This is a
// display-correctness check only - the payload backend independently rejects
// expired tokens, this just lets useAuth log the user out proactively.
export class AuthToken {
  private constructor(private readonly expiresAtMs: number | null) {}

  static from(value: string): AuthToken {
    return new AuthToken(decodeExpiry(value));
  }

  isExpired(now: number = Date.now()): boolean {
    return this.expiresAtMs !== null && now >= this.expiresAtMs;
  }
}

function decodeExpiry(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof decoded.exp === 'number' ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}
