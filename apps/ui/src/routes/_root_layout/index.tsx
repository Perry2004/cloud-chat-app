import Page from "@/components/menu/Page";
import { Home } from "@/pages/Home";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_root_layout/")({
  component: Page,
});
