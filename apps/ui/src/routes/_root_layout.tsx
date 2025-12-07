import { createFileRoute } from "@tanstack/react-router";
import RootLayout from "@/layouts/RootLayout";

// apply RootLayout to all app routes
export const Route = createFileRoute("/_root_layout")({
  component: RootLayout,
});
