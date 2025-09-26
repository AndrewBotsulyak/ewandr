# EwandrWorkspace

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

## Структура проекта

Данный проект представляет собой монорепозиторий, построенный на базе **Nx 21.5.3** и использующий микросервисную архитектуру. Проект состоит из следующих основных компонентов:

### Backend (Backend Services)
- **be-vendure** - Основной backend сервис на базе [Vendure](https://www.vendure.io/) (Node.js/NestJS)
  - Порт: 3000 (API), 3002 (Admin UI)
  - Использует PostgreSQL как основную базу данных
  - Включает GraphQL API, Admin UI, и систему управления товарами
  - Поддерживает миграции базы данных

- **be-vendure-worker** - Worker процесс для обработки фоновых задач
  - Порт: 3001
  - Обрабатывает асинхронные задачи (отправка email, обработка заказов и т.д.)

### Frontend (Client Applications)
Frontend построен на **Angular 20** с использованием **Module Federation** для микросервисной архитектуры:

- **client-shell** - Главное приложение (Host)
  - Порт: 4200
  - Служит точкой входа и оркестратором для всех микросервисов
  - Использует Module Federation для загрузки remote приложений
  - Поддерживает SSR (Server-Side Rendering)

- **client_products** - Микросервис каталога товаров (Remote)
  - Порт: 4201
  - Отвечает за отображение каталога товаров
  - Экспортирует маршруты через Module Federation

- **client_product_details** - Микросервис деталей товара (Remote)
  - Порт: 4202
  - Отвечает за отображение детальной информации о товарах
  - Экспортирует маршруты через Module Federation

### Infrastructure
- **nginx** - Reverse proxy и статический файловый сервер
  - Порт: 80
  - Проксирует запросы к backend сервисам
  - Обслуживает статические файлы
  - Поддерживает WebSocket для HMR (Hot Module Replacement)

- **postgres-vendure** - База данных PostgreSQL
  - Порт: 5432
  - Основная база данных для Vendure
  - Поддерживает health checks

### Shared Libraries
- **core** - Общие утилиты и функции
- **client-core** - Общие компоненты для клиентских приложений
- **data-access-graphql** - GraphQL клиент и операции
- **ngrx-store** - Управление состоянием (NgRx)
- **ui-shared-lib** - Общие UI компоненты

## Локальная разработка

### Предварительные требования
- Node.js (версия 18+)
- Docker и Docker Compose
- npm

### Архитектура запуска
Для локальной разработки используется гибридный подход:
- **Backend сервисы** (be-vendure, be-vendure-worker, postgres-vendure, nginx) запускаются в Docker
- **Frontend приложения** запускаются локально через npm для лучшей производительности разработки

## Команды Docker и Docker Compose

### Основные команды

```bash
# Запуск всех backend сервисов
npm run start:be-all

# Запуск отдельных сервисов
npm run start:nginx      # Запуск nginx
npm run start:db         # Запуск PostgreSQL
npm run start:vendure    # Запуск be-vendure
npm run start:worker     # Запуск be-vendure-worker

# Остановка всех backend сервисов
npm run down:be

# Пересборка конкретного сервиса
npm run build:service --service=be-vendure
```

### Docker Compose команды

```bash
# Запуск всех сервисов из docker-compose.local.yml
docker-compose -f docker-compose.local.yml up

# Запуск в фоновом режиме
docker-compose -f docker-compose.local.yml up -d

# Остановка всех сервисов
docker-compose -f docker-compose.local.yml down

# Пересборка и запуск
docker-compose -f docker-compose.local.yml up --build

# Просмотр логов
docker-compose -f docker-compose.local.yml logs -f [service_name]

# Остановка и удаление томов
docker-compose -f docker-compose.local.yml down -v
```

## Пошаговый запуск приложений

### 1. Запуск nginx в Docker

```bash
# Запуск nginx
npm run start:nginx

# Или напрямую через docker-compose
docker-compose -f docker-compose.local.yml up nginx
```

**Особенности nginx:**
- Проксирует API запросы к be-vendure
- Обслуживает статические файлы
- Поддерживает WebSocket для HMR
- Конфигурация: `nginx/nginx.conf`

### 2. Запуск postgres-vendure в Docker

```bash
# Запуск PostgreSQL
npm run start:db

# Или напрямую через docker-compose
docker-compose -f docker-compose.local.yml up postgres-vendure
```

**Особенности PostgreSQL:**
- База данных: `vendure`
- Пользователь: `postgres`
- Пароль: `postgres123`
- Порт: `5432`
- Поддерживает health checks
- Данные сохраняются в Docker volume

### 3. Запуск be-vendure

```bash
# Запуск основного backend сервиса
npm run start:vendure

# Или напрямую через docker-compose
docker-compose -f docker-compose.local.yml up be-vendure
```

**Особенности be-vendure:**
- Основной API сервис на Vendure
- Порт: 3000 (API), 3002 (Admin UI)
- Автоматически ждет готовности PostgreSQL
- Поддерживает hot-reload для разработки
- Доступен Admin UI по адресу: http://localhost:3002

### 4. Запуск be-vendure-worker

```bash
# Запуск worker процесса
npm run start:worker

# Или напрямую через docker-compose
docker-compose -f docker-compose.local.yml up be-vendure-worker
```

**Особенности be-vendure-worker:**
- Обрабатывает фоновые задачи
- Порт: 3001
- Зависит от готовности PostgreSQL
- Обрабатывает email, уведомления, аналитику

### 5. Запуск client-shell (Frontend)

```bash
# Запуск главного frontend приложения
npm run start:clients
```

**Особенности client-shell:**
- Главное приложение с Module Federation
- Порт: 4200
- Загружает remote приложения (client_products, client_product_details)
- Поддерживает SSR
- Hot Module Replacement для разработки

### Полный процесс запуска

```bash
# 1. Запуск всех backend сервисов
npm run start:be-all

# 2. В отдельном терминале - запуск frontend
npm run start:clients
```

## Полезные команды

### Работа с базой данных

```bash
# Заполнение базы тестовыми данными
npm run populate_data:be_vendure

# Запуск миграций Vendure
npm run run:vendure:migrations
```

### Управление микросервисами

```bash
# Добавление нового remote приложения
npm run add:new-remote-app

# Удаление remote приложения
npm run remove:remote-app
```

### Отладка

```bash
# Просмотр логов конкретного сервиса
docker-compose -f docker-compose.local.yml logs -f be-vendure

# Подключение к контейнеру
docker exec -it be-vendure bash

# Проверка статуса сервисов
docker-compose -f docker-compose.local.yml ps
```

## Порты и доступ

- **Frontend**: http://localhost:4200 (client-shell)
- **Backend API**: http://localhost:3000 (be-vendure API)
- **Admin UI**: http://localhost:3002 (Vendure Admin)
- **PostgreSQL**: localhost:5432
- **Nginx**: http://localhost:80 (проксирует все запросы)

