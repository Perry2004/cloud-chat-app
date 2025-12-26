import { AppLayout } from "@/layouts/AppLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/_app_layout")({
  component: AppLayout,
});
