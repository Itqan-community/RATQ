import { fetchDeveloperAPIKeys } from '../../infrastructure/api-keys-api';

export function listApiKeys() {
  return fetchDeveloperAPIKeys();
}
