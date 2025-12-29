import { profileQueryOptions } from "@/hooks/queries/useProfile";
import { GuestLayout } from "@/layouts/GuestLayout";
import { createFileRoute, redirect, isRedirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest_layout")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(profileQueryOptions);
    } catch {
      // fine if profile fetch fails
    }
  },
  component: GuestLayout,
});
