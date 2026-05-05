FROM node:24-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
RUN corepack enable
ENV PNPM_HOME=/pnpm
ENV PNPM_STORE_PATH=/pnpm-store
ENV PATH=$PNPM_HOME:$PATH

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/pnpm-store pnpm install --frozen-lockfile

# ---------- build ----------
FROM base AS build
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Accept build args from docker-compose
ARG DIRECT_URL
ARG BETTER_AUTH_URL
ARG BETTER_AUTH_SECRET
ARG MICROSOFT_CLIENT_ID
ARG MICROSOFT_CLIENT_SECRET
ARG MICROSOFT_TENANT_ID

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma client generate + Next build
ENV DIRECT_URL=${DIRECT_URL}
ENV BETTER_AUTH_URL=${BETTER_AUTH_URL}
ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
ENV MICROSOFT_CLIENT_ID=${MICROSOFT_CLIENT_ID}
ENV MICROSOFT_CLIENT_SECRET=${MICROSOFT_CLIENT_SECRET}
ENV MICROSOFT_TENANT_ID=${MICROSOFT_TENANT_ID}
RUN npx prisma generate
RUN pnpm build

# ---------- runtime ----------
FROM base AS runtime
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S app && adduser -S app -G app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/prisma ./prisma
COPY --from=build --chown=app:app /app/prisma.config.ts ./prisma.config.ts

USER app

EXPOSE 3000
CMD ["pnpm", "start"]