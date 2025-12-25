import { Button, Card } from "@heroui/react";
import { Link } from "@heroui/react";

export function PageNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-(--new-accent)">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
          </div>

          <p className="text-default-500">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="inline-flex">
              <Button size="lg" className="w-full">
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
