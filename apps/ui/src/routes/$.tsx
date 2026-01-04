import { createFileRoute } from "@tanstack/react-router";
import { PageNotFound } from "@/pages/errors/PageNotFound";

// catch all unknown routes with 404
export const Route = createFileRoute("/$")({
  component: PageNotFound,
});
