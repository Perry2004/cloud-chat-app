import { getAxios } from "@/utils/apiClient";
import { verifyEmailStatusDtoSchema } from "@repo/shared-schema/schema";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const verifyEmailStatusQueryOptions = queryOptions({
  queryKey: ["verify-email-status"],
  queryFn: async () => {
    const api = getAxios();
    const response = await api.get("/account/auth/verify-email-status");
    return verifyEmailStatusDtoSchema.parse(response.data);
  },
  retry: false,
});

export function useVerifyEmailStatus() {
  return useQuery(verifyEmailStatusQueryOptions);
}
