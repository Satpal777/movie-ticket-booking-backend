FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable pnpm

# Copy package and lockfile to optimize cache
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy everything else and build the typescript project
COPY . .
RUN pnpm run build

# --- Production runner stage ---
FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable pnpm

# Install only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy built code from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 8000
ENV NODE_ENV=production

CMD ["pnpm", "start"]
