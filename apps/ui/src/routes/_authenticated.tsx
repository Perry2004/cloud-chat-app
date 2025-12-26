import { profileQueryOptions } from "@/hooks/queries/useProfile";
import {
  createFileRoute,
  Outlet,
  redirect,
  isRedirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(profileQueryOptions);
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
      throw redirect({
        to: "/",
      });
    }
  },
  component: () => <Outlet />,
});
