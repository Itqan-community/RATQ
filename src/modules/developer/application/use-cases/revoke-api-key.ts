import { revokeDeveloperApiKey } from '../../infrastructure/api-keys-api';

export function revokeApiKey(keyId: number) {
  return revokeDeveloperApiKey(keyId);
}
