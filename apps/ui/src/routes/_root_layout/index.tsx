import { Home } from "@/pages/Home";
import { createFileRoute } from "@tanstack/react-router";

// app index route
export const Route = createFileRoute("/_root_layout/")({
  component: Home,
});
