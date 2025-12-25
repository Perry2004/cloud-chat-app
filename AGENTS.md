# Cloud Chat App — Agent Guide

This repo hosts a mono-repo chat application with microservice architecture. Use this guide to quickly orient and respond to requests.

## Project Structure

- The project is a mono-repo managed with pnpm and TurboRepo.
- The app is hosted on AWS ECS.
- The backend API is built with NestJS.
- The frontend UI is built with TanStack Start.
- Environment variables during development are managed with `.env` and `.env.dev` files in each package. They'll be loaded by `direnv` upon entering the directory.
- The `.env` contains env vars definitions with empty values. `.env.dev` contains actual values for local development.
- In production, environment variables are managed via AWS ECS and parameter store.
- `.github/workflows` contains CI/CD workflows for testing and deployment using Docker and Turborepo.

## Repo Layout

- `apps/api/account-service`: NestJS account/auth service
- `apps/ui`: TanStack Start frontend ui
- `packages/shared-schema`: Shared Zod schemas
- `packages/ts-config`: Base TS config package

## API Account Service (apps/api/account-service)

- A NestJS microservice for user accounts and authentication.
- Uses Auth0 for identity management.
- `src/main.ts`: Entry point
- `src/auth/`: auth modules
- The backend service uses a MongoDB Atlas cluster for data storage.
- Data storage using MongoDB and Prisma.

## UI (apps/ui)

- A TanStack Start SSR React UI.
- It is used soly for providing the frontend UI. All backend logic is handled by the API services.
- Styling: `src/styles/app.css` using Tailwind CSS v4.
- The app features dark/light mode theming.
- There should be no hardcoded colors in components; they should be pulled from the CSS file using Hero UI theme and cursom Tailwind utility classes and CSS variables.
- The `src/styles/app.css` should contain all theme and custom styles. Then they should be applied using Tailwind utility classes in the components.
- Component: [HeroUI v3](https://v3.heroui.com/llms.txt) and [shadcn/ui](https://ui.shadcn.com/llms.txt).
- Use library components from HeroUI and shadcn/ui whenever possible then apply custom configs/styles instead of creating custom components.
- All requests should be made with TanStack Query + Axios.
- In prod, the UI is served using Nitro server defined in `vite.config.ts`.
- `src/components/`: React UI components.
- `src/components/lib/`: shadcn/ui components.
- `src/routes/`: file-based routes.
- `src/pages/`: page components that are attached to routes.
- `src/layouts/`: layout components.
- `src/hooks/stores/`: Zustand stores.
- `src/hooks/mutations/`: TanStack Query mutations.
- `src/hooks/queries/`: TanStack Query queries.
- `src/routes/$.tsx`: catch-all route for 404 handling. This is required because Nitro will block any unmatched routes otherwise and make `notFoundComponent` not work.

## Shared Packages

- `packages/shared-schema/src/schema.ts`: zod schema definitions that are shared between frontend and backend
- `packages/ts-config/tsconfig.base.json`: base basic TS config for simple shared packages. Used only for editor support.

## How to Work as an Agent

- Prefer pnpm for installs and scripts; root is a pnpm workspace
- Respect existing configs (`turbo.json`, `tsconfig.base.json`) for builds
- Avoid destructive git commands; do not revert user changes
- When unsure about intent, ask clarifying questions before large edits
- Do not create unnecessary progress files; keep the repo clean
