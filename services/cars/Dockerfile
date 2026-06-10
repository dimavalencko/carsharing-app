FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY common/package.json ./common/package.json
COPY api-gateway/package.json ./api-gateway/package.json
COPY identity/package.json ./identity/package.json
COPY cars/package.json ./cars/package.json

RUN npm ci

COPY common/ ./common/
COPY cars/ ./cars/

RUN npm run build --workspace=@carsharing/common
RUN npm run build --workspace=cars

FROM node:20-alpine AS production

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

COPY package.json package-lock.json ./
COPY common/package.json ./common/package.json
COPY api-gateway/package.json ./api-gateway/package.json
COPY identity/package.json ./identity/package.json
COPY cars/package.json ./cars/package.json

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=nestjs:nodejs /app/cars/dist ./cars/dist

RUN chown -R nestjs:nodejs /app

USER nestjs

WORKDIR /app/cars

EXPOSE 3003

CMD ["node", "dist/main"]
