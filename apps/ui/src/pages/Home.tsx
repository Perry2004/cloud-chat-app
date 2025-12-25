import { ThemeSelection } from "@/components/theme/ThemeSelection";
import { useProfile } from "@/hooks/stores/useProfile";
import { Button, Link } from "@heroui/react";

export function Home() {
  const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const auth0CallbackUrl = import.meta.env.VITE_AUTH0_CALLBACK_URL;

  console.log("Auth0 Domain:", auth0Domain);
  console.log("Auth0 Client ID:", auth0ClientId);
  console.log("Auth0 Callback URL:", auth0CallbackUrl);
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
      <Link href={`localhost:8666/api/v2/account/login`}>Login</Link>
      <Link
        href={`https://${auth0Domain}/v2/logout?client_id=${auth0ClientId}&returnTo=http://localhost:1688/`}
      >
        Logout
      </Link>
      <ThemeSelection />
    </div>
  );
}
