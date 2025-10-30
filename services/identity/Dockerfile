# Базовый образ для сборки
FROM node:20-alpine AS builder

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
FROM node:20-alpine AS production

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD node -e "try{require('net').createConnection({host:'127.0.0.1',port:3001}).on('error',()=>process.exit(1)).on('connect',function(){this.end();});}catch(e){process.exit(1)}" || exit 1

CMD ["node", "dist/main"]