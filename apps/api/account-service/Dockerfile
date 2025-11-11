# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY turbo.json ./

# Copy the service package.json
COPY apps/api/account-service/package.json ./apps/api/account-service/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/api/account-service ./apps/api/account-service

# Build the application
RUN pnpm --filter account-service build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy built application
COPY --from=builder /app/apps/api/account-service/dist ./dist
COPY --from=builder /app/apps/api/account-service/package.json ./

# Install only production dependencies
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate && \
    pnpm install --prod --frozen-lockfile && \
    pnpm store prune

EXPOSE 3000

CMD ["node", "dist/main.js"]
