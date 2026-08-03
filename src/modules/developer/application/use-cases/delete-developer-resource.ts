import { deleteDeveloperResource } from '../../infrastructure/resources-api';

export function deleteResource(id: number) {
  return deleteDeveloperResource(id);
}
