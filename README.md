# Carsharing App

Веб-приложение для аренды автомобилей. Пользователь может просматривать каталог автомобилей, оформлять бронирование и управлять своими поездками; администратор управляет автопарком и бронированиями через панель администратора.

Проект построен на микросервисной архитектуре: backend разбит на независимые сервисы (identity, cars, booking), доступ к которым осуществляется через единый API Gateway.

## Технологический стек

### Backend

- **NestJS** (TypeScript) — фреймворк для всех сервисов
- **TypeORM** + **PostgreSQL** — работа с базой данных
- **JWT** (`@nestjs/jwt`, `@nestjs/passport`) — аутентификация и авторизация
- **class-validator / class-transformer** — валидация DTO
- **npm workspaces** — монорепозиторий сервисов с общей библиотекой `@carsharing/common`

Микросервисы:

| Сервис | Назначение | Порт |
|---|---|---|
| `api-gateway` | единая точка входа, маршрутизация запросов к сервисам | 3000 |
| `identity` | регистрация, аутентификация, пользователи | 3001 |
| `booking` | бронирование автомобилей | 3002 |
| `cars` | каталог и управление автомобилями | 3003 |
| `common` | общие утилиты и типы для сервисов | — |

### Frontend

- **Vue 3** + **TypeScript**
- **Vite** — сборка и dev-сервер
- **Pinia** — управление состоянием
- **Vue Router** — маршрутизация
- **Axios** — HTTP-клиент

### Инфраструктура

- **Docker / Docker Compose** — контейнеризация всех сервисов
- **PostgreSQL 17**
- **GitHub Actions** — CI/CD: сборка образов, публикация в GitHub Container Registry (GHCR) и автоматический деплой на сервер при пуше в `main`

## Развёртывание

### Требования

- Docker и Docker Compose
- Node.js >= 18 и npm >= 7 (для запуска без Docker)

### Локальный запуск (Docker)

```bash
git clone <repo-url>
cd carsharing-app

# создать .env-файлы на основе примеров
cp services/.env.example services/.env
cp client/.env.example client/.env

# собрать и запустить все сервисы
docker compose up -d --build
```

После запуска:
- Клиент — http://localhost:5173 (или порт, указанный в конфигурации)
- API Gateway — http://localhost:3000
- PostgreSQL — localhost:5433


### Продакшн

Продакшн-конфигурация (`docker-compose.prod.yaml`) использует готовые образы из GHCR вместо локальной сборки:

```bash
docker login ghcr.io -u <username>
docker compose -f docker-compose.prod.yaml pull
docker compose -f docker-compose.prod.yaml up -d
```

Деплой на сервер выполняется автоматически через GitHub Actions (`.github/workflows/ci.yml`) при пуше в ветку `main`: образы собираются, публикуются в GHCR, после чего по SSH обновляются на VDS.

## Прод

Приложение развёрнуто на VDS: [http://161.104.32.15](http://161.104.32.15)
