FROM node:22.9.0 AS base
RUN apt update
WORKDIR /app

FROM base AS turbo
RUN npm install --global turbo@2.3.3
RUN turbo telemetry disable
COPY . .
RUN turbo prune @d1stack/database --docker

FROM base AS build
COPY --from=turbo /app/out/json/ .
RUN npm install
COPY --from=turbo /app/out/full/ .
RUN npm run build
