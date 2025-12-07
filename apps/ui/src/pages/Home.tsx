import { Button } from "@heroui/react";

export function Home() {
  return (
    <div className="flex h-full flex-wrap items-center justify-center gap-3">
      Cloud Chat App
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
