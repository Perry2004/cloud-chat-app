# Cloud Chat App

A Turbo repo monorepo chat application with microservice architecture, built with NestJS and TanStack Start.

## Features

- **Backend**: NestJS microservice for user accounts and authentication using Auth0
- **Frontend**: TanStack Start SSR React UI with HeroUI and shadcn/ui components
- **Database**: MongoDB with Prisma ORM
- **Styling**: Tailwind CSS v4 with dark/light theme support
- **Deployment**: AWS ECS

## Project Structure

- `apps/api/account-service`: NestJS account/auth service
- `apps/ui`: TanStack Start frontend UI
- `packages/shared-schema`: Shared Zod schemas
- `packages/ts-config`: Base TypeScript config

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up environment variables:
   - Copy `.env` files and fill in `.env.dev` with local values
   - Use `direnv` for automatic loading

3. Start development:

   ```bash
   # run on root directory
   pnpm dev
   ```

## Deployment

- CI/CD via GitHub workflows
- Docker containers for services
- AWS terraform IaC in separate repo
