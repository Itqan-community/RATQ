import { fetchResource } from '../../infrastructure/resources-api';
import { canViewResource } from '../../domain/services/visibility-policy';
import type { Resource, User } from '@/types/resource';

export async function getResource(slug: string, viewer: User | null = null): Promise<Resource> {
  const resource = await fetchResource(slug);
  if (!canViewResource(resource, viewer)) {
    throw new Error('Resource not found');
  }
  return resource;
}
