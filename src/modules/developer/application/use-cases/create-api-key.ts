import { createDeveloperApiKey } from '../../infrastructure/api-keys-api';

export function createApiKey(resourceId: number, scope: string, name?: string) {
  return createDeveloperApiKey(resourceId, scope, name);
}
