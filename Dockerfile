FROM node:lts-alpine AS base
ENV NODE_ENV=production
ENV npm_config_registry=https://registry.npmmirror.com
ENV NODE_MIRROR=https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/
WORKDIR /app
RUN corepack install -g pnpm && \
    corepack enable
COPY common ./common

FROM base AS backend
ENV NODE_VERSION_FULL="node-v$NODE_VERSION"
ENV npm_config_tarball="/usr/local/$NODE_VERSION_FULL-headers.tar.gz"
RUN cd /usr/local && \
    mkdir "$NODE_VERSION_FULL" && \
    cp -r include "$NODE_VERSION_FULL"/ && \
    tar -zvcf "$npm_config_tarball" "$NODE_VERSION_FULL"
RUN sed -i 's#https\?://dl-cdn.alpinelinux.org/alpine#https://mirrors.tuna.tsinghua.edu.cn/alpine#g' /etc/apk/repositories && \
    apk add python3 make g++

COPY server-nodejs ./server-nodejs
RUN cd server-nodejs && \
    pnpm install && \
    pnpm build
RUN cd server-nodejs && \
    rm -rf node_modules && \
    pnpm install --prod

FROM base AS frontend
COPY web ./web
RUN cd web && \
    pnpm install && \
    pnpm build

FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=backend /app/server-nodejs/node_modules /app/node_modules
COPY --from=backend /app/server-nodejs/dist /app
COPY --from=frontend /app/web/dist /app/web

ENTRYPOINT ["node", "main.js"]
