'use client';

import useSWRMutation from 'swr/mutation';
import { revokeAccessRequest } from '@/modules/resources/application/use-cases/revoke-access-request';
import type { AccessRequest } from '@/types/resource';

export function useRevokeAccess(resourceId: number | null) {
  return useSWRMutation<AccessRequest, Error, (string | number)[] | null, number>(
    resourceId === null ? null : ['resource', 'access', resourceId],
    async (_: unknown, { arg: requestId }) => await revokeAccessRequest(requestId),
  );
}
