import { updateDeveloperResource, type UpdateResourceInput } from '../../infrastructure/resources-api';

export function updateResource(id: number, data: UpdateResourceInput) {
  return updateDeveloperResource(id, data);
}
