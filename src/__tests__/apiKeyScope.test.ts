import { describe, it, expect } from 'vitest';
import { ApiKeyScope } from '@/modules/developer/domain/value-objects/api-key-scope';

describe('ApiKeyScope.fromValue', () => {
  it('accepts the two scopes the backend defines (payload-backend/src/collections/APIKeys.ts)', () => {
    expect(ApiKeyScope.fromValue('read')).toBe(ApiKeyScope.READ);
    expect(ApiKeyScope.fromValue('read,write')).toBe(ApiKeyScope.READ_WRITE);
  });

  it('rejects any value the backend would reject', () => {
    expect(() => ApiKeyScope.fromValue('write')).toThrow('Invalid API key scope: write');
  });

  it('canWrite is true only for read,write', () => {
    expect(ApiKeyScope.READ.canWrite()).toBe(false);
    expect(ApiKeyScope.READ_WRITE.canWrite()).toBe(true);
  });
});
