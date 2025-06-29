# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock* ./ # Copy root package.json and yarn.lock
COPY apps/web/package.json apps/web/ # Copy web's package.json
COPY packages/ui/package.json packages/ui/ # Copy ui's package.json
# ... (copy other package.json files for monorepo)
RUN yarn install --immutable

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build the Next.js application
RUN yarn workspace @resumate-ai/web build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Uncomment the following line if you're using Prisma
# COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client

COPY --from=builder /app/apps/web/next.config.js ./
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Next.js production command (starts the server)
CMD ["yarn", "workspace", "@resumate-ai/web", "start"]
