import { getAxios } from "@/utils/apiClient";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { profileDtoSchema } from "@repo/shared-schema/schema";

export const profileQueryOptions = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const api = getAxios();
    const response = await api.get("/account/auth/profile");
    return profileDtoSchema.parse(response.data);
  },
  staleTime: 15 * 60 * 1000, // 15 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes
  retry: false,
  refetchInterval: 20 * 60 * 1000, // 20 minutes
});

export function useProfile() {
  return useQuery(profileQueryOptions);
}
