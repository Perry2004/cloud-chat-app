import { Button, Card, Link } from "@heroui/react";
import { AlertCircle } from "lucide-react";

export function InternalError({ error }: { error?: any }) {
  const errorDetails = error?.stack || error?.message || String(error);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 text-center">
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

          <div className="space-y-2 text-left">
            <p className="text-sm font-semibold">Error Details</p>
            <div className="bg-default-100 border-danger/10 max-h-96 overflow-auto rounded-lg border p-4">
              {/* DEV ONLY CHANGE IN PROD */}
              {/* Bake the server-side error into a global variable that can be accessed on the client */}
              {typeof window === "undefined" && (
                <script
                  dangerouslySetInnerHTML={{
                    __html: `window.__SERVER_ERROR_DETAILS__ = ${JSON.stringify(errorDetails)};`,
                  }}
                />
              )}
              <pre
                className="text-danger font-mono text-xs break-all whitespace-pre-wrap"
                suppressHydrationWarning
              >
                {/* Prioritize the baked server error over the hydration prop */}
                {typeof window !== "undefined"
                  ? (window as any).__SERVER_ERROR_DETAILS__ || errorDetails
                  : errorDetails}
              </pre>
            </div>
          </div>

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
