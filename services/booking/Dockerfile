FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY common/package.json ./common/package.json
COPY api-gateway/package.json ./api-gateway/package.json
COPY identity/package.json ./identity/package.json
COPY cars/package.json ./cars/package.json
COPY booking/package.json ./booking/package.json

RUN npm ci

COPY common/ ./common/
COPY booking/ ./booking/

RUN npm run build --workspace=@carsharing/common
RUN npm run build --workspace=booking

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
COPY booking/package.json ./booking/package.json

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=nestjs:nodejs /app/common/dist ./common/dist
COPY --from=builder --chown=nestjs:nodejs /app/booking/dist ./booking/dist

RUN chown -R nestjs:nodejs /app

USER nestjs

WORKDIR /app/booking

EXPOSE 3002

CMD ["node", "dist/main"]
