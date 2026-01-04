import { Button, Card, Link } from "@heroui/react";
import { ShieldAlert } from "lucide-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getAxios } from "@/utils/apiClient";

export function Unauthenticated() {
  const queryClient = useQueryClient();

  // clear cookies on unauthenticated page load for cases like broken tokens
  useEffect(() => {
    (async () => {
      await getAxios().get("/account/auth/clear-cookies");
      console.log("Cleared cookies due to unauthenticated error.");
    })();
    queryClient.clear();
  }, [queryClient]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="bg-danger/10 rounded-full p-4">
              <ShieldAlert className="text-danger h-12 w-12" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Unauthorized</h1>
            <h2 className="text-default-600 text-xl font-semibold">
              401 - Unauthorized
            </h2>
          </div>

          <p className="text-default-500">
            You are not authorized to view this page. Please log in or contact
            your administrator if you believe this is an error.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="inline-flex">
              <Button variant="primary" size="lg" className="w-full">
                Go Home
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onPress={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
