import { Link, redirect, useNavigate } from "@tanstack/react-router";
import { Button, Card, Link as HeroLink, Alert, Spinner } from "@heroui/react";
import {
  Mail,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useResentVerificationEmail } from "@/hooks/mutations/useResentVerificationEmail";
import { queryOptions, useQueryClient } from "@tanstack/react-query";
import {
  useVerifyEmailStatus,
  verifyEmailStatusQueryOptions,
} from "@/hooks/queries/useVerifyEmailStatus";
import { UnauthenticatedError } from "@/utils/errors";
import { useState, useEffect } from "react";

export function VerifyEmailPage() {
  const resendVerificationEmailMutation = useResentVerificationEmail();
  const verifyEmailStatusQuery = useVerifyEmailStatus();
  const navigate = useNavigate();
  const [verificationCheckStatus, setVerificationCheckStatus] = useState<
    "idle" | "success" | "fail"
  >("idle");

  useEffect(() => {
    if (
      verifyEmailStatusQuery.data?.email_verified &&
      verificationCheckStatus !== "success"
    ) {
      navigate({ to: "/app" });
    }
  }, [
    verifyEmailStatusQuery.data?.email_verified,
    navigate,
    verificationCheckStatus,
  ]);

  if (verifyEmailStatusQuery.isLoading) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground animate-pulse text-sm font-medium">
          Checking verification status...
        </p>
      </div>
    );
  }

  if (verifyEmailStatusQuery.isError) {
    throw new UnauthenticatedError();
  }

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 shadow-lg" variant="secondary">
        <div className="flex flex-col items-center gap-8">
          {/* Icon Header */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-accent/10 text-accent flex h-20 w-20 items-center justify-center rounded-full">
              <Mail className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Check your email
            </h1>
            <p className="text-muted-foreground text-center">
              We've sent a verification link to your email address. Please click
              the link to verify your account.
            </p>
          </div>

          {/* Feedback UI */}
          {resendVerificationEmailMutation.isSuccess && (
            <Alert status="success">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Verification Email Sent</Alert.Title>
                <Alert.Description>
                  We've re-sent the verification email. Please check your inbox.
                </Alert.Description>
              </Alert.Content>
            </Alert>
          )}

          {resendVerificationEmailMutation.isError && (
            <Alert color="danger">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="h-4 w-4" />
                  Failed to send email
                </div>
                <p className="text-sm">
                  {resendVerificationEmailMutation.error instanceof Error
                    ? resendVerificationEmailMutation.error.message
                    : "Something went wrong. Please try again later."}
                </p>
              </div>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex w-full flex-col gap-4">
            {verificationCheckStatus === "success" && (
              <Alert color="success">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    Email Verified!
                  </div>
                  <p className="text-sm">
                    Your email has been successfully verified. Redirecting you
                    to the app...
                  </p>
                </div>
              </Alert>
            )}

            {verificationCheckStatus === "fail" && (
              <Alert color="danger">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="h-4 w-4" />
                    Not verified yet
                  </div>
                  <p className="text-sm">
                    We couldn't verify your email status. Please make sure
                    you've clicked the link in the email we sent you.
                  </p>
                </div>
              </Alert>
            )}

            <Button
              variant="primary"
              size="lg"
              className="w-full font-semibold"
              isDisabled={verifyEmailStatusQuery.isFetching}
              onPress={async () => {
                setVerificationCheckStatus("idle");
                resendVerificationEmailMutation.reset();
                const { data } = await verifyEmailStatusQuery.refetch();
                if (data?.email_verified) {
                  setVerificationCheckStatus("success");
                  setTimeout(() => {
                    navigate({ to: "/app" });
                  }, 1500);
                } else {
                  setVerificationCheckStatus("fail");
                }
              }}
            >
              {verifyEmailStatusQuery.isFetching ? (
                <Spinner size="sm" color="current" />
              ) : (
                <>
                  I've verified my email
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <Button
              variant="tertiary"
              size="lg"
              className="w-full"
              onPress={() => {
                setVerificationCheckStatus("idle");
                resendVerificationEmailMutation.mutate();
              }}
              isDisabled={resendVerificationEmailMutation.isPending}
            >
              {resendVerificationEmailMutation.isPending ? (
                <Spinner size="sm" color="current" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Resend verification email
            </Button>
          </div>

          {/* Footer Info */}
          <div className="flex flex-col gap-4 pt-4">
            <p className="text-muted-foreground text-center text-sm">
              Can't find the email? Check your spam folder or make sure you
              entered the correct address.
            </p>

            <div className="flex items-center justify-center gap-4 text-sm">
              <Link to="/" className="text-primary font-medium hover:underline">
                Back to login
              </Link>
              <span className="text-muted-foreground">•</span>
              <HeroLink className="text-primary cursor-pointer font-medium hover:underline">
                Contact support
              </HeroLink>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
