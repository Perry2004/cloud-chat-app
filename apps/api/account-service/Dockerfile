FROM node:24 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm add -g turbo

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune account-service --docker

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .
RUN turbo build --filter=account-service

FROM base AS runner
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /app/apps/api/account-service/dist ./apps/api/account-service/dist
EXPOSE 6666
ENV NODE_ENV=production
ENV PORT=6666
CMD ["pnpm", "--filter", "account-service", "start:prod"]
