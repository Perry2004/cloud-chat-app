import { useProfile } from "@/hooks/stores/useProfile";
import { GuestLayout } from "@/layouts/GuestLayout";
import { UserLayout } from "@/layouts/UserLayout";
import { Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

export default function RootLayout() {
  const isLoggedIn = useProfile((state) => state.isLoggedIn);
  const setIsLoggedIn = useProfile((state) => state.setIsLoggedIn);

  // DEBUG simulate login state
  useEffect(() => {
    setIsLoggedIn(false);
    setTimeout(() => {
      setIsLoggedIn(true);
      console.log("Setting isLoggedIn to true");
    }, 5000);
  }, [setIsLoggedIn]);

  return isLoggedIn ? (
    <UserLayout>
      <Outlet />
    </UserLayout>
  ) : (
    <GuestLayout>
      <Outlet />
    </GuestLayout>
  );
}
