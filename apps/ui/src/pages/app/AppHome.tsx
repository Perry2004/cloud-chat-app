import { ThemeSelection } from "@/components/theme/ThemeSelection";
import { useProfile } from "@/hooks/queries/useProfile";
import { Button, Link } from "@heroui/react";

export function AppHome() {
  const profileQuery = useProfile();

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
      <Link href={`http://localhost:8666/api/v1/account/auth/login`}>
        Login
      </Link>
      <Link href={`http://localhost:8666/api/v1/account/auth/logout`}>
        Logout
      </Link>
      <pre>{profileQuery.data?.email}</pre>
      <ThemeSelection />
    </div>
  );
}
