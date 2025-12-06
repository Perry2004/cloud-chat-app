import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "@heroui/react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-wrap gap-3" data-theme="light">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="danger-soft">Danger Soft</Button>
      <div className="text-(--new-accent)">Hello</div>
    </div>
  );
}
