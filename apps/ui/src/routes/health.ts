import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

// Health check endpoint
export const Route = createFileRoute("/health")({
  server: {
    handlers: {
      GET: async () => {
        return json({
          service: "ui",
          status: "ok",
        });
      },
    },
  },
});
