FROM node:20-alpine AS builder

WORKDIR /app

# Workspace root files (lockfile lives here)
COPY package.json package-lock.json ./

# Copy only package manifests first for better layer caching
COPY common/package.json ./common/package.json
COPY api-gateway/package.json ./api-gateway/package.json
COPY identity/package.json ./identity/package.json
COPY cars/package.json ./cars/package.json
COPY booking/package.json ./booking/package.json

RUN npm ci

# Copy full source after deps install
COPY common/ ./common/
COPY identity/ ./identity/

# Build @carsharing/common first — identity depends on its dist
RUN npm run build --workspace=@carsharing/common

RUN npm run build --workspace=identity

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
COPY --from=builder --chown=nestjs:nodejs /app/identity/dist ./identity/dist

RUN chown -R nestjs:nodejs /app

USER nestjs

WORKDIR /app/identity

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD node -e "try{require('net').createConnection({host:'127.0.0.1',port:3001}).on('error',()=>process.exit(1)).on('connect',function(){this.end();});}catch(e){process.exit(1)}" || exit 1

CMD ["node", "dist/src/main"]
