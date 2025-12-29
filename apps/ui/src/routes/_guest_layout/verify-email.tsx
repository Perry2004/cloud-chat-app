import { verifyEmailStatusQueryOptions } from "@/hooks/queries/useVerifyEmailStatus";
import { VerifyEmailPage } from "@/pages/verify-email/VerifyEmailPage";
import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest_layout/verify-email")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(verifyEmailStatusQueryOptions);
      const verifyEmailStatusQuery = context.queryClient.getQueryData(
        verifyEmailStatusQueryOptions.queryKey,
      );
      console.log("verifyEmailStatusQuery", verifyEmailStatusQuery);
      if (verifyEmailStatusQuery?.email_verified) {
        throw redirect({ to: "/app" });
      }
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
    }
  },
  component: VerifyEmailPage,
});
