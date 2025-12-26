import { AppHome } from "@/pages/app/AppHome";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/_app_layout/")({
  component: AppHome,
});
