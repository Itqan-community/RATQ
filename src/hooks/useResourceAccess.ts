'use client';

import useSWR from 'swr';
import { listResourceAccess } from '@/modules/resources/application/use-cases/list-resource-access';
import type { AccessRequest } from '@/types/resource';

type ResourceAccess = { grants: AccessRequest[]; total: number };

// Keyed by resource so two resources' access lists never share a cache entry.
export function useResourceAccess(resourceId: number | null) {
  return useSWR<ResourceAccess, Error>(
    resourceId === null ? null : ['resource', 'access', resourceId],
    () => listResourceAccess(resourceId as number),
  );
}
