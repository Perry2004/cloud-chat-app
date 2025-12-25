import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useProfile = create(
  devtools(
    persist(
      immer(
        combine(
          {
            loggedInEmail: "abcd",
          },
          (set) => ({
            setLoggedInEmail: (email: string) => {
              set((state) => {
                state.loggedInEmail = email;
              });
            },
          }),
        ),
      ),
      {
        name: "profile-storage",
      },
    ),
    {
      name: "profile-store",
    },
  ),
);
