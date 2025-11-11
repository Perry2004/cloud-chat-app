# Build stage
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY turbo.json ./

# Copy the service package.json
COPY apps/ui/package.json ./apps/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/ui ./apps/ui

# Build the application
RUN pnpm --filter ui build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/apps/ui/dist /usr/share/nginx/html

# Copy nginx configuration if needed
# COPY apps/ui/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
