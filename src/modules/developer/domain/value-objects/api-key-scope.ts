// Mirrors payload-backend/src/collections/APIKeys.ts's SCOPES field - the
// same two scope strings are currently duplicated as raw <select> option
// values in app/developer/access/page.tsx. Single source of truth so a typo
// in one of those literals fails here instead of silently creating a key
// the backend rejects.
export class ApiKeyScope {
  static readonly READ = new ApiKeyScope('read');
  static readonly READ_WRITE = new ApiKeyScope('read,write');

  private static readonly ALL = [ApiKeyScope.READ, ApiKeyScope.READ_WRITE];

  private constructor(public readonly value: 'read' | 'read,write') {}

  static values(): ApiKeyScope[] {
    return ApiKeyScope.ALL;
  }

  static fromValue(value: string): ApiKeyScope {
    const match = ApiKeyScope.ALL.find((scope) => scope.value === value);
    if (!match) throw new Error(`Invalid API key scope: ${value}`);
    return match;
  }

  canWrite(): boolean {
    return this.value === 'read,write';
  }

  toString(): string {
    return this.value;
  }
}
