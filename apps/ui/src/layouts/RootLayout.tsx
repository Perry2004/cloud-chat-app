import { useTheme } from "@/hooks/stores/useTheme";
import { Outlet } from "@tanstack/react-router";

// Root layout component that wraps all pages
export default function RootLayout() {
  const resolvedTheme = useTheme((state) => state.resolvedTheme);
  return (
    // <div
    //   className={`${resolvedTheme} flex min-h-screen flex-col items-center justify-center`}
    // >
    //   <AppSidebar />
    //   <main>
    //     <Outlet />
    //   </main>
    //   <footer>Global Footer</footer>
    // </div>
    <div
      className={`${resolvedTheme} flex min-h-screen flex-col items-center justify-center`}
    >
      <Outlet />
    </div>
  );
}
