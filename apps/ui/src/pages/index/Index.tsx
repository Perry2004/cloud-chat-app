import { useProfile } from "@/hooks/stores/useProfile";
import { UserHome } from "./UserHome";
import { GuestHome } from "./GuestHome";

export function Index() {
  const isLoggedIn = useProfile((state) => state.isLoggedIn);
  return isLoggedIn ? <UserHome /> : <GuestHome />;
}
