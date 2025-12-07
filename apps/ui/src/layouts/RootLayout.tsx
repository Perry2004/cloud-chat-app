import { MenuBar } from "@/components/menu/ManuBar";
import { useTheme } from "@/hooks/stores/useTheme";
import { Outlet } from "@tanstack/react-router";

// Root layout component that wraps all pages
export default function RootLayout() {
  const resolvedTheme = useTheme((state) => state.resolvedTheme);
  return (
    <div
      className={
        resolvedTheme +
        " bg-background flex min-h-screen flex-col justify-between"
      }
    >
      <header>
        <MenuBar />
      </header>
      <main className="flex flex-1">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
      <footer>Global Footer</footer>
    </div>
  );
}
