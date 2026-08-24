"use client";

import type { AccessRequest, updatableStatus } from "@/types/resource";
import { updateAccessRequest } from "@/modules/resources/application/use-cases/update-access-requests";
import useSWRMutation from "swr/mutation";
import { useCallback } from "react";
import { mutate } from "swr";
import { useToast } from "@/shared/ui/Toast";

export function useUpdateAccessRequest() {
  const { trigger, isMutating } = useSWRMutation<
    AccessRequest,
    Error,
    string,
    [number, updatableStatus]
  >(
    "/api/developer/access-requests" ,
    async (_: unknown, { arg: [id, status] }) =>
      await updateAccessRequest(id, { status }),
  );

  const { toast } = useToast();

  const handleApprove = useCallback(async (id: number) => {
  toast(`Approving the access request...`, "info");
  await trigger([id, "approved"], {
      onSuccess: (updatedRequest) => {
        toast(
          `The access request for ${updatedRequest.resource_name} has been approved.`,
          "success",
        );
      },
      onError: (error) => {
        toast(
          `Unable to approve the access request. ${error.message}`,
          "error",
        );
      },
    });
  }, []);

  const handleDeny = useCallback(async (id: number) => {
    toast(`Denying the access request...`, "info");

    await trigger([id, "denied"], {
      onSuccess: (updatedRequest) => {
        toast(
          `The access request for ${updatedRequest.resource_name} has been denied.`,
          "success",
        );
      },
      onError: (error) => {
        toast(`Unable to deny the access request. ${error.message}`, "error");
      },
    });
  }, []);

  return { handleApprove, handleDeny, mutate, isMutating };
}
