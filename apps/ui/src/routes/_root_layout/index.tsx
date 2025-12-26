import { Index } from "@/pages/index/Index";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_root_layout/")({
  component: Index,
});
