FROM node AS base
ENV NODE_ENV=production
WORKDIR /app
RUN npm install -g pnpm
COPY common ./common

FROM base AS backend
COPY server-nodejs ./server-nodejs
RUN cd server-nodejs && \
    pnpm install && \
    pnpm build

FROM base AS frontend
COPY web ./web
RUN cd web && \
    pnpm install && \
    pnpm build

FROM node
WORKDIR /app
ENV NODE_ENV=production
COPY --from=backend /app/server-nodejs/node_modules /app/node_modules
COPY --from=backend /app/server-nodejs/dist /app
COPY --from=frontend /app/web/dist /app/web

ENTRYPOINT ["node", "main.js"]
