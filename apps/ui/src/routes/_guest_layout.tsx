import { profileQueryOptions } from "@/hooks/queries/useProfile";
import { GuestLayout } from "@/layouts/GuestLayout";
import { createFileRoute, redirect, isRedirect } from "@tanstack/react-router";
import { isAxiosError } from "axios";

export const Route = createFileRoute("/_guest_layout")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(profileQueryOptions);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
      } else {
        throw error;
      }
    }
  },
  component: GuestLayout,
});
