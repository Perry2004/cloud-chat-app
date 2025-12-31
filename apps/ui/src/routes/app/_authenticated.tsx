import { profileQueryOptions } from "@/hooks/queries/useProfile";
import { verifyEmailStatusQueryOptions } from "@/hooks/queries/useVerifyEmailStatus";
import { UnauthenticatedError } from "@/utils/errors";
import {
  createFileRoute,
  Outlet,
  redirect,
  isRedirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/app/_authenticated")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(profileQueryOptions);
      await context.queryClient.ensureQueryData(verifyEmailStatusQueryOptions);
      if (
        !context.queryClient.getQueryData(
          verifyEmailStatusQueryOptions.queryKey,
        )?.email_verified
      ) {
        throw redirect({ to: "/verify-email" });
      }
    } catch (error) {
      console.error(error);
      if (isRedirect(error)) {
        console.log("Re-throwing redirection");
        throw error;
      } else {
        console.log("Throwing unauthenticated error from _authenticated");
        throw new UnauthenticatedError();
      }
    }
  },
  component: () => <Outlet />,
});
