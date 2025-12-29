import { Button, Card, Link } from "@heroui/react";
import { AlertCircle } from "lucide-react";

export function InternalError() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="bg-danger/10 rounded-full p-4">
              <AlertCircle className="text-danger h-12 w-12" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Something went wrong</h1>
            <h2 className="text-default-600 text-xl font-semibold">
              500 - Internal Server Error
            </h2>
          </div>

          <p className="text-default-500">
            We're sorry, but something went wrong on our end. Please try
            refreshing the page or come back later.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onPress={() => window.location.reload()}
            >
              Refresh Page
            </Button>
            <Link href="/" className="inline-flex">
              <Button variant="ghost" size="lg" className="w-full">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
