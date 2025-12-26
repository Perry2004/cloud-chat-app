import { GuestHome } from "@/pages/index/GuestHome";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest_layout/")({
  component: GuestHome,
});
