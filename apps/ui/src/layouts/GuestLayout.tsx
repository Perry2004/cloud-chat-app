import { ReactNode } from "react";
import { ThemeSelection } from "@/components/theme/ThemeSelection";
import { Outlet } from "@tanstack/react-router";
import { useProfile } from "@/hooks/queries/useProfile";
import { Link } from "@heroui/react";

export function GuestLayout() {
  const profile = useProfile();
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="bg-primary size-2 rounded-full" aria-hidden />
            <span className="text-lg font-semibold tracking-tight sm:text-xl">
              Cloud Chat
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSelection />
          </div>
          {profile.data?.email ? (
            <Link href="/app">{profile.data.email}</Link>
          ) : (
            <Link href="http://localhost:8666/api/v1/account/auth/login">
              Login
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="text-muted-foreground mx-auto w-full max-w-6xl px-6 py-8 text-center text-sm">
          © {new Date().getFullYear()} Cloud Chat. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
