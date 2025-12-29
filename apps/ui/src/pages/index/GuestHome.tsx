import { validatedEnv } from "@/utils/validateEnvVars";
import { Button, Card } from "@heroui/react";
import { Cloud, Lock, MessageCircle, Zap } from "lucide-react";
import { ReactNode } from "react";

const features: Array<{
  title: string;
  description: string;
  icon: ReactNode;
}> = [
  {
    title: "Realtime Messaging",
    description:
      "Smooth conversations powered by TanStack Start and efficient APIs.",
    icon: <MessageCircle />,
  },
  {
    title: "Auth0 Secure Auth",
    description: "Safe login with refresh support built-in.",
    icon: <Lock />,
  },
  {
    title: "Cloud Hosted",
    description: "Runs on AWS ECS for scalable, resilient delivery.",
    icon: <Cloud />,
  },
  {
    title: "Performance First",
    description: "SSR with Nitro and caching for snappy page loads.",
    icon: <Zap />,
  },
];

export function GuestHome() {
  const authBase = `${validatedEnv.VITE_API_BASE_URL}/account/auth`;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
      <div className="grid gap-10">
        <Card className="border shadow-sm">
          <div className="flex flex-col items-center gap-6 py-10 text-center">
            <div className="bg-accent/70 text-accent-foreground inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              Cloud-native chat
              <span className="bg-accent size-2 rounded-full" aria-hidden />
            </div>
            <div className="grid gap-3">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Fast, Secure, Cloud-Native Chat
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                Built with HeroUI, shadcn/ui, and a NestJS backend. Your
                messages delivered instantly and safely.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href={`${authBase}/login`}>
                <Button size="lg">Log In</Button>
              </a>
              <a href={`${authBase}/register`}>
                <Button size="lg">Register</Button>
              </a>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="h-full border shadow-sm">
              <div className="flex items-start gap-3 p-5">
                <div className="bg-accent/60 text-accent-foreground grid size-10 place-items-center rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
