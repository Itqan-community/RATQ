import { createDeveloperResource, type CreateResourceInput } from '../../infrastructure/resources-api';

export function createResource(data: CreateResourceInput) {
  return createDeveloperResource(data);
}
