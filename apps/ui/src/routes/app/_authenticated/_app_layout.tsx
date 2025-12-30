import { AppLayout } from "@/layouts/AppLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_authenticated/_app_layout")({
  component: AppLayout,
});
