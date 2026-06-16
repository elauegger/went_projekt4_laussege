FROM node:24-alpine AS base

WORKDIR /app
RUN corepack enable

# ---------- deps ----------
FROM base AS deps

ENV PNPM_HOME=/pnpm
ENV PNPM_STORE_PATH=/pnpm-store
ENV PATH=$PNPM_HOME:$PATH
ENV CI=true

COPY package.json pnpm-lock.yaml .npmrc ./

RUN --mount=type=cache,target=/pnpm-store \
    pnpm install --frozen-lockfile --ignore-scripts

# ---------- build ----------
FROM base AS build

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV CI=true

ARG DATABASE_URL
ARG DIRECT_URL
ARG BETTER_AUTH_URL
ARG BETTER_AUTH_SECRET
ARG MICROSOFT_CLIENT_ID
ARG MICROSOFT_CLIENT_SECRET
ARG MICROSOFT_TENANT_ID

ENV DATABASE_URL=${DATABASE_URL}
ENV DIRECT_URL=${DIRECT_URL}
ENV BETTER_AUTH_URL=${BETTER_AUTH_URL}
ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
ENV MICROSOFT_CLIENT_ID=${MICROSOFT_CLIENT_ID}
ENV MICROSOFT_CLIENT_SECRET=${MICROSOFT_CLIENT_SECRET}
ENV MICROSOFT_TENANT_ID=${MICROSOFT_TENANT_ID}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npx next build

# ---------- runtime ----------
FROM base AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV CI=true

RUN addgroup -S app && adduser -S app -G app

RUN mkdir -p /app/uploads && \
    chown -R app:app /app/uploads

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/src/generated ./src/generated

USER app

EXPOSE 3000

CMD ["pnpm", "start"]