"use client";

import type { AccessRequest, updatableStatus } from "@/types/resource";
import { updateAccessRequest } from "@/modules/resources/application/use-cases/update-access-requests";
import useSWRMutation from "swr/mutation";

export function useUpdateAccessRequest() {
  return useSWRMutation<
    AccessRequest,
    Error,
    string[],
    [number, updatableStatus]
  >(
    ['developer','requests'],
    async (_: unknown, { arg: [id, status] }) =>
      await updateAccessRequest(id, { status }),
  );


}
