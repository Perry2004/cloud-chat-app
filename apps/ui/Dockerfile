FROM node:24 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm add -g turbo

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune ui --docker
ENTRYPOINT [ "/bin/bash" ]

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .
RUN turbo build --filter=ui

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/apps/ui/.output ./apps/ui/.output
COPY --from=builder /app/apps/ui/package.json ./apps/ui/package.json
COPY --from=builder /app/package.json ./package.json
EXPOSE 1688
ENV NODE_ENV=production
ENV NITRO_PORT=1688
ENV NITRO_HOST=0.0.0.0
CMD ["pnpm", "--filter", "ui", "start"]
