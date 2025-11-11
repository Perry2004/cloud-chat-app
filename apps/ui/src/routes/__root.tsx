import { StrictMode, type ReactNode } from "react";
import appCss from "../styles/index.css?url";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Simple Chat App",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  context: () => ({
    queryClient,
  }),
});

function RootComponent() {
  const router = useRouter();

  return (
    <RootDocument>
      <HeroUIProvider
        navigate={(to, options) => router.navigate({ to, ...(options || {}) })}
        useHref={(to) => router.buildLocation({ to }).href}
      >
        <QueryClientProvider client={queryClient}>
          <StrictMode>
            <Outlet />
          </StrictMode>
          <TanStackRouterDevtools />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </HeroUIProvider>
    </RootDocument>
  );
}
function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
