import { getAxios } from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";

export function useResentVerificationEmail() {
  return useMutation({
    mutationFn: async () => {
      const api = getAxios();
      await api.get("/account/auth/resent-verification-email");
    },
  });
}
