FROM node:22-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
COPY discord/ ./discord/
COPY common/ ./common/

FROM base AS builder

RUN npm install --workspace=discord
RUN npm run build:bot

FROM base AS installer
WORKDIR /app

RUN npm install --workspace=discord --omit=dev

FROM node:22-alpine AS runner
LABEL org.opencontainers.image.source=https://github.com/Olyxz16/furby
WORKDIR /app

COPY --from=installer --chown=node:node /app/node_modules node_modules
COPY --from=builder --chown=node:node /app/discord/dist/bot.js index.js

USER node:node

ENTRYPOINT [ "node", "index" ]
