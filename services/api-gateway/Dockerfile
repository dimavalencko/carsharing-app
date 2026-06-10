FROM node:18-alpine AS builder

WORKDIR /app

# Workspace root files (lockfile lives here)
COPY package.json package-lock.json ./

# Copy only package manifests first for better layer caching
COPY common/package.json ./common/package.json
COPY identity/package.json ./identity/package.json
COPY api-gateway/package.json ./api-gateway/package.json
COPY cars/package.json ./cars/package.json

RUN npm ci

# Copy full source after deps install
COPY common/ ./common/
COPY api-gateway/ ./api-gateway/

# Build @carsharing/common first — api-gateway depends on its dist
RUN npm run build --workspace=@carsharing/common

# Build api-gateway
RUN npm run build --workspace=api-gateway

FROM node:18-alpine AS production

WORKDIR /app

COPY package.json package-lock.json ./
COPY common/package.json ./common/package.json
COPY identity/package.json ./identity/package.json
COPY api-gateway/package.json ./api-gateway/package.json
COPY cars/package.json ./cars/package.json

RUN npm ci --omit=dev

COPY --from=builder /app/common/dist ./common/dist
COPY --from=builder /app/api-gateway/dist ./api-gateway/dist

WORKDIR /app/api-gateway

EXPOSE 3000

CMD ["node", "dist/main"]
