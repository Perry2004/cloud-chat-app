import { ReactNode } from "react";
import { ThemeSelection } from "@/components/theme/ThemeSelection";

export function GuestLayout({ children }: { children: ReactNode }) {
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
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t">
        <div className="text-muted-foreground mx-auto w-full max-w-6xl px-6 py-8 text-center text-sm">
          © {new Date().getFullYear()} Cloud Chat. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
