import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  devtools,
  combine,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type Theme = "light" | "dark" | "device";
export type ResolvedTheme = "light" | "dark";

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const resolveTheme = (theme: Theme): ResolvedTheme => {
  return theme === "device" ? getSystemTheme() : theme;
};

// Store for managing theme state
export const useTheme = create(
  devtools(
    persist(
      immer(
        combine(
          {
            theme: "device" as Theme,
            resolvedTheme: "light" as ResolvedTheme,
          },
          (set) => ({
            setTheme: (theme: Theme) => {
              set((state) => {
                state.theme = theme;
                state.resolvedTheme = resolveTheme(theme);
              });
            },
            toggleTheme: () => {
              set((state) => {
                const currentResolvedTheme = state.resolvedTheme;
                const newTheme =
                  currentResolvedTheme === "light" ? "dark" : "light";
                state.theme = newTheme;
                state.resolvedTheme = resolveTheme(newTheme);
              });
            },
          }),
        ),
      ),
      {
        name: "theme-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ theme: state.theme }),
        // Restore resolved theme after hydration
        onRehydrateStorage: () => (state) => {
          if (state && typeof window !== "undefined") {
            // Resolve the correct theme on the client side after hydration
            const resolvedTheme = resolveTheme(state.theme);

            // Defer to after hydration completion
            setTimeout(() => {
              useTheme.setState({ resolvedTheme });
            }, 0);

            const updateDeviceTheme = () => {
              if (useTheme.getState().theme === "device") {
                const newResolvedTheme = getSystemTheme();
                useTheme.setState({ resolvedTheme: newResolvedTheme });
              }
            };

            const mediaQuery = window.matchMedia(
              "(prefers-color-scheme: dark)",
            );
            mediaQuery.addEventListener("change", updateDeviceTheme);
          }
        },
      },
    ),
    { name: "theme-store" },
  ),
);
