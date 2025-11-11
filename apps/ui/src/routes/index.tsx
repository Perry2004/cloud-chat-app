import { Alert } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello World!</h1>
      <div className="flex gap-x-4">
        <Alert>Test alert component</Alert>
      </div>
    </>
  );
}
