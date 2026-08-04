import { fetchDeveloperResources } from '../../infrastructure/resources-api';

export function listDeveloperResources(userId: number) {
  return fetchDeveloperResources(userId);
}
