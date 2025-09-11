# Базовый образ для сборки
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package файлы для кэширования зависимостей
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

# Устанавливаем зависимости включая devDependencies для сборки
RUN npm ci --include=dev

# Копируем исходный код
COPY src/ ./src/

# Собираем приложение
RUN npm run build

# Production образ
FROM node:18-alpine AS production

WORKDIR /app

ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

COPY .env ./

RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3001 3002

CMD ["node", "dist/main"]