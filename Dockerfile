FROM node:18.18.0-bullseye-slim AS base

ENV NODE_ENV=production

WORKDIR /code

FROM base as build

COPY --link package*.json ./

RUN npm install --production=false
# RUN npm ci && npm cache clean --force

COPY --link . .

RUN npm run build
RUN npm prune

FROM base
COPY --from=build /code/.output /code/.output

CMD [ "node", "./.output/server/index.mjs" ]
